import { JOBDATA, ANALYSISDATA } from "./types";
import { Building2, Briefcase } from "lucide-react";
import { Quantum } from "ldrs/react";
import { useState } from "react";
import Cookies from 'js-cookie';

export default function Job_Description({ job }: { job: JOBDATA }) {
    const [showJobDes, setShowJobDes] = useState(true);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState<ANALYSISDATA>();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMess, setErrorMess] = useState("");
    const analysisUrl = process.env.NEXT_PUBLIC_ANALYSE_URL + `?jobId=${job.id}`;
    const authToken = Cookies.get('session_id');
    console.log('Client-side auth token:', authToken);
    console.log("COOKIE:: ", document.cookie)

    async function fetch_analysis() {
        try {
            const response = await fetch(analysisUrl,
                {
                    method: "GET",
                    credentials: "include",
            });
            const data = await response.json()
            if (response.status === 200 && data?.analysis) {
                setAnalysisData(data.analysis);
            } else {
                setErrorMess(data?.message);
            }
        } catch (error: any) {
            console.log(error)
            setErrorMess("Unable to perform Analysis at this time");
        } finally {
            setIsLoading(false);
        }
    }

    async function show_analysis() {
        setShowJobDes(false);
        setShowAnalysis(true);
        setIsLoading(true);
        await fetch_analysis();
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
                        <>
                            <h3 className="text-lg font-semibold text-green-600 mb-2 border-l-4 border-blue-600 pl-3">
                                Relevant Skills and Experiences
                            </h3>
                            {analysisData.relevant_skills_and_experiences.length > 0 ? (
                                analysisData.relevant_skills_and_experiences.map((dat, idx) => (
                                    <p key={idx} className="text-gray-700">{dat}</p>
                                ))
                            ) : (
                                <p>No relevant skills found.</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
}
