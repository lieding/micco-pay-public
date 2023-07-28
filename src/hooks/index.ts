import { useLayoutEffect } from "react";

export function useScrollTop() {
  useLayoutEffect(() => {
    if (window.scrollY && window.scrollY > 50) window.scrollTo(0, 0);
  }, []);
}
