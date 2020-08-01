import {
  CloudFrontRequestResult,
} from 'aws-lambda';

const toRedirect = (
  received: jest.Mock<undefined, CloudFrontRequestResult[]>,
): jest.CustomMatcherResult => {
  return {
    pass: true,
    message: () => 'Not to be redirect response',
  }
}

export default { toRedirect }
