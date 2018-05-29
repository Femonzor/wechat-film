import xml2js from "xml2js";

export const parseXMLAsync = xml => new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true }, (error, content) => {
        if (error) reject(error);
        else resolve(content);
    });
});

export const formatMessage = result => {
    const message = {};
    if (typeof result === "object") {
         const keys = Object.keys(result);
         for (const key of keys) {
             const items = result[key];
             if (items.length === 1) {
                 const val = items[0];
                 if (typeof val === "object") {
                     message[key] = formatMessage(val);
                 } else {
                     message[key] = (val || "").trim();
                 }
             } else if (items instanceof Array && items.length > 1) {
                 message[key] = [];
                 for (const item of items) {
                     message[key].push(formatMessage(item));
                 }
             }
         }
    }
    return message;
};
