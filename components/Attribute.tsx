import { Box, Flex, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import React from "react";
import { CheckIcon, CloseIcon, Icon, SearchIcon } from "@chakra-ui/icons";

interface Attribute {
  name: string;
  value: string;
}

const Attribute: React.FC<Attribute> = ({ name, value }) => {

  return (
    <>
      <Flex
        w={"100px"}
        p={"0.5rem"}
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        whiteSpace={"nowrap"}
        borderRadius={"20px"}
        bgColor={"blackAlpha.900"}
        textOverflow={"ellipsis"}
        fontSize={"12px"}
        color={"#F6D13A"}
        boxShadow={"dark-lg"}
      >
        <Text>{name}</Text>
        <Icon as={value === "true" ? CheckIcon : CloseIcon} />
      </Flex>
    </>
  );
};

export default Attribute;
