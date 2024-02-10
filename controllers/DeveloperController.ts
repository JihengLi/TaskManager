import { Request, Response, NextFunction } from "express";
import { EditDeveloperInput, DeveloperLoginInput } from "../dto";
import { FindDeveloper } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { CreateTaskInput } from "../dto/Task.dto";
import { Task } from "../models";

/**
 * Login machine for developers
 * 1. find the developer by using the email
 * 2. use the salt to validate the password
 * 3. generate a specific signature for the user to do the further works
 * 4. throw message when the user is not found or the password is not true
 *
 * @param req the email and password of the developer
 * @returns the signature for this developer
 */
export const DeveloperLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <DeveloperLoginInput>req.body;

  const existingDeveloper = await FindDeveloper("", email);

  if (existingDeveloper !== null) {
    const validation = await ValidatePassword(
      password,
      existingDeveloper.password,
      existingDeveloper.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: existingDeveloper.id,
        email: existingDeveloper.email,
        name: existingDeveloper.name,
        position: existingDeveloper.position,
      });

      return res.json(signature);
    }
    return res.json({ message: "Password is not valid" });
  }

  return res.json({ message: "Login credential not valid" });
};

/**
 * Get the developer's own profile, which contains some of the properties
 *
 * @param req the signature to verify the developer
 * @param res the profile of that user
 * @returns message if developer not found
 */
export const GetDeveloperProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingDeveloper = await FindDeveloper(user._id);

    return res.json(existingDeveloper);
  }

  return res.json({ message: "Developer Information not found" });
};

/**
 * Update the profile (only contains several properties) of developer
 *
 * @param req the position, team and phone of that developer
 * @param res the profile after change
 * @returns message if the user not found or not varified
 */
export const UpdateDeveloperProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { position, team, phone } = <EditDeveloperInput>req.body;
  const user = req.user;

  if (user) {
    const existingDeveloper = await FindDeveloper(user._id);

    if (existingDeveloper !== null) {
      existingDeveloper.position = position;
      existingDeveloper.phone = phone;
      existingDeveloper.team = team;

      const savedResult = await existingDeveloper.save();
      return res.json(savedResult);
    }

    return res.json(existingDeveloper);
  }

  return res.json({ message: "Developer Information not found" });
};

/**
 * Give the developer a way to add the task
 *
 * @param req the signature and the basic properties of a task (without points)
 * @param res the created task (in the task property of the user)
 * @returns message if error
 */
export const AddTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { taskName, description, team, category, finishedTime } = <
      CreateTaskInput
    >req.body;
    const developer = await FindDeveloper(user._id);

    if (developer !== null) {
      const createdTask = await Task.create({
        developerId: developer._id,
        devName: developer.name,
        taskName: taskName,
        description: description,
        team: team,
        category: category,
        finishedTime: finishedTime,
      });

      developer.tasks.push(createdTask);
      const result = await developer.save();
      return res.json(result);
    }
  }

  return res.json({ message: "Something went wrong with AddTask" });
};

/**
 * Give the developer a method to view all their tasks
 *
 * @param req the signature of the user
 * @param res all the tasks of that user
 * @returns message if error
 */
export const GetTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const tasks = await Task.find({ developerId: user._id });
    if (tasks !== null) return res.json(tasks);
  }

  return res.json({ message: "Tasks Information not found" });
};
