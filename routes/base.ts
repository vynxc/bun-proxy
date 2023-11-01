import express from "express";
import proxy from "express-http-proxy";
import { removeHeaders } from "../utils/remove-headers";

const router = express.Router();


export const baseRoute = router.use("*", proxy(function (req) {
    const url = req.originalUrl.substring(1);
    if(!url.startsWith('http'))
        throw new Error("Invalid url");
    return url

}, {
    proxyReqPathResolver: function (req) {
        const url = req.originalUrl.substring(1);
        const uri = new URL(url);
        const path = uri.pathname + uri.search;
        return path;
    },
    userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
        removeHeaders(headers as Record<string, string>)
        return headers;
    }
}));
