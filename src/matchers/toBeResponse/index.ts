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
  message: () => matcherHint('.toBeResponse', undefined, undefined) +
    '\n\n' +
    message + ' received: ' +
    printReceived(received)
});

const createPassResult = (message: string, received: jest.Mock<undefined, CloudFrontRequestResult[]>) => ({
  pass: true,
  message: () => matcherHint('.not.toBeResponse', undefined, undefined) +
    '\n\n' +
    message + ' received: ' +
    printReceived(received)
});

const toBeResponse = (
  received: jest.Mock<undefined, CloudFrontRequestResult[]>,
): jest.CustomMatcherResult => {

  const requestResult = received.mock.calls[0][1]
  if (!requestResult) {
    return createFailResult('Expected value isn\'t a CloudFront request result', received);
  }

  if (!('status' in requestResult)) {
    return createFailResult('Expected value isn\'t a CloudFront response ', received);
  }

  return createPassResult('Expected value not be a CloudFront response', received);
}

export default { toBeResponse }
