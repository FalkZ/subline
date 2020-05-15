export const v = ({ self, context: { num } }) => {
  self.nest(num);
  self.onclick = () => num.next((v) => v + 1);
};
