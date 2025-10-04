"use client";
import axios from "axios";
import { type } from "os";
import { JOBDATA } from "./types";
import { Quantum } from "ldrs/react";
import 'ldrs/react/Quantum.css'


export default function Jobs({ jobs, error, jobsLoading }: { jobs: JOBDATA[], error: string, jobsLoading: boolean }) {
    return (
        <div className="w-2/3">
            {jobsLoading &&
                <div className="w-full">
                    <Quantum size={50} speed={1.75} color="black"></Quantum>
                </div>}
            {jobs.length >= 1 ? (
                <div className="grid grid-cols-3 gap-4">
                    {jobs.map((job, index) => (
                        <div key={index}>
                            <p>{job.title}</p>
                            <p>{job.company}</p>
                            <p>{job.tags}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>{error}</p>
            )
            }
        </div>
    );
}