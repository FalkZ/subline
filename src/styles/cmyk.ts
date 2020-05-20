export const cmyk = (c, m, y, k, a = 1) => {
  const convert = (color) => (1 - k) * (1 - color) * 255;

  const convertedColors = [c, m, y].map(convert);
  if (a !== 1) convertedColors.push(a * 255);

  return (
    "#" +
    convertedColors
      .map((num) => {
        let s = Math.round(num).toString(16);
        if (s.length === 1) s = "0" + s;
        return s;
      })
      .join("")
  );
};
