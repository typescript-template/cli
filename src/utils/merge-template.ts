import { CommandRunner } from 'ts-script';
import { baseUrl, Template, templates } from '../templates';

/**
 * Merge template from remote
 *
 * @param runner Command runner
 * @param type Template type
 * @param isExistingProject (Optional) Pass true for existing projects
 */
export function mergeTemplate(
	runner: CommandRunner,
	type: Template,
	isExistingProject?: boolean
): void {
	const remote = 'template-' + type;
	const url = templates[type] ?? baseUrl + type;

	try {
		runner.run(`git remote add ${remote} ${url}`, {
			loadingDescription: 'Adding template',
		});
	}
	catch (e) {
		runner.log.warn('Adding remote failed, may already exist');
	}

	runner.run(`git fetch ${remote} master`, {
		loadingDescription: 'Fetching',
	});

	if (isExistingProject) {
		runner.run(`git merge ${remote}/master --allow-unrelated`, {
			loadingDescription: 'Merging',
		});
	}
	else {
		runner.run(`git pull ${remote} master --allow-unrelated`, {
			loadingDescription: 'Pulling',
		});
	}

	runner.run(`git remote remove ${remote}`, {
		loadingDescription: 'Cleaning up',
	});
}
