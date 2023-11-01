import express, { Request, Response } from "express";
import { M3U8Parser,getUrl,makeRequest,removeHeaders } from "../utils";
const router = express.Router();

export const m3u8Route = router.get("/proxy/m3u8/:url/:headers?/:type?", async (req: Request, res: Response) => {
    try {
        const { url, headers: encodedHeaders } = req.params;
        const headers = parseHeaders(encodedHeaders);
        const response = await makeRequest(url, headers);

        if (!response || !response.ok) {
            return res.status(response?.status || 500).send(`Request to URL ${url} failed`);
        }

        const content = await response.text();
        const lines = content.split("\n");
        const isPlaylist = M3U8Parser.isPlaylistM3U8(lines);
        const suffix = buildSuffix(req.query.forcedHeadersProxy as string | undefined,encodedHeaders as string | undefined);
        const finalContent = M3U8Parser.fixAllUrlsToAbsolute(lines, url, getUrl(isPlaylist), suffix);
        const headersRecord: Record<string, string> = {};
        response.headers.forEach((value, key) => { headersRecord[key] = value; });
        sendResponse(res, headersRecord, finalContent);
    } catch (error: any) {
        res.status(500).send(`An error occurred: ${error?.message ?? 'Unknown error'}`);
    }
});

function parseHeaders(encodedHeaders: string | undefined): Record<string, string> {
    const decodedHeaders = decodeURIComponent(encodedHeaders || "");
    return decodedHeaders ? JSON.parse(decodedHeaders) : {};
}

function buildSuffix(forcedHeadersProxy: string | undefined, encodedHeaders:string | undefined): string {

    const headers = decodeURIComponent(encodedHeaders ?? "{}");
    let suffix = "";
    if (headers != '{}') {
        suffix += `/${encodeURIComponent(headers)}`
    }
    if (forcedHeadersProxy || forcedHeadersProxy != '{}') {
        suffix += `?forcedHeadersProxy=${encodeURIComponent(forcedHeadersProxy)}`
    }
    return suffix;
}



function sendResponse(res: Response, headers: Record<string, string>, content: string) {

    const headersToReAdd = prepareHeadersToReAdd(headers);
    removeHeaders(headersToReAdd);

    for (const [key, value] of Object.entries(headersToReAdd)) {
        res.setHeader(key, value);
    }

    res.send(content);
}

function prepareHeadersToReAdd(headers: Record<string, string>): Record<string, string> {
    const headersToReAdd: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
        if (!["transfer-encoding", "content-encoding"].includes(key.toLowerCase())) {
            headersToReAdd[key] = value;
        }
    }
    return headersToReAdd;
}
