import { motion } from "motion/react";
import logo from "@/assets/logo-rana.svg";
import map from "@/assets/map-indonesia.svg";

const Logo = () => {
  return (
    <motion.div
      initial={{ translateX: 0 }}
      animate={{ translateX: "100%" }}
      transition={{ duration: 0.5, delay: 1.5, ease: [1, 0, 1, 0.5] }}
      className="fixed top-0 left-0 right-0 h-screen bg-background z-[99] flex justify-center items-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <img src={logo} alt="Logo Rana" className="w-[300px] drop-shadow-lg" />
      </motion.div>
      <img src={map} alt="Peta Indonesia" className="w-[600px] absolute -bottom-[100px] -right-[100px] rotate-[10deg]" />
    </motion.div>
  );
};

export default Logo;