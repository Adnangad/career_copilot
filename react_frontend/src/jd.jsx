
import { Building2, Briefcase } from "lucide-react";
import { Quantum } from "ldrs/react";
import { useState, useEffect } from "react";


export default function Job_Description({ job }) {
    const [showJobDes, setShowJobDes] = useState(true);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMess, setErrorMess] = useState("");
    const analysisUrl = import.meta.env.VITE_PUBLIC_ANALYSIS_TEST + `?jobId=${job.id}`;

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
            if (response.status === 200) {
                const parsedData = typeof data['analysis'] === "string" ? JSON.parse(data['analysis']) : data['analysis'];
                setAnalysisData(parsedData);
                localStorage.setItem(`${job.id}-analysis`, JSON.stringify(parsedData))
                console.log("fteched analysis data: ", parsedData)
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


    async function show_analysis() {
        setShowJobDes(false);
        setShowAnalysis(true);
        const cached = localStorage.getItem(`${job.id}-analysis`);
        if (cached) {
            try {
                setAnalysisData(JSON.parse(cached));
                setErrorMess("");
            } catch (e) {
                console.error("Failed to parse cached analysis:", e);
                await fetch_analysis();
            }
        } else {
            await fetch_analysis();
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
                            <button className="bg-blue-500 p-2 rounded cursor-pointer text-white hover:bg-blue-600">
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
            
        </>
    );
}
