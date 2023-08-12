import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program
    .version('2.0.1')
    .option('-p --port <port>', 'Execution port', 3000)
    .option('-m --mode <mode>', 'Execution mode (PRODUCTION / DEVELOPMENT)', 'DEVELOPMENT')
    .option('-d --debug', 'Activate / deactivate debug', false)
    .parse(process.argv);
const cl_options = program.opts();

dotenv.config({ path: cl_options.mode == 'DEVEL' ? './.env.development': './.env.production' });
console.log(process.env.SERVER_PORT)

const config = {
    SERVER_PORT: process.env.SERVER_PORT,
    MONGOOSE_URL: process.env.MONGOOSE_URL || 'mongodb://127.0.0.1/BackendFedericoLopez',
    PERSISTENCE: process.env.PERSISTENCE
}

export default config;