import * as fs from 'fs';
import * as path from 'path';
import { parseUrl, transformEvent, transformFile, storeOutputs } from '../src/index';

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

// describe('transformFile', () => {
//   it('transforms a file correctly', () => {
//     const file = 't1669976028340.json.gz'
//     const expected = [
//       {
//         timestamp: 1234567890,
//         url_object: {
//           domain: 'www.example.com',
//           path: '/path',
//           query_object: {
//             foo: 'bar',
//             baz: 'qux',
//           },
//           hash: '#fragment',
//         },
//         ec: { type: 'click', target: 'button' },
//       },
//       {
//         timestamp: 1234567890,
//         url_object: {
//           domain: 'www.example.com',
//           path: '/path',
//           query_object: {
//             foo: 'bar',
//             baz: 'qux',
//           },
//           hash: '#fragment',
//         },
//         ec: { type: 'hover', target: 'link' },
//       },
//     ];
//     expect(transformFile(file)).toEqual(expected);
//   });
// });

describe('storeOutputs', () => {
  it('stores outputs correctly', () => {
    const outputs = [
      {
        timestamp: 1234567890,
        url_object: {
          domain: 'www.example.com',
          path: '/path',
          query_object: {
            foo: 'bar',
            baz: 'qux',
          },
          hash: '#fragment',
        },
        ec: { type: 'click', target: 'button' },
      },
      {
        timestamp: 1234567890,
        url_object: {
          domain: 'www.example.com',
          path: '/path',
          query_object: {
            foo: 'bar',
            baz: 'qux',
          },
          hash: '#fragment',
        },
        ec: { type: 'hover', target: 'link' },
      },
    ];
    const directory = 'output';
    const maxSize = 8000;
    storeOutputs(outputs, directory, maxSize);
    const fileContents = fs.readFileSync(path.join(directory, 'test.json'), 'utf8');
    expect(fileContents.trim()).toEqual(JSON.stringify(outputs));
  });
});
