import { Box } from "@chakra-ui/react";
import React from "react";

type BlurBgProps = {
  zIndex?: number;
};

export default function BlurBg(props: BlurBgProps): JSX.Element {
  const { zIndex = 100 } = props;
  return (
    <Box
      position={"fixed"}
      top={0}
      left={0}
      bottom={0}
      right={0}
      bgColor={"rgba(255, 255, 255, 0.1)"}
      backdropFilter={"blur(10px)"}
      zIndex={zIndex}
    ></Box>
  );
}
