import { JOBDATA } from "./types";
import { Building2, Briefcase } from "lucide-react";

export default function Job_Description({ job }: { job: JOBDATA }) {
    return (
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
                    <button className="bg-blue-500 p-2 rounded cursor-pointer text-white transition-all duration-200 hover:bg-gray-300">Perform Analysis</button>
                </div>
                <div>
                    <button className="bg-blue-500 p-2 rounded cursor-pointer text-white hover:bg-gray-300">Generate Cover Letter</button>
                </div>
                <div>
                    <button className="bg-blue-500 p-2 rounded cursor-pointer text-white transition-all duration-200 hover:bg-gray-300"><a href={job.link}>Apply directly</a></button>
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
    );
}
