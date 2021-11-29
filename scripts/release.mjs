import { execSync } from 'node:child_process';
import { Octokit } from '@octokit/rest';
import publish from '@jsdevtools/npm-publish';
import { createRequire } from 'node:module';
import { readdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';

const r = createRequire(import.meta.url);
const { version } = r('../package.json');
const re = /(?:(?<=^v?|\sv?)(?:(?:0|[1-9]\d{0,9})\.){2}(?:0|[1-9]\d{0,9})(?:-(?:0|[1-9]\d*?|[\da-z-]*?[a-z-][\da-z-]*?){0,100}(?:\.(?:0|[1-9]\d*?|[\da-z-]*?[a-z-][\da-z-]*?))*?){0,100}(?:\+[\da-z-]+?(?:\.[\da-z-]+?)*?){0,100}\b){1,200}/gi;
const log = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
const gh = new Octokit({ auth: process.env.GITHUB_TOKEN });

if (re.test(log)) {
	const release = await gh.repos.createRelease({
		owner: '1chiSensei',
		repo: 'evaluate-math',
		tag_name: version
	});
	await publish({
		token: process.env.NPM_TOKEN
	});

	const files = (await readdir('.')).filter((v) => v.endsWith('.node'));

	for (const file of files) {
		const { size } = await stat(`./${file}`);
		await gh.repos.uploadReleaseAsset({
			owner: '1chiSensei',
			repo: 'evaluate-math',
			name: file,
			release_id: release.data.id,
			mediaType: {
				format: 'raw'
			},
			headers: {
				'Content-Length': size,
				'Content-Type': 'application/octet-stream'
			},
			data: createReadStream(`./${file}`)
		});
	}
}
