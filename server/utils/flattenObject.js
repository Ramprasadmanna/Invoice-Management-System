const flattenObject = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, key) => {
    const propName = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], propName));
    } else {
      acc[propName] = obj[key];
    }
    return acc;
  }, {});
};


export { flattenObject }