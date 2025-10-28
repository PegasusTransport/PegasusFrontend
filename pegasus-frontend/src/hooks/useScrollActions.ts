export default function userScrollActions() {
  const scrollToTop = (behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({ top: 0, behavior: behavior });
  };

  return {
    scrollToTop,
  };
}
