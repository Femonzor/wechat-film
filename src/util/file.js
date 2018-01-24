import { readFile, writeFile } from "fs";

export const readFileAsync = (filePath, encoding) => new Promise((resolve, reject) => {
    encoding = encoding || "utf8";
    readFile(filePath, encoding, (error, content) => {
        if (error) reject(error);
        else resolve(content);
    });
});

export const writeFileAsync = (filePath, content) => new Promise((resolve, reject) => {
    writeFile(filePath, content, error => {
        if (error) reject(error);
        else resolve();
    });
});
