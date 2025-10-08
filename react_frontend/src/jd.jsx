import { Building2, Briefcase } from "lucide-react";
import { Quantum } from "ldrs/react";
import { useState, useEffect, useRef } from "react";
import React from "react";
import html2pdf from "html2pdf.js";
import { X } from "lucide-react";


export default function Job_Description({ job }) {
    const [showJobDes, setShowJobDes] = useState(true);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMess, setErrorMess] = useState("");
    const [generatedLetter, setGeneratedLeter] = useState();
    const [showLetter, setShowLetter] = useState(false);
    const [downloadError, setDownloadError] = useState("");
    const [downloadPopup, setDownloadPopup] = useState(false);
    const letter = useRef();

    const analysisUrl = import.meta.env.VITE_PUBLIC_ANALYSE_URL + `?jobId=${job.id}`;
    const letterUrl = import.meta.env.VITE_PUBLIC_GENERATE_URL + `?jobId=${job.id}`;

    async function fetch_analysis() {
        try {
            setErrorMess("");
            setIsLoading(true);
            const response = await fetch(analysisUrl,
                {
                    method: "GET",
                    credentials: "include",
                });
            const data = await response.json();
            if (response.ok && data["status"] === 200) {
                let analysis = data['analysis'];
                if (typeof analysis === "string") {
                    try {
                        analysis = JSON.parse(analysis);
                    } catch (err) {
                        console.error("Invalid JSON in analysis:", analysis);
                    }
                }
                setAnalysisData(analysis);
                console.log("Fetched analysis data:", analysis);
            } else {
                setErrorMess(data["message"]);
            }
        } catch (error) {
            console.log(error)
            setErrorMess("Unable to perform Analysis at this time");
        } finally {
            setIsLoading(false);
        }
    }

    async function generate_letter() {
        try {
            console.log("GENERATION STARTED  ")
            setErrorMess("");
            setIsLoading(true);
            const resp = await fetch(letterUrl, {
                method: "GET",
                credentials: "include"
            });
            const data = await resp.json();
            if (resp.status == 200) {
                console.log("RECEIVED:: ", typeof (data["letter"]));
                setGeneratedLeter(data["letter"]);
            }
            else {
                setErrorMess(data["message"]);
            }
        } catch (error) {
            console.log("ERROR WHILE GENERATING COVER LETTER:: ", error);
            setErrorMess("Unable to generate cover letter at this time");
        } finally {
            setIsLoading(false);
        }
    }

    async function show_analysis() {
        setShowJobDes(false);
        setShowAnalysis(true);
        await fetch_analysis()
    }
    async function show_letter() {
        setShowJobDes(false);
        setShowLetter(true);
        await generate_letter();
    }
    async function download_cover() {
        console.log("CALLEDDDDD")
        if (!job || !generate_letter) {
            setDownloadError("Unable to download");
            return;
        }
        else {
            setDownloadPopup(true);
            const jt = job.title.replace(/[^\w\s]/gi, "").replace(/\s+/g, "_") || "Job";
            const jcomp = job.company.replace(/[^\w\s]/gi, "").replace(/\s+/g, "_") || "Company";
            const fileName = `Cover_letter_${jcomp}_${jt}.pdf`;

            const element = letter.current;
            const opt = {
                margin: 0.5,
                filename: fileName,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
            };
            html2pdf().from(element).set(opt).save()
        }
    }
    return (
        <>
            {/* ================= JOB DESCRIPTION SECTION ================= */}
            {showJobDes && (
                <div className="w-full mt-2 text-gray-800 bg-white rounded-2xl shadow-md p-8 overflow-y-auto max-h-[80vh]">
                    <div className="border-b pb-4 mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
                        <span className="text-sm text-gray-500">
                            Posted on:{" "}
                            <span className="font-medium text-gray-700">
                                {new Date(job.created_at).toLocaleDateString()}
                            </span>
                        </span>
                    </div>

                    <div className="space-y-3 mb-8 flex justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <Briefcase size={18} className="text-blue-600" />
                                <h4 className="font-semibold text-gray-900">Role:</h4>
                                <p className="text-gray-700">{job.title}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 size={18} className="text-blue-600" />
                                <h4 className="font-semibold text-gray-900">Company:</h4>
                                <p className="text-gray-700">{job.company}</p>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={show_analysis}
                                className="bg-blue-500 p-2 rounded cursor-pointer text-white transition-all duration-200 hover:bg-blue-600"
                            >
                                Perform Analysis
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={show_letter}
                                className="bg-blue-500 p-2 rounded cursor-pointer text-white hover:bg-blue-600">
                                Generate Cover Letter
                            </button>
                        </div>
                        <div>
                            <button className="bg-blue-500 p-2 rounded cursor-pointer text-white transition-all duration-200 hover:bg-blue-600">
                                <a href={job.link} target="_blank">Apply directly</a>
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 border-l-4 border-blue-600 pl-3">
                            Requirements
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {job.requirements || "No specific requirements listed."}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 border-l-4 border-blue-600 pl-3">
                            About the Role
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {job.description || "Description not available."}
                        </p>
                    </div>
                </div>
            )}

            {/* ================= ANALYSIS SECTION ================= */}
            {showAnalysis && (
                <div className="w-full mt-2 text-gray-800 bg-white rounded-2xl shadow-md p-8 overflow-y-auto max-h-[80vh]">
                    <div className="border-b pb-4 mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Analysis</h2>
                        <button
                            onClick={() => {
                                setShowAnalysis(false);
                                setShowJobDes(true);
                            }}
                            className="bg-gray-500 p-2 rounded text-white hover:bg-gray-600"
                        >
                            Back to Job
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center py-10">
                            <Quantum size={100} />
                        </div>
                    )}

                    {!isLoading && errorMess && (
                        <p className="text-red-600 text-center">{errorMess}</p>
                    )}

                    {!isLoading && !errorMess && analysisData && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-600 mb-2 border-l-4 border-blue-600 pl-3">
                                    Match Score
                                </h3>
                                <p className="text-2xl font-bold text-green-700">
                                    {analysisData.match_score || "N/A"}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 border-l-4 border-blue-600 pl-3">
                                    Summary & Reasoning
                                </h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {analysisData.summary_and_reasoning || "No summary available."}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-600 mb-2 border-l-4 border-blue-600 pl-3">
                                    Relevant Skills and Experiences
                                </h3>
                                {Array.isArray(analysisData?.relevant_skills_and_experiences) &&
                                    analysisData.relevant_skills_and_experiences.length > 0 ? (
                                    <ul className="list-disc ml-5 space-y-2">
                                        {analysisData.relevant_skills_and_experiences.map((dat, idx) => (
                                            <li key={idx} className="text-gray-700">{dat}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">No relevant skills found.</p>
                                )}
                            </div>

                            {/* Areas for Improvement */}
                            <div>
                                <h3 className="text-lg font-semibold text-red-600 mb-2 border-l-4 border-red-600 pl-3">
                                    Areas for Improvement
                                </h3>
                                {Array.isArray(analysisData?.areas_for_improvement) &&
                                    analysisData.areas_for_improvement.length > 0 ? (
                                    <ul className="list-disc ml-5 space-y-2">
                                        {analysisData.areas_for_improvement.map((dat, idx) => (
                                            <li key={idx} className="text-gray-700">{dat}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">No improvement suggestions found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* ================= COVER LETTER SECTION ================= */}
            {showLetter && (
                <div className="w-full mt-2 text-gray-800 bg-white rounded-2xl shadow-md p-8 overflow-y-auto max-h-[80vh]">
                    <div className="border-b pb-4 mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Generated Cover Letter</h2>
                        <button
                            onClick={() => {
                                setShowLetter(false);
                                setShowJobDes(true);
                            }}
                            className="bg-gray-500 p-2 rounded text-white hover:bg-gray-800"
                        >
                            Back to Job
                        </button>
                        <button
                            onClick={download_cover}
                            className="bg-gray-500 p-2 rounded text-white hover:bg-blue-400 cursor-pointer"
                        >
                            Download cover letter
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center py-10">
                            <Quantum size={100} />
                        </div>
                    )}

                    {!isLoading && errorMess && (
                        <p className="text-red-600 text-center">{errorMess}</p>
                    )}

                    {!isLoading && !errorMess && generatedLetter && (
                        <div className="space-y-8 bg-gray-800 p-8">
                            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12" ref={letter}>
                                <p className="text-lg font-semibold text-black">
                                    {generatedLetter.split("\n").map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                        </div>
                    )}
                    {downloadPopup && (
                        <div className=
                            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 w-[400px] h-[200px] rounded-2xl shadow-lg z-50 p-6"
                        >
                            <div className="float-right">
                                <X className="text-red-600 cursor-pointer" onClick={() => setDownloadPopup(false)}></X>
                            </div>
                            <div className="ml-10 mt-8">
                                <p className="text-black"><b>Please note:</b></p>
                                <p>The generated letter still needs to be edited and refined further for use.</p>
                            </div>
                            {downloadError.length > 0 && (
                                <div className="flex justify-center">
                                    <p className="text-red-500">{downloadError}</p>
                                </div>
                            )}
                        </div>
                    )
                    }
                </div>
            )}
        </>
    );
}
