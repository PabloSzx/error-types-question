import { Context } from "hono";
import { z } from "zod";
import { zpp } from "./helpers";

export const ErrorSchema = zpp(
  z
    .object({
      error: z.object({
        message: z.string(),
        code: z.number(),
        status: z.number(),
      }),
    })
    .openapi("Error")
);

/* _____________ Your Code Here _____________ */

// Implement the Error Definitions and create errors like shown in the readme

// Implement the errorToHTTPException function.
export const errorToHTTPException = <
  T,
  C // Ensure the passed code C is valid for the error type T
>(
  c: Context,
  error: T
): {
  error: T;
  statusCode: C;
} => {
  //   Hono's c.json expects the status code as the second argument.
  //   The 'code' variable (type C) now correctly represents the specific HTTP status passed.

  //   console.log("errorToHTTPException", error.statusCode);
  return c.json(
    ErrorSchema.new({
      error: {
        message: error.message,
        code: error.code, // This remains the internal Composio error code
        status: error.statusCode as C, // This is the specific HTTP status code passed (e.g., 400 or 500)
      },
    }),
    error.statusCode as C
  ); // Pass the specific HTTP status code C here
};
