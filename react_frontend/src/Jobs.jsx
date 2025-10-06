import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
import axios from "axios";
import Job_Description from "./jd";
import { useState, useEffect, useRef } from "react";
import { useCallback } from "react";
import { useMemo } from "react";

function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        if (typeof window === "undefined") return initialValue;
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : initialValue;
        } catch (err) {
            console.error("Error accessing localStorage:", err);
            return initialValue;
        }
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error("Error saving to localStorage:", err);
        }
    }, [key, value]);

    return [value, setValue];
}


export default function Jobs({ searchValue }) {
    console.log("RECEIVED:: ", searchValue);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [jobsLoading, setJobsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useLocalStorage("jobFilters", []);
    const [job, setJob] = useLocalStorage("selectedJob", null);

    const filterOptions = {
        "Engineering": "engineering", "Software": "software_and_technology", "Sales": "sales_and_marketing",
        "Business": "business_operations", "Food and hospitality": "food_and_hospitality", "Healthcare": 'healthcare', "Education": 'education_and_training', "Media / design": 'creative_design_media',
        "Law": "legal_and_compliance", "Labour": 'skilled_trades_or_labor', "Science and Research": 'science_and_research', "Government": 'government_and_public_sector',
        "Finance and banking": "finance_and_banking", "Retail and Customer service": 'retail_and_customerservice', "Logistics and Supply Chain": 'logistics_and_supply_chain', "Other": 'Other'
    };

    function add_filter(val) {
        if (filter.includes(val)) {
            setFilter(filter.filter((f) => f !== val));
        } else {
            setFilter([...filter, val]);
        }
    }
    const filter_urlz = useMemo(() => {
        return filter.map(f => `&filters=${f}`).join(``);
    }, [filter]);

    const observerRef = useRef(null);

    const fetch_jobs = useCallback(async (page = 1, limit = 10, append = false) => {
        try {
            setJobsLoading(true);
            if (!append) {
                setJobs([]);
                setJob(null);
            }

            const baseUrl = import.meta.env.VITE_PUBLIC_JOBS_URL;
            if (!baseUrl) {
                setError("No jobs URL found in environment variables.");
                console.log(baseUrl);
                return;
            }

            const url = `${baseUrl}?page=${page}&page_size=${limit}${filter_urlz}`;
            const response = await axios.get(url);

            if (response.status === 200 && response.data?.jobs) {
                let newJobs = response.data.jobs;

                if (searchValue?.length > 0) {
                    newJobs = newJobs.filter((data) =>
                        [data.title, data.category, data.tags, data.company]
                            .join(" ")
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                    );
                }

                setJobs((prev) => append ? [...prev, ...newJobs] : newJobs);
                setJob((prev) => prev ?? newJobs[0]);
                setHasMore(newJobs.length === limit);
            } else {
                setError("Unable to fetch jobs at this moment.");
                setHasMore(false);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Unable to fetch jobs at this time.");
            setHasMore(false);
        } finally {
            setJobsLoading(false);
            setLoadingMore(false);
        }
    }, [filter_urlz, searchValue]);

    useEffect(() => {
        fetch_jobs();
    }, [fetch_jobs, searchValue]);


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
            <div className="p-3 mt-2 bg-white mr-3 ml-2 flex flex-wrap justify-start gap-9 shadow-2xl">
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
                        {jobs.map((data, index) => (
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
                                    <img
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