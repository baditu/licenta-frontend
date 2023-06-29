import React from "react";
import { VStack, Text, Image, Box, Icon } from "@chakra-ui/react";
import { TbParking } from "react-icons/tb";

type MyParkingLotBackCardProps = {
  item: any;
};

const MyParkingLotBackCard: React.FC<MyParkingLotBackCardProps> = ({
  item,
}) => {
  console.log("Item: ", item);

  return (
    <VStack
      w={"100%"}
      h={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      padding={"2rem"}
      bgGradient="linear(to-b, #F6D13A, #D56B2D)"
      borderRadius={"16px"}
    >
      <Box position="relative">
        <Image
          mt={0}
          alt={`lot number ${item?.id}`}
          src={`https://ipfs.io/ipfs/${item.image.split("/")[2]}/`}
          maxW={"200px"}
        />
        <Icon
          as={TbParking}
          position="absolute"
          top="10%"
          left="7%"
          transform="translate(-50%, -50%)"
          boxSize="50px"
        />
      </Box>
      <Text textColor={"white"} fontSize={"2xl"}>
        ParkingLot #{item.id}
      </Text>
    </VStack>
  );
};

export default MyParkingLotBackCard;
