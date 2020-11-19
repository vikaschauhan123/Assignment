const fs = require('fs');
const readline = require('readline');

const readCsvFile = async function (filePath) {
    const lines = [];

    const file = readline.createInterface({
        input: fs.createReadStream('./resources/'+filePath),
        output: process.stdout,
        terminal: false
    });

    for await (const line of file){
        lines.push(line);
    }

    return lines;
}

module.exports = {readCsvFile}