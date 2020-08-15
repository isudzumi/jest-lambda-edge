import {
  CloudFrontRequestResult,
  CloudFrontHeaders
} from 'aws-lambda';
import {
  matcherHint,
  printReceived,
} from 'jest-matcher-utils'

const hasLocationKey = (headers: CloudFrontHeaders) => {
  // To find the header to be case-insensitive, compare with 'toLowerCase()'
  const headerKeys = Object.keys(headers).map((key) => key.toLowerCase());
  return headerKeys.includes('location');
}

const createFailResult = (message: string, received: jest.Mock<undefined, CloudFrontRequestResult[]>) => ({
  pass: false,
  message: () => matcherHint('.toRedirect', undefined, undefined) +
    '\n\n' +
    message + ' received: ' +
    printReceived(received)
});

const createPassResult = (message: string, received: jest.Mock<undefined, CloudFrontRequestResult[]>) => ({
  pass: true,
  message: () => matcherHint('.not.toRedirect', undefined, undefined) +
    '\n\n' +
    message + ' received: ' +
    printReceived(received)
});

const toRedirect = (
  received: jest.Mock<undefined, CloudFrontRequestResult[]>,
): jest.CustomMatcherResult => {

  const requestResult = received.mock.calls[0][1]
  if (!requestResult) {
    return createFailResult('Expected value isn\'t a CloudFront request result', received);
  }

  if (!('status' in requestResult)) {
    return createFailResult('Expected value isn\'t a CloudFront result response ', received);
  }

  const { status } = requestResult;
  if (!['301', '302', '307', '308'].includes(status)) {
    return createFailResult('Expected value doesn\'t have a http status code which means redirection', received);
  }
  const { headers } = requestResult;
  if (!headers) {
    return createFailResult('Expected value doesn\'t have any http headers', received);
  }

  if (!hasLocationKey(headers)) {
    return createFailResult('Expected value doesn\'t have a Location header', received);
  }

  return createPassResult('Expected value not be a redirect response', received);
}

export default { toRedirect }
