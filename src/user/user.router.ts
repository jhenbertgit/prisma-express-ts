import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import * as UserService from "./user.service";

export const userRouter = express.Router();

//GET: get all users
userRouter.get("/", async (request: Request, response: Response) => {
  try {
    const users = await UserService.getAllUsers();
    return response.status(200).json(users);
  } catch (error) {
    return response.status(500).json({ message: (error as Error).message });
  }
});

//GET: get user by id 
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
  "/register",
  body("firstName").isString(),
  body("lastName").isString(),
  body("email").isString(),
  body("password").isString(),
  async (request: Request, response: Response) => {
    //validate the types of request body
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const hashedPassword = await bcrypt.hash(request.body.password, 10);
      const newUser = { ...request.body, password: hashedPassword };

      const createdUser = await UserService.createUser(newUser);
      return response.status(201).json(createdUser);
    } catch (error) {
      return response.status(500).json({ message: (error as Error).message });
    }
  }
);

/**POST: login a user
 * @requires
 * email: string
 * password: string
 * @returns
 * user object if login is successful
 */
userRouter.post(
  "/login",
  body("email").isString(),
  body("password").isString(),
  async (request: Request, response: Response) => {
    //validate the types of request body
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      //destructure from request body
      const { email, password } = request.body;

      //object with message and user properties.
      const loginResult = await loginUser(email, password);

      //If the login is successful, the message is "Login Successfull" and the user object is returned
      return response.status(200).json(loginResult);
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
    //validate the types of request body
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

/**
 * @params
 * email: string
 * password: string
 * @returns
 * message "Login Successfull"
 * user object if login is successful
 */
const loginUser = async (email: string, password: string) => {
  try {
    //Get user credentials in database
    const user = await UserService.getUserByEmail(email);

    if (!user) {
      //User with given email not found
      throw new Error("User not found");
    }
    //Compare the provided password with hashed password from database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //Provided password is mismatch
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return { message: "Login Successfull", user };
  } catch (error) {
    console.error((error as Error).message);
  }
};
