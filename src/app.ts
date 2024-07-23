import express from "express";
import { json, urlencoded } from "body-parser";
import { db } from "./config/couchbase";
import router from "./routers";

const app = express();

// initialize global middlewares
app.use(urlencoded({ extended: false }));
app.use(json());

db();

app.use("/api", router);

app.get("/", (req, res, next) => {
  res.json({ message: "deneme deneme" });
});

export default app;
