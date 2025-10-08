"use client";
import { useState, useRef } from "react";
import "./styles/Header.css";
import { X } from "lucide-react";
import { Bouncy } from "ldrs/react";
import 'ldrs/react/Bouncy.css';

export default function Header({ setSearch }) {
    const [showUpload, setShowUpload] = useState(false);
    const fileInputRef = useRef(null);
    const resumeUrl = import.meta.env.VITE_PUBLIC_RESUME_URL;
    const [errorMess, setErrorMess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchVal, setSearchVal] = useState("");

    async function applySearch() {
        console.log("SEARCHING:>>> ", searchVal)
        setSearch(searchVal);
    }
    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            setErrorMess("")
            setIsLoading(true);
            const formData = new FormData();
            if (fileInputRef.current.files.length <= 0) {
                setErrorMess("Please upload a file")
                return;
            }
            if (fileInputRef.current.files.length > 0) {
                formData.append('file', fileInputRef.current.files[0])
            };
            const response = await fetch(resumeUrl, {
                method: 'POST',
                body: formData,
                credentials: "include"
            });
            const result = await response.json();
            if (result.status == 200) {
                setIsLoading(false);
                setShowUpload(false);
            } else {
                setIsLoading(true);
                setErrorMess("Unable To Upload your resume at this time");
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false);
            setErrorMess("Unable To Upload your resume at this time");
        }
    }

    return (
        <div className="headerz ml-2 shadow-2xl">
            <div className="logo">
                <a href="#">
                    <img src='/logo.svg' className="Testlogo" alt="Logo" width={100} height={20} />
                </a>
            </div>

            <nav className="navBar">
                <div>
                    <div className="relative inline-block">
                        <input
                            type="text"
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="border rounded-2xl p-2 pr-8 w-2xl"
                            placeholder="Search..."
                        />

                        {/* Clear button */}
                        {searchVal && (
                            <button
                                onClick={() => {
                                    setSearchVal("");
                                    setSearch("");
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-300 hover:text-gray-800 cursor-pointer"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button type="submit"
                        onClick={applySearch}
                        className="ml-3 p-2 pl-5 pr-5 bg-blue-400 rounded-xl text-white cursor-pointer hover:bg-blue-200 hover:text-black"
                    >Search</button>
                </div>
                <div className="ml-30 flex cursor-pointer justify-between mr-5" onClick={() => setShowUpload(true)}>
                    <img
                        className="hover:bg-gray-300"
                        src="/download.svg" alt="Upload Resume" width={20} height={30}
                    ></img>
                    <span>Upload resume</span>
                </div>
            </nav>
            {showUpload && (
                <div className=
                    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300 w-[400px] h-[320px] rounded-2xl shadow-lg z-50 p-6"
                >
                    <div className="float-right">
                        <X className="text-red-600 cursor-pointer" onClick={() => { setShowUpload(false); setIsLoading(false) }}></X>
                    </div>
                    <div className="ml-8 mt-5">
                        <h2 className="text-xl font-bold mb-2">Upload your resume</h2>
                        <p className="text-white"><b>Please note that your resume will only be saved in the db for 24 hrs, afterwhich, youll need to reupload</b></p>
                    </div>
                    <div className="mt-5 bg-white">
                        <input type="file" className="p-4 cursor-pointer" ref={fileInputRef}></input>
                    </div>
                    <div className="mt-4 flex justify-center">
                        {isLoading ?
                            (
                                <Bouncy size={45} color="orange"></Bouncy>
                            )
                            :
                            (< button type="submit"
                                onClick={(e) => handleSubmit(e)}
                                className="bg-gray-400 cursor-pointer pr-4 pl-4 pt-2 pb-2 rounded hover:bg-blue-600 hover:text-white"
                            >Upload</button>)}
                    </div>
                    {errorMess.length > 0 && (
                        <div className="flex justify-center">
                            <p className="text-red-500">{errorMess}</p>
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}
