'use strict';

const request = require('async-request');
const jsdom = require('jsdom');
const fs = require('fs');
const PATH = require('path');
const { SessionContext } = require('./core');
const { parsers } = require('./parser');
const { getGenerator } = require('./generators.js');

async function requestData(url) {
    // TODO: das
    let response = await request(url);
    const body = response.body;
    return body;
}

function createRoot() {
    const root = '.';
    let index = 1;
    while (true) {
        const path = PATH.join(root, 'novel-' + index);
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
            return path;
        }
        index += 1;
    }
}

async function main() {
    let argv = process.argv;
    argv = argv.concat(['https://www.lightnovel.cn/forum.php?mod=viewthread&tid=901113&highlight=%E7%A5%9E%E8%AF%9D%E4%BC%A0%E8%AF%B4']);
    if (argv.length < 3) {
        console.log('require url.');
        return;
    }

    const url = argv[2];
    const parser = parsers.find(z => z.match(url));
    if (!parser) {
        console.log('unknown url.');
        return;
    }
    const generator = getGenerator('md');

    const body = await requestData(url);
    const dom = new jsdom.JSDOM(body);
    const session = new SessionContext({
        url: url,
        root: createRoot(),
        window: dom.window
    });
    parser.parse(session);
    generator.generate(session);
}

(async function() {
    try {
        await main();
    } catch (error) {
        console.error(error);
    }
})();
