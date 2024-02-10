import express, { Request, Response, NextFunction } from "express";
import {
  GivePoints,
  CreateDeveloper,
  GetAllTasks,
  GetDeveloperByName,
  GetDevelopers,
} from "../controllers";

const router = express.Router();

router.post("/Developer", CreateDeveloper);

router.get("/Developer", GetDevelopers);

router.get("/Developer/:name", GetDeveloperByName);

router.get("/Task", GetAllTasks);

router.patch("/Task", GivePoints);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Admin" });
});

export { router as AdminRoute };
