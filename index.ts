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
    console.log(`Listening on port ${port}...`);
});
