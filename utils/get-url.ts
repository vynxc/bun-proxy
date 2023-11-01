const url = process.env.PROXY_URL ?? process.env.PORT ? `http://localhost:${process.env.PORT}/` : "http://localhost:8080/";
const M3U8_URL = url + "proxy/m3u8/";
const PROXY_URL = url + "proxy/";

export function getUrl(isM3u8: boolean): string {
    let url = isM3u8 ? M3U8_URL : PROXY_URL;
    return url;
}
