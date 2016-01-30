import { isPrimitive } from './utils';

export default function serialize(obj, paths, currentPath) {
  currentPath = currentPath || '';

  for (let key of Object.keys(obj)) {
    let val = obj[key];
    let newPath = `${currentPath}/${key}`;

    if (isPrimitive(val)) {
      paths = paths || {};
      paths[newPath] = val;
    } else {
      paths = serialize(val, paths, newPath);
    }
  }

  return paths;
}
