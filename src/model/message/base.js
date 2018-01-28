class Base {
    constructor() { }
    toXML(body) {
        let xml = "";
        const members = Object.getOwnPropertyNames(this);
        for (const member of members) {
            if (typeof member === "object") {                
                xml += members.toXML(true);
            } else if (typeof this[member] !== "undefined") {
                xml += `<${member}><![CDATA[${this[member]}]]></${member}>`;
            }
        }
        if (!body) return `<xml>${xml}</xml>`;
        if (typeof body === "string") return `<${body}>${xml}</${body}>`;
        return xml;
    }
}

export default Base;
