import { Box, Flex } from "@chakra-ui/react";
import BlurBg from "./BlurBg";

const Background = () => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      backgroundImage="url('/images/background.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      zIndex={"-1"}
    >
      <BlurBg />
    </Box>
  );
};

export default Background;
