import { redis } from "./init";

export async function  saveResume(token: string, resume: string) {
    const key = `resume_${token}`;
    try {
        await redis.set(key, resume)
        await redis.expire(key, 60*60*24);
    }catch (err) {
        console.log("Error while saving resume:: ", err);
        throw new Error("Unable to save resume");
    } 
}
