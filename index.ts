import express from "express";
import { routes } from "./routes";
const app = express();
const port = process.env.PORT??8080;

routes.forEach(route => app.use(route));

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});


