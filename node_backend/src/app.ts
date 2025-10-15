import express, { Request } from "express";
import Jobs from "./database/models";
import fileUpload, { UploadedFile } from "express-fileupload";
import { PDFParse } from "pdf-parse";
import { redis } from "./database/init";

const app = express();

app.use((req, res, next) => {
    console.log("Incoming Content-Type:", req.headers["content-type"]);
    next();
});
app.use(fileUpload())

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
    let parser: PDFParse | null = null;
    try {
        if (!req.files || Object.keys(req.files).length === 0 || !("file" in req.files)) {
            return res.status(400).send('No files were uploaded.');
        }
        const file = req.files.file as unknown as UploadedFile;
        parser = new PDFParse({ data: file.data });
        let text = await parser.getText()
        console.log(text.text);
        res.status(200).json({ message: "Found" })
    } catch (err) {
        console.log("ERROR:: ", err)
        return res.status(400).send('Readng error.');
    } finally {
        if (parser instanceof PDFParse) {
            parser.destroy();
        }
    }
})

export default app;