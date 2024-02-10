import { Request, Response, NextFunction } from "express";
import { CreateDeveloperInput } from "../dto";
import { Developer } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";
import { AddPoints } from "../dto/Task.dto";
import { Task } from "../models";

// find the developer by its id or email
export const FindDeveloper = async (id: string | undefined, email?: string) => {
  if (email) return await Developer.findOne({ email: email });
  return await Developer.findById(id);
};

/**
 * Register machine for the developer:
 * 1. check whether the developer is existing
 * 2. hash the password using the salt
 * 3. create the developer with the properties
 * 4. return the developer informations
 *
 * @param req the properties of the developer
 * @param res the created user information
 * @returns the developer and errors
 */
export const CreateDeveloper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone, team, email, position, password } = <
    CreateDeveloperInput
  >req.body;

  const existingDeveloper = await FindDeveloper("", email);

  if (existingDeveloper !== null) {
    return res.json({ message: "A developer is existing with this email ID" });
  }

  // Generate a salt and encrypt the password
  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createdDeveloper = await Developer.create({
    name: name,
    position: position,
    team: team,
    phone: phone,
    email: email,
    password: userPassword,
    salt: salt,
    rating: 0,
    tasks: [],
  });

  return res.json(createdDeveloper);
};

/**
 * Get all developers' information
 *
 * @returns the developers' properties
 */
export const GetDevelopers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const developers = await Developer.find();

  if (developers !== null) {
    return res.json(developers);
  }

  return res.json({ message: "developers data not avaliable" });
};

/**
 * Get the specific developer by checking his/her name
 *
 * @param req the developer's name
 * @param res the developer's properties
 * @returns the developer's information and errors
 */
export const GetDeveloperByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const name = req.params.name;

  const developer = await Developer.findOne({ name: name });

  if (developer !== null) {
    return res.json(developer);
  }

  return res.json({ message: "developers data not avaliable" });
};

/**
 * Get all tasks of all developers
 * if there is no tasks, throw a message

 * @param res the tasks' properties
 * @returns the tasks and error
 */
export const GetAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tasks = await Task.find();

  if (tasks !== null) {
    return res.json(tasks);
  }

  return res.json({ message: "task data not avaliable" });
};

/**
 * Give points to a specific task finished by a specific developer.
 * the function is created for the administers of vandyhacks, allowing them to grade each developer's task
 *
 * @param req the developer's name, the task's name and the points
 * @param res the task after change
 * @returns the task and errors
 */
export const GivePoints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { devName, taskName, points } = <AddPoints>req.body;

  const taskToUpdate = await Task.findOneAndUpdate(
    { devName: devName, taskName: taskName },
    { $set: { points: points } },
    { new: true }
  );

  if (taskToUpdate) {
    return res.json({
      message: `The task is already updated, points = ${points}`,
      taskToUpdate,
    });
  }

  return res.json({ message: "task data not avaliable" });
};
