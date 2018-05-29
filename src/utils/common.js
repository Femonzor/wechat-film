/**
 * 获取变量类型
 * @param {*} obj 变量
 */
export const type = obj => Object.prototype.toString.call(obj).slice(8, -1);
