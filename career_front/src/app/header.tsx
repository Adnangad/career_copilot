import { useState } from "react";
import "./styles/Header.css";
import Image from "next/image";

export default function Header() {
    return (
        <div className="headerz ml-2">
            <div className="logo">
                <a href="#">
                    <Image src='/logo.svg' className="Testlogo" alt="Logo" width={130} height={50} />
                </a>
            </div>

            <nav className="navBar">
                <div>
                    <input type="text" className="border rounded-2xl p-2" placeholder="Search..."></input>
                </div>
                <div className="settings">
                    <Image src='/settings.svg' alt="settings" width={20} height={30}></Image>
                    <Image src="/options.svg" alt="settings" width={10} height={30}/>
                </div>
            </nav>
        </div>
    );
}
