import { db } from "../utils/db.server";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export const getAllUsers = async (): Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      createdAt: true,
    },
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return db.user.findUnique({
    where: { id },
  });
};

export const createUser = async (
  user: Omit<User, "id" | "createdAt">
): Promise<User> => {
  const { firstName, lastName, email, password } = user;
  return db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      createdAt: true,
    },
  });
};

export const updateUser = async (
  user: Omit<User, "id" | "createdAt">,
  id: number
): Promise<User> => {
  const { firstName, lastName, email, password } = user;
  return db.user.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
      password,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    },
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.user.delete({
    where: { id },
  });
  return; // return void
};
