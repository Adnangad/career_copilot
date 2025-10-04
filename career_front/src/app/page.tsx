"use client";
import Jobs from "./jobs";
import "ldrs/react/Quantum.css";
import Header from "./header";


export default function Home() {
  return (
    <>
      <>
        <Header></Header>
        <Jobs></Jobs>
        <footer className="p-4 grid-cols-3 flex justify-center gap-8 bg-gray-200">
          <div>
            <p>About</p>
          </div>
          <div>
            <p>Github</p>
          </div>
        </footer>
      </>
    </>
  );
}
