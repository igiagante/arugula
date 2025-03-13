import { motion } from "framer-motion";
import Image from "next/image";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <Image
            src="/cannabis-icon.svg"
            alt="Cannabis Icon"
            width={32}
            height={32}
          />
        </p>
        <p>
          Your personal growing assistant, ready to help you achieve successful
          harvests. Ask me anything about cultivation techniques, plant care, or
          grow optimization.
        </p>
      </div>
    </motion.div>
  );
};
