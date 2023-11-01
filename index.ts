import express from "express";
import { m3u8 } from "./routes/m3u8";
import { proxyRoute } from "./routes/proxy";
import { baseRoute } from "./routes/base";

const app = express();
const port = process.env.PORT ?? 8080;

app.get("/", (req, res) => {
    return res.status(200).jsonp(`Welcome to Chayce's m3u8 proxy! Please star the repository at https://github.com/chaycee/bun-proxy.
    Routes:
    /proxy/m3u8/:url/:headers?/:type?
    /proxy/:url/:headers?/:type?
    /:url/:headers?/:type?
    `);
});

app.use(m3u8);
app.use(proxyRoute);
app.use(baseRoute);

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
