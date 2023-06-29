import {
  Box,
  Text,
  Flex,
  Link,
  useColorMode,
  useColorModeValue,
  HStack,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { ComponentConnect } from "./ComponentConnect";
import FlipCoin from "./FlipCoin";

export const NavBar = () => {
  const navbarColor = useColorModeValue("#F6D13A", "#F6D13A");

  return (
    <Box className="nav-bar" bg={navbarColor} px={4}>
      <Flex
        h={24}
        pr={5}
        alignItems={"center"}
        justifyContent={"space-between"}
        zIndex={"100px"}
      >
        <VStack spacing={0}>
          <Text fontFamily={"cursive"} fontWeight={"bold"} fontSize="2xl">
            Parking
          </Text>
          <Text fontFamily={"cursive"} fontWeight={"bold"} fontSize="2xl">
            Block
          </Text>
        </VStack>
        <ComponentConnect />
      </Flex>
    </Box>
  );
};
