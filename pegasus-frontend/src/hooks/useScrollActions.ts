export default function userScrollActions() {
  const scrollToTop = (
    functions: Function[],
    behavior: ScrollBehavior = "smooth",
    delayInMs: number = 1000
  ) => {
    window.scrollTo({ top: 0, behavior: behavior });
    setTimeout(() => {
      if (functions.length > 0) {
        functions.forEach((fn) => fn());
      }
    }, delayInMs);
  };

  return {
    scrollToTop,
  };
}
