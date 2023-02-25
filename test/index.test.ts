import { parseUrl, transformEvent } from '../src/index';

describe('parseUrl', () => {
  it('parses a URL correctly', () => {
    const url = 'https://www.example.com/path?foo=bar&baz=qux#fragment';
    const expected = {
      domain: 'www.example.com',
      path: '/path',
      query_object: {
        foo: 'bar',
        baz: 'qux',
      },
      hash: '#fragment',
    };
    expect(parseUrl(url)).toEqual(expected);
  });
});

describe('transformEvent', () => {
  it('transforms an event correctly', () => {
    const event = { type: 'click', target: 'button' };
    const ts = 1234567890;
    const u = 'https://www.example.com/path?foo=bar&baz=qux#fragment';
    const expected = {
      timestamp: ts,
      url_object: {
        domain: 'www.example.com',
        path: '/path',
        query_object: {
          foo: 'bar',
          baz: 'qux',
        },
        hash: '#fragment',
      },
      ec: event,
    };
    expect(transformEvent(event, ts, parseUrl(u))).toEqual(expected);
  });
});
