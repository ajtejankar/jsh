export function isPrimitive(val) {
  let type = Object.prototype.toString.call(val);

  return !(type === '[object Object]' || type === '[object Array]');
}

export default { isPrimitive };
