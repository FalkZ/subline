class Union extends Array {}

const compareObject = (a, b) => {
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();

  if (ak.length !== bk.length) return false;

  try {
    ak.map((key, index) => {
      if (key !== bk[index] || !compare(a[key], b[bk[index]]))
        throw new Error("Type missmatch");
    });
    return true;
  } catch (error) {
    return false;
  }
};

const compareArrayValue = (types, value) =>
  types.reduce((last, typ) => (last ? true : compare(typ, value)), false);
const compareArrays = (a, b) =>
  b.reduce(
    (last, value) => (last !== false ? compareArrayValue(a, value) : false),
    true
  );

const compare = (a, b) => {
  try {
    if (typeof a === "function") a = a();
  } catch (error) {}

  if (a === null || a === undefined) return a === b;

  if (a.constructor.name === "Function") {
    return b instanceof a;
  }

  if (Number.isNaN(b)) {
    return Number.isNaN(a);
  }

  if (a instanceof Union) return compareArrayValue(a, b);

  return typeof a === typeof b
    ? typeof a === "object"
      ? a.constructor.name === "Object"
        ? compareObject(a, b)
        : Array.isArray(a)
        ? compareArrays(a, b)
        : a.constructor.name === b.constructor.name
      : true
    : false;
};

const union = (...types) => new Union(...types);

export { compare, union as Union };
