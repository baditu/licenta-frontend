import { Box, keyframes } from "@chakra-ui/react";
import { motion, useMotionValue } from "framer-motion";
import React, { useEffect, useMemo } from "react";

type CarouselCardProps = {
  index: number;
  currIndex: number;
  front?: React.ReactElement;
  back?: React.ReactElement;
  width: number;
};

const CarouselCard: React.FC<CarouselCardProps> = ({
  index,
  currIndex,
  front,
  back,
  width,
}) => {
  const isSelected = index === currIndex;

  const frontRotateY = useMemo(() => {
    if (index < currIndex) return "-180deg";
    else if (isSelected) return "0deg";
    else return "180deg";
  }, [currIndex, index, isSelected]);

  const backRotateY = useMemo(() => {
    if (index < currIndex) return "0deg";
    else if (isSelected) return "180deg";
    else return "360deg";
  }, [currIndex, index, isSelected]);

  const size = useMemo(() => {
    if (isSelected)
      return {
        width: `${width}rem`,
        height: "100%",
      };
    return {
      width: `${width / 2}rem`,
      height: "50%",
    };
  }, [isSelected, width]);

  let nextPrevTarget = "";
  if (currIndex < index) {
    nextPrevTarget = "js-nextCarouselCard";
  } else if (currIndex >= index) {
    nextPrevTarget = "js-previousCarouselCard";
  }

  return (
    <motion.div
      style={{
        position: "relative",
        perspective: "1000px",
        backfaceVisibility: "hidden",
        width: size.width,
        height: size.height,
      }}
      animate={{ width: size.width, height: size.height }}
      transition={{ duration: 1 }}
      onClick={
        isSelected
          ? undefined
          : (e) => document.getElementById(nextPrevTarget)?.click()
      }
    >
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          translateX: "-50%",
          translateY: "-50%",
          rotateY: frontRotateY,
          backfaceVisibility: "hidden",
        }}
        animate={{ rotateY: frontRotateY }}
        transition={{ duration: 1 }}
      >
        {front}
      </motion.div>
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          translateX: "-50%",
          translateY: "-50%",
          rotateY: backRotateY,
          backfaceVisibility: "hidden",
        }}
        animate={{ rotateY: backRotateY }}
        transition={{ duration: 1 }}
      >
        {back}
      </motion.div>
    </motion.div>
  );
};

export default CarouselCard;
