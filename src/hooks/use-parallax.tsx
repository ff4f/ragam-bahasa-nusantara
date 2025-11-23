import { useScroll, useTransform } from "framer-motion";

export const useParallax = (n = 0.4) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, v => v * n);
  return y;
};