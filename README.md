# Bun M3u8 Proxy
Proxy m3u8 files with headers through pure NodeJS utilizing Bun.

## Installation
To install dependencies:

```bash
bun install
```

To run:

```bash
bun run build
bun start
```

## How to Use
If you have an m3u8 file such as https://live-par-1-abr-cdn.livepush.io/live/bigbuckbunnyclip/index.m3u8 with required headers being:
```json
{
    "Referer": "https://livepush.io"
}
```
You can proxy the file via the following code:
```javascript
const proxy = "http://localhost:8080";
const m3u8 = "https://live-par-1-abr-cdn.livepush.io/live/bigbuckbunnyclip/index.m3u8";
const headers = {
    Referer: "https://livepush.io"
};

const url = `${proxy}/proxy/m3u8/${encodeURIComponent(m3u8)}/${encodeURIComponent(JSON.stringify(headers))}`;
console.log(url);
// http://localhost:8080/proxy/m3u8/https%3A%2F%2Flive-par-1-abr-cdn.livepush.io%2Flive%2Fbigbuckbunnyclip%2Findex.m3u8/%7B%22Referer%22%3A%22https%3A%2F%2Flivepush.io%22%7D
```
Essentially, the URL configuration is like this:
```
http://localhost:8080/proxy/m3u8/{encodedM3u8FileURL}/{encodedStringifiedJSONHeaders}
http://localhost:8080/proxy/m3u8/https%3A%2F%2Fcdn.my%20file%20here.com/%7B%22HeaderKey%22%3A%22headerValue%22%7D
```

**Please make sure you also setup the `.env` file.**
```env
# The PUBLIC url of the proxy. There must be a / at the end.
PROXY_URL="http://localhost:8080/"
# The port to listen on.
PORT="8080"
```