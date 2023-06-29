import { Box, Text, Flex, HStack, VStack, Image } from "@chakra-ui/react";
import BlurBg from "./BlurBg";
import GroupOfButtons from "./GroupOfButtons";
import MainCard from "./MainCard";
import { useRouter } from "next/router";
import { useUserContext } from "@/context/UserContext";

const MaineMenu = () => {
  
  return (
    <Flex
      justifyContent="center"
      alignItems="flex-start"
      height="100%"
      position="relative"
      pt={"100px"}
      zIndex={"100"}
    >
      <VStack>
        <Box
          display="flex"
          justifyContent="space-between"
          padding="2rem"
          width="80%"
        >
          <MainCard
            type={"normal"}
            image={"/images/normal_car.png"}
          />
          <MainCard
            type={"smart"}
            image={"/images/smart_car.png"}
          />
          <MainCard
            type={"disable"}
            image={"/images/disable_car.png"}
          />
          <MainCard
            type={"bicycle"}
            image={"/images/bicycle.png"}
          />
          <MainCard
            type={"motorcycle"}
            image={"/images/motorcycle.png"}
          />
        </Box>
        <GroupOfButtons />
      </VStack>
    </Flex>
  );
};

export default MaineMenu;
