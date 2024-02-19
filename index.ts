import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { AdminRoute, DeveloperRoute } from "./routes";
import { MONGO_URI } from "./config";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/Admin", AdminRoute);
app.use("/Developer", DeveloperRoute);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("error" + err);
  });
//jiheng
app.listen(8000, () => {
  console.clear();
  console.log(`App is listening to port 8000...`);
});
