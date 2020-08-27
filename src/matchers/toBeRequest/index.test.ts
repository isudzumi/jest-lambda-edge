import matcher from './';
import {
  CloudFrontRequestResult,
  CloudFrontRequestCallback,
  CloudFrontRequestEvent,
  CloudFrontRequestHandler
} from 'aws-lambda';

const mockCallback = jest.fn();
const lambdaEdgeHandler = (result: CloudFrontRequestResult, callback: CloudFrontRequestCallback): void => {
  return callback(null, result);
};

beforeEach(() => {
  expect.extend(matcher);
})

describe('.toBeRequest', () => {
  test('passes when given an CloudFront request', () => {
    const request: CloudFrontRequestResult = {
      clientIp: '203.0.113.1',
      method: "GET",
      querystring: "",
      uri: "/",
      headers: {
        "user-agent": [{
            key: "User-Agent",
            value: "curl/7.66.0"
          }],
      }
    }
    lambdaEdgeHandler(request, mockCallback);
    expect(mockCallback).toBeRequest();
  });

  it('shouldn\'t pass as redirection when given an request directly', () => {
    const response: CloudFrontRequestResult = {
      status: '301'
    }
    lambdaEdgeHandler(response, mockCallback);
    expect(mockCallback).not.toBeRequest();
  })
});
