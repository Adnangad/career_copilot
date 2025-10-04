"use client";
import { JOBDATA } from "./types";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
import axios from "axios";
import Image from "next/image";
import Job_Description from "./jd";
import { useState, useEffect, useRef } from "react";

export default function Jobs() {
    const [jobs, setJobs] = useState<JOBDATA[]>([]);
    const [job, setJob] = useState<JOBDATA | null>(null);
    const [error, setError] = useState("");
    const [jobsLoading, setJobsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState([]);
    const [applyFilter, setApplyFilter] = useState(false);
    const filterOptions = {
        "Engineering": "engineering", "Software": "software_and_technology", "Sales": "sales_and_marketing",
        "Business": "business_operations", "Food and hospitality": "food_and_hospitality", "Healthcare": 'healthcare', "Education": 'education_and_training', "Media / design": 'creative_design_media',
        "Law": "legal_and_compliance", "Labour": 'skilled_trades_or_labor', "Science and Research": 'science_and_research', "Government": 'government_and_public_sector',
        "Finance and banking": "finance_and_banking", "Retail and Customer service": 'retail_and_customerservice', "Logistics and Supply Chain": 'logistics_and_supply_chain', "Other": 'Other'
    };

    console.log("APPLY FILTER IS:: ", applyFilter)
    let filter_urlz = "";
    function add_filter(val: string) {
        if (filter.includes(val)) {
            setFilter(filter.filter((f) => f !== val));
        } else {
            setFilter([...filter, val]);
        }
    }

    for (let i = 0; i < filter.length; i++) {
        filter_urlz += `&filters=${filter[i]}`;
    }

    const observerRef = useRef<HTMLDivElement | null>(null);

    async function fetch_jobs(page = 1, limit = 10, append = false) {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_JOBS_TEST;
            if (!baseUrl) {
                setError("No jobs URL found in environment variables.");
                return;
            }
            const url = `${baseUrl}?page=${page}&page_size=${limit}${filter_urlz}`;
            const response = await axios.get(url);

            if (response.status === 200 && response.data?.jobs) {
                console.log("Jobs fetched successfully");
                const newJobs = response.data.jobs

                setJobs((prev) => append ? [...prev, ...newJobs] : newJobs);
                setJob((prev) => prev ?? newJobs[0]);
                setHasMore(newJobs.length === limit)
            } else {
                setError("Unable to fetch jobs at this moment.");
                setHasMore(false)
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Unable to fetch jobs at this time.");
            setHasMore(false)
        } finally {
            setJobsLoading(false);
            setLoadingMore(false);
        }
    }
    if (filter.length > 0 && applyFilter) {
        fetch_jobs();
        setApplyFilter(false)
    }
    useEffect(() => {
        fetch_jobs();
    }, [fetch_jobs]);

    useEffect(() => {
        if (!observerRef.current || !hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !loadingMore) {
                setLoadingMore(true);
                const nextPage = page + 1;
                setPage(nextPage);
                fetch_jobs(nextPage, 10, true);
            }
        });
        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [observerRef, page, hasMore, loadingMore, fetch_jobs])

    return (
        <>
            <div className="w-full p-3 mt-2 bg-white mr-2 ml-2 flex flex-wrap justify-start gap-9">
                {Object.keys(filterOptions).map((key) => (
                    <div key={key}>
                        <button onClick={() => add_filter(filterOptions[key])}
                            className={`cursor-pointer p-2 rounded-xl border ${filter.includes(filterOptions[key])
                                ? "bg-blue-500 text-white"
                                : "bg-gray-50 hover:border-blue-600 hover:bg-gray-300"
                                } transition-all duration-200`}
                        >{key}</button>
                    </div>
                ))}
                <div>
                    <button
                        className="cursor-pointer p-2 rounded-xl border bg-gray-300 hover:bg-blue-300"
                        onClick={() => setApplyFilter(true)}
                    >Apply Filters</button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-5 mt-2 rounded-2xl ml-2">
                <div className="bg-white shadow-md rounded-2xl w-full md:w-[30%] p-5 overflow-y-auto max-h-[80vh]">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Available Jobs</h3>

                    {jobsLoading && (
                        <div className="flex justify-center items-center py-10">
                            <Quantum size={100} />
                        </div>
                    )}

                    {!jobsLoading && error && (
                        <p className="text-red-600 text-center">{error}</p>
                    )}

                    {!jobsLoading && !error && jobs.length === 0 && (
                        <p className="text-gray-600 text-center">No jobs available right now.</p>
                    )}

                    <div className="space-y-3">
                        {jobs.filter((data) => filter.length === 0 || filter.includes(data.category)).map((data, index) => (
                            <div
                                key={index}
                                onClick={() => setJob(data)}
                                className={`cursor-pointer p-4 rounded-xl border ${job?.id === data.id
                                    ? "bg-blue-50 border-blue-500"
                                    : "bg-gray-50 hover:bg-gray-300 border-gray-200"
                                    } transition-all duration-200`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{data.title}</h4>
                                        <p className="text-sm text-gray-600">{data.company}</p>
                                        <p className="text-sm text-gray-600">{data.tags}</p>
                                    </div>
                                    <Image
                                        src="/moreData.svg"
                                        alt="More Options"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                            </div>
                        ))}
                        {hasMore && (
                            <div ref={observerRef} className="flex justify-center py-5">
                                {loadingMore && <Quantum size={30} />}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    {job ? (
                        <Job_Description job={job} />
                    ) : (
                        <div className="flex justify-center items-center h-[60vh] text-gray-600">
                            Select a job to view details
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}