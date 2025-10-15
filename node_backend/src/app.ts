import express, { Request, Response } from "express";
import Jobs from "./database/models";
import fileUpload, { UploadedFile } from "express-fileupload";
import { PDFParse } from "pdf-parse";
import { redis } from "./database/init";
import { saveResume } from "./database/db_operations";
import cookieParser from "cookie-parser";
import { parseResume } from "./utils/utils";
import { myRequest } from "./types/types";
import crypto from "node:crypto"

const app = express();

app.use(cookieParser());
app.use(fileUpload())

app.use((req: Request, res: Response, next) => {
    const myReq = req as myRequest;
    if (myReq.cookies && myReq.cookies.token) {
        console.log("A cookie is present");
    }
    next();
});

app.get("/jobs", async (req, res) => {
    try {
        const jobs = await Jobs.findAll();
        res.status(200).json({ jobs: jobs })
    } catch (err) {
        console.log("ERROR WHILE FETCHING:    ", err);
        res.status(500).json({ message: "Unable to fetch data at this time" });
    }
});

app.post("/uploadResume", async (req: Request, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0 || !("file" in req.files)) {
            return res.status(400).send('No files were uploaded.');
        }
        const file = req.files.file as unknown as UploadedFile;
        const data = await parseResume(file);
        if (req.cookies.token) {
            const token = req.cookies.token;
            await saveResume(token, data);
        }
        else {
            const token = String(crypto.randomUUID());
            await saveResume(token, data);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                sameSite: "none",
            });
        }
        res.status(200).json({ status: "Success", message: "Uploaded resume successfully" });
    } catch (err) {
        console.log("ERROR:: ", err)
        return res.status(400).send(err);
    }
})

export default app;