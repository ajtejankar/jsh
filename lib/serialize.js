import { isPrimitive } from './utils';

export default function serialize(obj, paths, currentPath) {
  currentPath = currentPath || '';

  for (let key of Object.keys(obj)) {
    let val = obj[key];
    let newPath = `${currentPath}/${key}`;

    paths = paths || {};
    paths[newPath] = val;

    if (!isPrimitive(val)) {
      paths = serialize(val, paths, newPath);
    }
  }

  return paths;
}
