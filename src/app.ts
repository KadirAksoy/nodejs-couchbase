import express from "express";
import { json, urlencoded } from "body-parser";
import { db } from "./config/couchbase";
import router from "./routers";
import { globalErrorMiddleware } from "./middleware/errorMiddleware";

const app = express();

// initialize global middlewares
app.use(urlencoded({ extended: false }));
app.use(json());

db();

app.use("/api", router);

app.get("/", (req, res, next) => {
  res.json({ message: "deneme deneme" });
});

app.use(globalErrorMiddleware);

export default app;
