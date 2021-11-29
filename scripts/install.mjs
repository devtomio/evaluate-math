import { writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module';
import { platform as getPlatform, arch as getArch } from 'node:os';
import { platformArchTriples } from '@napi-rs/triples';
import { exit } from 'node:process';
import needle from 'needle';
import { createWriteStream } from 'node:fs';

const r = createRequire(import.meta.url);
const { version, name } = r('../package.json');
const platform = getPlatform();
const arch = getArch();
const { platformArchABI } = platformArchTriples[platform][arch][0];
const URL = `https://github.com/1chiSensei/evaluate-math/releases/download/${version}/${name}.${platformArchABI}.node`;

needle.get(URL).pipe(createWriteStream('evaluate-math.node'))
