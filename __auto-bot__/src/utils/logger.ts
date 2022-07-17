const path = require('path');
import log4js from 'log4js';

const dir = process.cwd();

log4js.configure({
    appenders: {
        console: {type: 'console'},
        app: {type: 'file', filename: path.join(dir, "./logs/app.log")}
    },
    categories: {
        default: {
            appenders: ['console', 'app'], level: 'trace',//all log
        },
    }
});


export default log4js;

export const logger = log4js.getLogger("app");


