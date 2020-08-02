import matchers from './matchers';

if ('expect' in global) {
  global.expect.extend(matchers);
}

