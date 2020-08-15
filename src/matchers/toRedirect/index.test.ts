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

describe('.toRedirect', () => {
  test('passes when given an CloudFront request', () => {
    const redirectResponse: CloudFrontRequestResult = {
      status: '301',
      headers: {
        location: [{
          key: 'Location',
          value: 'foo.com'
        }]
      }
    }
    lambdaEdgeHandler(redirectResponse, mockCallback);
    expect(mockCallback).toRedirect();
  });

  it('shouldn\'t pass as redirection when given an request directly', () => {
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
    expect(mockCallback).not.toRedirect();
  })
});
