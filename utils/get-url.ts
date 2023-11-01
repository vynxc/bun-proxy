const url = process.env.PROXYURL;
const M3u8Url = url + "proxy/m3u8/";
const ProxyUrl = url + "proxy/";

export function getUrl(isM3u8: boolean): string {
    let url = isM3u8 ? M3u8Url : ProxyUrl;
    return url;
}
