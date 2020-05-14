class Union extends Array {}

const compareObject = (a, b) => {
  let ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();

  const types = [Number, String];
  const unionKeys = [];
  ak = ak.filter((key) => {
    const match = types.map(String).indexOf(key);
    if (match === -1) {
      return true;
    } else {
      unionKeys.push(types[match]);
      return false;
    }
  });

  if (unionKeys.length === 0 && ak.length !== bk.length) return false;

  try {
    ak.forEach((key, index) => {
      if (!compare(a[key], b[key])) throw new Error("Type missmatch");

      delete bk[bk.indexOf(key)];
    });
    bk.forEach((key) => {
      if (unionKeys.length === 0) throw new Error("Type missmatch");

      const match = unionKeys.reduce((last, creator) => {
        if (last) return true;
        if (!Number.isNaN(creator(key))) {
          return compare(a[creator + ""], b[key]);
        }
      }, false);

      if (!match) throw new Error("Type missmatch");
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
