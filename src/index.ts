import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

interface QueryObject {
  [key: string]: string;
}

interface UrlObject {
  domain: string;
  path: string;
  query_object: QueryObject;
  hash: string;
}

interface EventObject {
  timestamp: number;
  url_object: UrlObject;
  ec: any;
}

export function parseUrl(url: string): UrlObject {
  const parsed = new URL(url);
  const query: QueryObject = {};

  parsed.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  return {
    domain: parsed.hostname,
    path: parsed.pathname,
    query_object: query,
    hash: parsed.hash,
  };
}

export function transformEvent(event: any, timestamp: number, url_object: UrlObject): EventObject {
  return {
    timestamp: timestamp,
    url_object: url_object,
    ec: event,
  };
}

export function transformFile(file: string): EventObject {
  const data = fs.readFileSync(file);
  const json = zlib.gunzipSync(data).toString();
  const json_data = JSON.parse(json);
  const events = json_data.e
  const parsed_url = parseUrl(json_data.u)

  return events.map((event: any) => {
    const ts = json_data.ts;
    const url = parsed_url;
    const ec = event;

    return transformEvent(ec, ts, url);
  });
}

export function storeOutputs(outputs: EventObject[], directory: string, maxSize: number): void {
  let currentSize = 0;
  let currentBatch: EventObject[] = [];

  const writeBatch = () => {
    const outputFilename = `output-${new Date().toISOString()}.json`;
    const outputPath = path.join(directory, outputFilename);

    const json = JSON.stringify(currentBatch);
    fs.writeFileSync(outputPath, json, 'utf8');

    currentBatch = [];
    currentSize = 0;
  };

  outputs.forEach((output: EventObject) => {
    const json = JSON.stringify(output);
    const size = Buffer.byteLength(json, 'utf8');

    if (currentSize + size > maxSize) {
      writeBatch();
    }

    currentBatch.push(output);
    currentSize += size;
  });

  if (currentBatch.length > 0) {
    writeBatch();
  }
}

function main(): void {
  const inputDir = 'input';
  const outputDir = 'output';

  const files = fs.readdirSync(inputDir);

  const outputs = files.flatMap((file) => {
    const filePath = path.join(inputDir, file);

    if (path.extname(file) !== '.gz') {
      console.log(`Skipping non-gzipped file: ${file}`);
      return [];
    }

    console.log(`Processing file: ${file}`);

    try {
      return transformFile(filePath);
    } catch (e) {
      console.log(`Error processing file: ${file}`);
      console.error(e);
      return [];
    }
  });

  storeOutputs(outputs, outputDir, 8000);
}

main();
