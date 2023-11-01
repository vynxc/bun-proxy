import express from "express";
import proxy from "express-http-proxy";
import { removeHeaders } from "../utils/remove-headers";

const router = express.Router();

export const proxyRoute = router.use(
    "/proxy/:url/:headers?",
    proxy(
        function (req) {
            return decodeURIComponent(req.params.url);
        },
        {
            proxyReqPathResolver: function (req) {
                const uri = new URL(req.params.url);
                const path = uri.pathname + uri.search;
                return path;
            },
            proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
                const encodedheaders = srcReq.params.headers;

                let headers: Record<string, string> = {};
                if (encodedheaders) {
                    headers = JSON.parse(decodeURIComponent(encodedheaders)) as Record<string, string>;
                }
                proxyReqOpts.headers = { ...proxyReqOpts.headers, ...headers };
                removeHeaders(proxyReqOpts.headers as Record<string, string>);
                return proxyReqOpts;
            },
            userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
                userReq.query.forcedHeadersProxy = userReq.query.forcedHeadersProxy ?? "{}";
                const forcedHeadersProxy = decodeURIComponent(userReq.query.forcedHeadersProxy as string);
                const headersToReAdd = JSON.parse(forcedHeadersProxy) as Record<string, string>;
                for (const key in headersToReAdd) {
                    headers[key] = headersToReAdd[key];
                }
                removeHeaders(headers);
                return headers;
            },
            proxyErrorHandler(err, res, next) {
                if (err.message) res.status(500).json({ error: err.message });
                else res.status(500).json({ error: "Internal server error" });
            },
        },
    ),
);
