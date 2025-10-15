import { PDFParse } from "pdf-parse";
import { UploadedFile } from "express-fileupload";


export async function parseResume(file: UploadedFile) {
    let parser: PDFParse | null = null;
    try {
        const fileData = file.data;
        parser = new PDFParse({data: fileData});
        let text = await parser.getText();
        return text.text;
    }
    catch (err) {
        console.log("Error while parsing pdf:: ", err);
        throw new Error("Unable to parse pdf");
    }
    finally {
        if (parser) await parser.destroy()
    }
}