import { readFile, writeFile } from "fs";

export const readFileAsync = (filePath, encoding) => new Promise((resolve, reject) => {
    // console.log("read filePath: ", filePath);
    encoding = encoding || "utf8";
    readFile(filePath, encoding, (error, content) => {
        if (error) {
            console.log("readFile error: %s", error);
            reject(error);
        } else {
            // console.log("readFile content: %s", content);
            resolve(content);
        }
    });
});

export const writeFileAsync = (filePath, content) => new Promise((resolve, reject) => {
    // console.log("write filePath: %s", filePath);
    // console.log("write file content: %s", content);
    writeFile(filePath, content, error => {
        if (error) {
            console.log("writeFile error: %s", error);
            reject(error);
        } else {
            // console.log("write file success");
            resolve();
        }
    });
});
