import express from "express";
import { m3u8 } from "./routes/m3u8";
import { proxyRoute } from "./routes/proxy";
import { baseRoute } from "./routes/base";
const app = express();
const port = process.env.PORT??8080;

app.use(m3u8)
app.use(proxyRoute)
app.use(baseRoute)

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});


