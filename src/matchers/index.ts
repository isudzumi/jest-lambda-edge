import { default as toRedirect } from './toRedirect';

const customMatcherMap: jest.ExpectExtendMap = [
    toRedirect
].reduce((map, module) => {
    const [ name, customMatcher] = Object.entries(module)[0];
    return Object.assign(map, {
        [name]: customMatcher
    })
}, {})

export default customMatcherMap;