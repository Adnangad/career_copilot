"use client";
import Image from "next/image";
import Jobs from "./jobs";
import 'ldrs/react/Quantum.css'
import { JOBDATA } from "./types";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [jobs, setJobs] = useState<JOBDATA[]>([])
  const [error, setError] = useState("");
  const [jobsLoading, setJobsLoading] = useState(true);
  useEffect(() => {
    async function fetch_jobs(page = 1, limit = 10) {
      try {
        let url = process.env.NEXT_PUBLIC_JOBS_URL;
        url += `?page=${page}&page_size=${limit}`;
        if (url) {
          const response: Response = await axios.get(url);
          if (response.status == 200) {
            console.log("SUCCESS IN FETCHING THE DATA")
            const data = await response.json()
            setJobs(data);
            setJobsLoading(false);
          }
          else setError("Unable To fetch jobs at this moment");
        }
        else {
          console.error("NO FETCH JOBS URL FOUND");
          setError("Unable to fetch jobs at this moment");
          setJobsLoading(false);
        }
      }
      catch (err: any) {
        console.error("ERROR IS:: ", err);
        setError("Unable to fetch jobs at this time");
        setJobsLoading(false);
      }
    }
    fetch_jobs()
  }, [jobs]);
  return (
    <>
      <div className="w-full h-20 p-2 bg-white flex items-center justify-between px-6 rounded-2xl mt-2">
        <div className="relative w-[300px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src="/search.svg" alt="Search Icon" width={16} height={16} />
          </span>
          <input
            type="text" placeholder="Search..."
            className="pl-10 pr-4 py-2 w-[500px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-200"
          />
        </div>
        <div className="border rounded-xl flex items-center justify-between gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200 w-[200px] ml-50">
          <p>Filter</p>
          <Image src="/ArrowDown.svg" alt="arrow icon" width={16} height={16} />
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-cyan-900">
          <Image src="/download.svg" alt="download icon" width={18} height={18} />
          <p>Upload Resume</p>
        </div>
      </div>
      <Jobs jobs={jobs} error={error} jobsLoading={jobsLoading}></Jobs>
    </>
  );
}
