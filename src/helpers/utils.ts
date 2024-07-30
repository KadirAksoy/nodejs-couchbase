import { Request } from "express";
import BaseError from "../errors/BaseError";
import APIError from "../errors/APIError";
import { DocumentNotFoundError } from "couchbase";

export const isTrustedError = (err: Error) => {
  if (err instanceof BaseError) return err.isOperational;
  return false;
};

export const errorFilter = (err: Error) => {
  // If the error is a trusted error and an instance of BaseError, return it directly
  if (isTrustedError(err) && err instanceof BaseError) return err;
  else if (err instanceof DocumentNotFoundError) {
    // @ts-ignore
    const id = err.cause.id;
    return new APIError(
      404,
      "DOCUMENT_NOT_FOUND",
      `No such document with ${id}`
    );
  }

  return new APIError(
    500,
    "INTERNAL_SERVER_ERROR",
    "Something went wrong internaly"
  );
};
