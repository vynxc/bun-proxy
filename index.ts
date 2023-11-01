import express from "express";
import { routes } from "./routes";

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

routes.forEach((route) => app.use(route));

app.listen(port, () => {
    if (!process.env.PORT) {
        console.warn(`No PORT environment variable found, defaulting to ${port}.`);
    }
    if (!process.env.PROXY_URL) {
        console.warn(`No PROXY_URL environment variable found! This may cause issues. Defaulting to ${process.env.PROXY_URL ?? process.env.PORT ? `http://localhost:${process.env.PORT}/` : "http://localhost:8080"}.`);
    }
    console.log(`Listening on port ${port}. Proxy URL is ${process.env.PROXY_URL ?? process.env.PORT ? `http://localhost:${process.env.PORT}/` : "http://localhost:8080"}.`);
});
