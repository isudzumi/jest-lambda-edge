/// <reference types="jest" />
declare namespace jest {
    interface Matchers<R> {
        toRedirect(): R;
        toRedirectTo(targetLink: string): R;
        toBeHttpStatus(httpStatus: number): R;
        toBeRequest(): R;
        toBeResponse(): R;
    }
}

declare module NodeJS {
  interface Global {
    expect: jest.Expect;
  }
}
