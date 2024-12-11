const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');

async function run() {
    try {
        const nodeVersion = core.getInput('node-version');
        console.log(`Setting up Node.js version: ${nodeVersion}`);

        // Install Node.js using nvm
        await exec.exec(`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`);
        await exec.exec(`source ~/.bashrc && nvm install ${nodeVersion}`);
        await exec.exec(`source ~/.bashrc && nvm use ${nodeVersion}`);

        console.log(`Node.js version ${nodeVersion} is installed.`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
