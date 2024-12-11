const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        const repository = core.getInput('repository');
        console.log(`Checking out the repository: ${repository}`);

        // Clone the repository (this uses the 'git' command)
        await exec.exec(`git clone ${repository}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
