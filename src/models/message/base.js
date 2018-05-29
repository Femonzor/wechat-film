import { type } from "../../utils/common";

class Base {
    constructor() { }
    toXML(body) {
        let xml = "", tmpXml, objType, value;
        const members = Object.getOwnPropertyNames(this);
        for (const member of members) {
            value = this[member];
            objType = type(value);
            if (objType === "Array") {
                tmpXml = "";
                for (const data of value) {
                    tmpXml += data.toXML(data.closureTag);
                }
                xml += `<${member}>${tmpXml}</${member}>`;
            } else if (objType === "Object") {
                tmpXml = value.toXML(true);
                xml += `<${member}>${tmpXml}</${member}>`;
            } else if (objType !== "Undefined") {
                xml += `<${member}><![CDATA[${value}]]></${member}>`;
            }
        }
        if (!body) return `<xml>${xml}</xml>`;
        if (typeof body === "string") return `<${body}>${xml}</${body}>`;
        return xml;
    }
}

export default Base;
