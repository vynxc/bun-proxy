import express from "express";
import { makeRequest } from "../utils/make-request";
import { M3U8Parser } from "../utils/m3u8-parser";
import { getUrl } from "../utils/get-url";
import { removeHeaders } from "../utils/remove-headers";
const router = express.Router();


export const m3u8 = router.get("/proxy/m3u8/:url/:headers?/:type?", async (req, res) => {
    const encodedheaders = req.params.headers;
    let headers: Record<string, string> = {};
    let headersString = "";
    if (encodedheaders) {
        headersString = decodeURIComponent(encodedheaders);
        headers = JSON.parse(headersString) as Record<string, string>;
    }
    const forcedHeadersProxy = (req.query.forcedHeadersProxy ?? '{}') as string;
    const url = decodeURIComponent(req.params.url);
    const response = await makeRequest(url, headers);
    if (!response || !response.ok) {
        res.send(`request to url ${url} failed with status code ${response?.status ?? "...its is what it is"}`);
        return;
    }
    const headersToReAdd: Record<string, string> = {};
    response.headers.forEach((value, key) => {headersToReAdd[key] = value});
    removeHeaders(headersToReAdd);
    for (const key in headersToReAdd) {
        res.setHeader(key, headersToReAdd[key]);
    }
    const content = await response.text();
    const lines = content.split("\n");
    const isPlaylist = M3U8Parser.isPlaylistM3U8(lines);
    const forcedHeadersString = forcedHeadersProxy == '{}' ? '' : `?forcedHeadersProxy=${encodeURIComponent(forcedHeadersProxy)}`;

    let suffix = headersString == "{}" ? '' : encodeURIComponent(headersString) + forcedHeadersString;
    if (suffix != "") suffix = "/" + suffix;
    var finalContent = M3U8Parser.fixAllUrlsToAbsolute(lines, url, getUrl(isPlaylist), suffix);
    res.send(finalContent);
});
