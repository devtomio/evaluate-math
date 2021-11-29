import { writeFile } from 'node:fs/promises';
import { blue, red, green } from 'colorette';
import { createRequire } from 'node:module';
import { platform as getPlatform, arch as getArch } from 'node:os';
import { platformArchTriples } from '@napi-rs/triples';
import petitio from 'petitio';
import { exit } from 'node:process';

const r = createRequire(import.meta.url);
const { version, name } = r('../package.json');
const platform = getPlatform();
const arch = getArch();
const { platformArchABI } = platformArchTriples[platform][arch][0];
const URL = `https://github.com/1chiSensei/evaluate-math/releases/download/${version}/${name}.${platformArchABI}.node`;

console.log(blue('Downloading native binding...'));

const { body, statusCode } = await petitio(URL, 'GET').send();

if (statusCode >= 400) {
	console.log(red(`An error occured while downloading. Please try again. Status Code: ${statusCode}`));
	exit(1);
}

await writeFile('evaluate-math.node', body);
console.log(green('Download complete!'));
