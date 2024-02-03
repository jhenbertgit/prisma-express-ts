import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as UserService from "./user.service";

export const userRouter = express.Router();

//GET: list of all users
userRouter.get("/", async (request: Request, response: Response) => {
  try {
    const users = await UserService.getAllUsers();
    return response.status(200).json(users);
  } catch (error) {
    return response.status(500).json({ message: (error as Error).message });
  }
});

//GET: user by id
userRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const user = await UserService.getUserById(id);
    if (user) {
      return response.status(200).json(user);
    }
    return response.status(404).json({ message: "User not found" });
  } catch (error) {
    return response.status(500).json({ message: (error as Error).message });
  }
});

//POST: create a new user
userRouter.post(
  "/",
  body("firstName").isString(),
  body("lastName").isString(),
  body("email").isString(),
  body("password").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const newUser = await UserService.createUser(request.body);
      return response.status(201).json(newUser);
    } catch (error) {
      return response.status(500).json({ message: (error as Error).message });
    }
  }
);

//PUT: update a user
userRouter.put(
  "/:id",
  body("firstName").isString(),
  body("lastName").isString(),
  body("email").isString(),
  body("password").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
      const updatedUser = await UserService.updateUser(request.body, id);
      return response.status(200).json(updatedUser);
    } catch (error) {
      return response.status(500).json({ message: (error as Error).message });
    }
  }
);

//DELETE: delete a user
userRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    await UserService.deleteUser(id);
    return response
      .status(200)
      .json({ message: `User with ID: ${id} is sucessfully deleted` });
  } catch (error) {
    return response.status(500).json({ message: (error as Error).message });
  }
});
