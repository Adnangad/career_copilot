"use client";

import { useState, useRef } from "react";
import "./styles/Header.css";
import Image from "next/image";
import { X } from "lucide-react";
import { Bouncy } from "ldrs/react";
import 'ldrs/react/Bouncy.css';

export default function Header() {
    const [showUpload, setShowUpload] = useState(false);
    const fileInputRef = useRef(null);
    const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL;
    const [errorMess, setErrorMess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    console.log("SHOW UPLOAD IS:: ", showUpload);

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            setErrorMess("")
            setIsLoading(true);
            if (fileInputRef.current.files.length <= 0) {
                setErrorMess("Please upload a file")
                return;
            }
            const formData = new FormData();
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
        } catch (error: any) {
            console.log(error)
            setIsLoading(false);
            setErrorMess("Unable To Upload your resume at this time");
        }
    }

    return (
        <div className="headerz ml-2">
            <div className="logo">
                <a href="#">
                    <Image src='/logo.svg' className="Testlogo" alt="Logo" width={130} height={50} />
                </a>
            </div>

            <nav className="navBar">
                <div>
                    <input type="text" className="border rounded-2xl p-2 w-2xl" placeholder="Search..."></input>
                </div>
                <div className="ml-30 cursor-pointer" onClick={() => setShowUpload(true)}>
                    <Image
                        className="hover:bg-gray-300"
                        src="/download.svg" alt="Upload Resume" width={20} height={30}
                    ></Image>
                </div>
                <div className="settings">
                    <Image src='/settings.svg' alt="settings" width={20} height={30}></Image>
                    <Image src="/options.svg" alt="settings" width={10} height={30} />
                </div>
            </nav>
            {showUpload && (
                <div className=
                    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300 w-[400px] h-[320px] rounded-2xl shadow-lg z-50 p-6"
                >
                    <div className="float-right">
                        <X className="text-red-600 cursor-pointer" onClick={() => {setShowUpload(false); setIsLoading(false)}}></X>
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
