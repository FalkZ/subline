export const compose = (
  first,
  ...all
): {
  new (): HTMLElement;
  prototype: HTMLElement;
} => all.reduce((current, next) => next(current), first);
