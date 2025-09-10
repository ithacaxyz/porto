export const supported = () =>
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in IntersectionObserverEntry.prototype &&
  'isVisible' in IntersectionObserverEntry.prototype
