export const cmyk = (c, m, y, k, a) => {
  c = c * (1 - k) + k;
  m = m * (1 - k) + k;
  y = y * (1 - k) + k;

  // r = 1 -2c + k (c+1)
  var r = 1 - c;
  var g = 1 - m;
  var b = 1 - y;

  //if (!normalized) {
  r = Math.round(255 * r);
  g = Math.round(255 * g);
  b = Math.round(255 * b);
  //}

  if (a) return `rgba(${r}, ${g}, ${b}, ${a})`;
  return `rgb(${r}, ${g}, ${b})`;
};
