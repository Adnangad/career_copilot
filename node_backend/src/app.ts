import express from "express";
import Jobs from "./database/models";

const app = express();

app.get("/jobs", async(req, res) => {
    try {
        const jobs = await Jobs.findAll();
        res.status(200).json({jobs: jobs})
    } catch(err) {
        console.log("ERROR WHILE FETCHING:    ", err);
        res.status(500).json({message: "Unable to fetch data at this time"});
    }
});

export default app;