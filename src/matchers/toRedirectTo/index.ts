import {
  CloudFrontRequestResult,
  CloudFrontHeaders
} from 'aws-lambda';
import {
  matcherHint,
  printReceived,
} from 'jest-matcher-utils'

const getLocationValue = (headers: CloudFrontHeaders) => {
  const locationObject = Object.values(headers).filter((header) => header[0].key === 'Location')
  return locationObject[0][0].value;
}

const createFailResult = (message: string, received: jest.Mock<undefined, CloudFrontRequestResult[]>) => ({
  pass: false,
  message: () => matcherHint('.toRedirectTo', undefined, undefined) +
    '\n\n' +
    message + ' received: ' +
    printReceived(received)
});

const createPassResult = (message: string, received: jest.Mock<undefined, CloudFrontRequestResult[]>) => ({
  pass: true,
  message: () => matcherHint('.not.toRedirectTo', undefined, undefined) +
    '\n\n' +
    message + ' received: ' +
    printReceived(received)
});

const toRedirectTo = (
  received: jest.Mock<undefined, CloudFrontRequestResult[]>,
  targetLink: string,
): jest.CustomMatcherResult => {

  if (!targetLink) {
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
  if (!['301', '302', '307', '308'].includes(status)) {
    return createFailResult('Expected value doesn\'t have a http status code which means redirection', received);
  }
  const { headers } = requestResult;
  if (!headers) {
    return createFailResult('Expected value doesn\'t have any http headers', received);
  }

  if (getLocationValue(headers) !== targetLink) {
    return createFailResult('Expected value doesn\'t match the specified target link', received);
  }

  return createPassResult('Expected value not be a redirect response', received);
}

export default { toRedirectTo }
