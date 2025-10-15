import { Request } from "express";

export interface myRequest extends Request{
    cookie: string;
}