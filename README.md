# composio typescript error challenge

## Install bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### Install packages

```bash
bun install
```

the above should help setup env for getting types properly

## Assignment

Your goal is to implement the `errorToHTTPException` function on a type level such that it can take in a generic of types like `Error400 | Error500` or whatever and return status code properly as `400 | 500`

here is a quick example from our codebase, of a type signature
```ts
(alias) errorToHTTPException<Error_400 | Error_500, 400 | 500>(c: Context, error: Error_400 | Error_500): JSONRespondReturn<{
    error: {
        code: number;
        message: string;
        status: number;
    };
}, 400 | 500>
```

why is this important, if you see in `[...route].ts` file the openapi type returned for status code is validated by this returned type but i want to be able to use like this but still have the error codes i am throwing properly validated
```ts
if (userWithProject.err) {
    // (property) ErrImpl<Error_400 | Error_500>.val: Error_400 | Error_500
    return errorToHTTPException(c, userWithProject.val)
  }
```

How are we defining errors? in our codebase something like this, but you can do it whatever way you want
```ts
// snippet
export const ErrorCodes = {
  Prisma: {
    BadRequest: 100,
    InternalServerError: 101,
    UnknownError: 102,
    ResourceNotFound: 103,
    AlreadyExists: 104,
  },
}


export const PrismaError = {
  BadRequest: createErrorClass(
    Error_400,
    ErrorCodes.Prisma.BadRequest,
    'PRISMA',
  ),
  InternalServerError: createErrorClass(
    Error_500,
    ErrorCodes.Prisma.InternalServerError,
    'PRISMA',
  ),
  UnknownError: createErrorClass(
    Error_500,
    ErrorCodes.Prisma.UnknownError,
    'PRISMA',
  ),
  ResourceNotFound: createErrorClass(
    Error_400,
    ErrorCodes.Prisma.ResourceNotFound,
    'PRISMA',
  ),
  AlreadyExists: createErrorClass(
    Error_400,
    ErrorCodes.Prisma.AlreadyExists,
    'PRISMA',
  ),
}
```

## Where should your code go?

mainly in `error.ts`, you will likely not need any other dependencies if you want to have installed
you can use `[...route].ts` to validate the code (doesn't need to compile just type-check)
feel free to look at `helpers.ts` but mostly just ignore

you can choose any way you want to solve this problem -> you are sorta expected to write `Generics<T, C>` and live in the typescript type system, if you find a way around sure but don't be shocked if you find yourself writing in the type system

- `ts-custom-error` -> can help scaffold the custom error class
- `@type-challenges/utils` -> can help if you want to test type quickly 