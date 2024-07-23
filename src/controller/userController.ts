// controllers/userController.ts
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/couchbase";
import { GetResult } from "couchbase";

let collection: any;

(async () => {
  const { collection_default } = await db();
  collection = collection_default;
})();

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const id = uuidv4();
    const savedUser = await collection.upsert(id, user);
    res.status(201).json({
      message: "User created successfully",
      data: {
        id,
        savedUser,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "işlem başarısız" });
  }
};

// Get a user by ID
export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const getResult: GetResult = await collection.get(id);
    res.status(200).json(getResult.content);
  } catch (error) {
    res.status(500).json({ error: "işlem başarısız" });
  }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = req.body;
    const updatedUser = await collection.upsert(id, user);
    res.status(200).json({
      message: "User updated successfully",
      data: {
        id,
        updatedUser,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "işlem başarısız" });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await collection.remove(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "işlem başarısız" });
  }
};
