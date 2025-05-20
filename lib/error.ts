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

const ErrorCodes = {
  BadRequest: {
    code: 400,
    message: "Bad request",
    status: 400,
  },
  InternalServerError: {
    code: 500,
    message: "Internal server error",
    status: 500,
  },
  // NotImplemented: {
  //   code: 501,
  //   message: "Not implemented",
  // },
} as const satisfies Record<
  string,
  {
    code: number;
    status: number;
    message: string;
  }
>;

type ErrorCodesNames = keyof typeof ErrorCodes;

type ErrorCodesTypes = {
  [K in ErrorCodesNames]: `${K}_${(typeof ErrorCodes)[K]["code"]}`;
};

type ErrorCodesTypeValues = ErrorCodesTypes[keyof ErrorCodesTypes];

type ErrorCodeStatus<T extends ErrorCodesTypeValues> =
  T extends `${infer _}_${infer C}` ? C : never;

// Implement the errorToHTTPException function.
export const errorToHTTPException = <
  T extends ErrorCodesTypeValues,
  C extends ErrorCodeStatus<T>
>(
  c: Context,
  error: T
): {
  error: T;
  statusCode: C;
} => {
  const errorCodeNameString = error.split("_")[0];

  if (errorCodeNameString in ErrorCodes) {
    const errorCodeName = errorCodeNameString as ErrorCodesNames;

    const errorCode = ErrorCodes[errorCodeName];

    return c.json(
      {
        error: {
          message: errorCode.message,
          code: errorCode.code,
          status: errorCode.status,
        },
      },
      errorCode.status
    );
  } else {
    return c.json(
      {
        error: {
          message: "Internal Server Error",
          code: ErrorCodes.InternalServerError.code,
          status: ErrorCodes.InternalServerError.status,
        },
      },
      ErrorCodes.InternalServerError.code
    );
  }
};
