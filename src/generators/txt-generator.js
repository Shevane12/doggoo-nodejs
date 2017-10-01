'use strict';

const os = require('os');
const fs = require('fs');

const app = require('../app');
const { Generator } = require('./base');

class TxtGenerator extends Generator {
    generate(context) {
        const novel = context.novel;
        const text = novel.chapters.map(z => this.toDoc(z)).join(os.EOL + os.EOL + os.EOL + os.EOL);
        const title = novel.titleOrDefault;
        const filename = `${title}.${app.name}-${app.build}.txt`;
        const path = filename;
        fs.writeFileSync(path, text, {
            encoding: 'utf8',
            flag: 'w'
        });
    }

    onLineBreak(node) {
        return os.EOL;
    }

    onTextElement(node) {
        return node.content;
    }

    onImageElement(node) {
        return `<此处为插图 ${node.url}>`;
    }

    onLinkElement(node) {
        return node.url;
    }
}

module.exports = TxtGenerator;