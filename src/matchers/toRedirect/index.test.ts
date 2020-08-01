import matcher from './';
import {
  CloudFrontRequestResult,
  CloudFrontRequestCallback,
  CloudFrontRequestEvent,
  CloudFrontRequestHandler
} from 'aws-lambda';
import viewerRequestEvent from '../../../fixtures/lambda-edge/viewer-request.json'

const mockCallback = jest.fn();
const setResult = (event: CloudFrontRequestResult) => (): CloudFrontRequestResult => event;
const lambdaEdgeHandler = (setResultFn: () => CloudFrontRequestResult, callback: CloudFrontRequestCallback): void => {
  return callback(null, setResultFn());
};

const redirectResponse: CloudFrontRequestResult = {
  status: '301',
  headers: {
    location: [{
      key: 'Location',
      value: 'foo.com'
    }]
  }
}

beforeEach(() => {
  expect.extend(matcher);
})

describe('.toRedirect', () => {
  test('passes when given an CloudFront request', () => {
    lambdaEdgeHandler(setResult(redirectResponse), mockCallback);
    expect(mockCallback).toRedirect();
  });
});
