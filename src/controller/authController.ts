// controllers/authController.ts
import e, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/couchbase";
import { GetResult, QueryResult } from "couchbase";
import APIError from "../errors/APIError";

const secretKey = "plainexKey";
let collection: any;
let bucket: any;
(async () => {
  const { cluster, bucket: b, collection_default } = await db();
  bucket = b;
  collection = collection_default;
})();

// User signup
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    if (!newUser.email || !newUser.name || !newUser.password) {
      throw new APIError(
        400,
        "MISSING_REQUIRED_FIELDS",
        "Some argument is missing"
      );
    }

    const createdUser = await collection.upsert(id, newUser);

    res.status(201).json({
      message: "User registered successfully",
      data: {
        id,
        newUser,
        createdUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// User signin
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const query = `SELECT * FROM \`myBucket\`._default._default WHERE email = $1`;
    const params = email;

    // Query Bucket instead of Collection
    const result: QueryResult = await bucket
      .scope("_default")
      .query(query, { parameters: [params] });

    if (result.rows.length === 0) {
      throw new APIError(
        400,
        "MISSING_REQUIRED_FIELDS",
        "Some argument is missing"
      );
    }
    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user._default.password);
    if (!isMatch) {
      return next(
        new APIError(404, "PASSWORD_INCORRECT", "Password is not true")
      );
    }

    const token = jwt.sign({ id: user.email }, secretKey, { expiresIn: "1h" });
    res.status(200).json({
      message: "Signin successful",
      data: {
        isMatch,
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
