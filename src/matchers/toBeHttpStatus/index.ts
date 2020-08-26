import {
  CloudFrontRequestResult,
  CloudFrontHeaders
} from 'aws-lambda';
import {
  matcherHint,
  printReceived,
} from 'jest-matcher-utils'

const createFailResult = (message: string, received: jest.Mock<undefined, CloudFrontRequestResult[]>) => ({
  pass: false,
  message: () => matcherHint('.toBeHttpStatus', undefined, undefined) +
    '\n\n' +
    message + ' received: ' +
    printReceived(received)
});

const createPassResult = (message: string, received: jest.Mock<undefined, CloudFrontRequestResult[]>) => ({
  pass: true,
  message: () => matcherHint('.not.toBeHttpStatus', undefined, undefined) +
    '\n\n' +
    message + ' received: ' +
    printReceived(received)
});

const toBeHttpStatus = (
  received: jest.Mock<undefined, CloudFrontRequestResult[]>,
  httpStatus: number,
): jest.CustomMatcherResult => {

  if (!httpStatus) {
    return createFailResult('The argument is not specified', received);
  }

  const requestResult = received.mock.calls[0][1]
  if (!requestResult) {
    return createFailResult('Expected value isn\'t a CloudFront request result', received);
  }

  if (!('status' in requestResult)) {
    return createFailResult('Expected value isn\'t a CloudFront result response ', received);
  }

  const { status } = requestResult;
  if (parseInt(status) !== httpStatus) {
    return createFailResult('Expected value doesn\'t match your specified http status', received);
  }

  return createPassResult('Expected value not be a redirect response', received);
}

export default { toBeHttpStatus }
