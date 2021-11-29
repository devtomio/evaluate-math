import { createRequire } from 'node:module';
import { platform as getPlatform, arch as getArch } from 'node:os';
import { platformArchTriples } from '@napi-rs/triples';
import { createWriteStream } from 'node:fs';
import { promisify } from 'node:util';
import { pipeline as pipelineSync } from 'node:stream';
import fetch from 'node-fetch';

const pipeline = promisify(pipelineSync);
const r = createRequire(import.meta.url);
const { version, name } = r('../package.json');
const platform = getPlatform();
const arch = getArch();
const { platformArchABI } = platformArchTriples[platform][arch][0];
const URL = `https://github.com/1chiSensei/evaluate-math/releases/download/${version}/${name}.${platformArchABI}.node`;
const { body, ok, status, statusText } = await fetch(URL);

if (!ok) throw new Error(`An error occured: ${status} ${statusText}`);

await pipeline(body, createWriteStream('./evaluate-math.node'));
