import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AiOutlineDollarCircle, AiOutlineSearch } from "react-icons/ai";
import { MdCarRental, MdLocalParking } from "react-icons/md";

const GroupOfButtons = () => {
  const router = useRouter();

  return (
    <Box
      display={"flex"}
      backgroundColor="#F6D13A"
      width="80%"
      height="240px"
      borderRadius="16px"
      borderColor={"black"}
      borderWidth={"2px"}
      justifyContent={"space-between"}
      padding={"1rem"}
    >
      <Box
        padding={"10px"}
        borderWidth={"5px"}
        borderRadius={"16px"}
        borderColor={"blackAlpha.500"}
        bgColor={"blackAlpha.200"}
        boxShadow={"dark-lg"}
        w={"23%"}
        h={"100%"}
        _hover={{ cursor: "pointer", bg: "#f5d556" }}
        onClick={() => router.push("/findParkingLot")}
      >
        <VStack alignItems={"start"}>
          <AiOutlineSearch size={"32px"} color={"#D56B2D"} />
          <Text fontSize={"18px"} fontWeight={"black"}>
            Find the nearest location
          </Text>
          <Text fontSize={"12px"} textColor={"blackAlpha.700"}>
            Avoid getting late by finsing a parking spot near you
          </Text>
        </VStack>
      </Box>
      <Box
        padding={"10px"}
        borderWidth={"5px"}
        borderRadius={"16px"}
        borderColor={"blackAlpha.500"}
        bgColor={"blackAlpha.200"}
        boxShadow={"dark-lg"}
        w={"23%"}
        h={"100%"}
        _hover={{ cursor: "pointer", bg: "#f5d556" }}
        onClick={() => router.push("/marketplace")}
      >
        <VStack alignItems={"start"}>
          <AiOutlineDollarCircle size={"32px"} color={"#D56B2D"} />
          <Text fontSize={"18px"} fontWeight={"black"}>
            Buy/Sell a parking lot
          </Text>
          <Text fontSize={"12px"} textColor={"blackAlpha.700"}>
            Get the perfect spot for you or sell the old one
          </Text>
        </VStack>
      </Box>
      <Box
        padding={"10px"}
        borderWidth={"5px"}
        borderRadius={"16px"}
        borderColor={"blackAlpha.500"}
        bgColor={"blackAlpha.200"}
        boxShadow={"dark-lg"}
        w={"23%"}
        h={"100%"}
        _hover={{ cursor: "pointer", bg: "#f5d556" }}
        onClick={() => router.push("/rental-scheme")}
      >
        <VStack alignItems={"start"}>
          <MdCarRental color={"#D56B2D"} size={"32px"}></MdCarRental>
          <Text fontSize={"18px"} fontWeight={"black"}>
            Book your parking lot
          </Text>
          <Text fontSize={"12px"} textColor={"blackAlpha.700"}>
            Loaned out your parking lots or borrow one
          </Text>
        </VStack>
      </Box>
      <Box
        padding={"10px"}
        borderWidth={"5px"}
        borderRadius={"16px"}
        borderColor={"blackAlpha.500"}
        bgColor={"blackAlpha.200"}
        boxShadow={"dark-lg"}
        w={"23%"}
        h={"100%"}
        _hover={{ cursor: "pointer", bg: "#f5d556" }}
        onClick={() => router.push("/viewMyParkingLots")}
      >
        <VStack alignItems={"start"}>
          <MdLocalParking size={"32px"} color={"#D56B2D"} />
          <Text fontSize={"18px"} fontWeight={"black"}>
            View your parking lots
          </Text>
          <Text fontSize={"12px"} textColor={"blackAlpha.700"}>
            Check what parking lots you can have
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default GroupOfButtons;
