import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  Image,
  useMediaQuery,
} from "@chakra-ui/react";
import BlurBg from "./BlurBg";
import GroupOfButtons from "./GroupOfButtons";
import MainCard from "./MainCard";
import { useRouter } from "next/router";
import { useUserContext } from "@/context/UserContext";

const MaineMenu = () => {
  const [isForMobile] = useMediaQuery("(max-width: 500px)");
  const [isForTable] = useMediaQuery("(max-width: 800px)");

  return (
    <Flex
      justifyContent="center"
      alignItems="flex-start"
      height="100%"
      position="relative"
      pt={isForMobile || isForTable ? "1rem" : "100px"}
      zIndex={"100"}
    >
      <VStack>
        {!isForMobile && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              padding="2rem"
              width="80%"
              flexDirection={isForTable ? "column" : "row"}
            >
              <MainCard type={"normal"} image={"/images/normal_car.png"} />
              <MainCard type={"smart"} image={"/images/smart_car.png"} />
              <MainCard type={"disable"} image={"/images/disable_car.png"} />
              <MainCard type={"bicycle"} image={"/images/bicycle.png"} />
              <MainCard type={"motorcycle"} image={"/images/motorcycle.png"} />
            </Box>
          </>
        )}
        <GroupOfButtons />
      </VStack>
    </Flex>
  );
};

export default MaineMenu;
