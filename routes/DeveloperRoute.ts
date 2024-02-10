import express, { Request, Response, NextFunction } from "express";
import {
  AddTask,
  GetTasks,
  GetDeveloperProfile,
  UpdateDeveloperProfile,
  DeveloperLogin,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/login", DeveloperLogin);

// Authenticate the user first
router.use(Authenticate);
router.get("/profile", GetDeveloperProfile);
router.patch("/profile", UpdateDeveloperProfile);

router.post("/task", AddTask);
router.get("/task", GetTasks);

export { router as DeveloperRoute };
