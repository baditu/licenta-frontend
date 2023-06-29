import { List, ListIcon, ListItem } from "@chakra-ui/react";
import React from "react";
import { CheckIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";

interface ListOfAttributesForRentProps {
  forDisabledPeople: string;
  smartLot: string;
  isBicycle: string;
  isMotorcycle: string;
}

const ListOfAttributesForRent: React.FC<ListOfAttributesForRentProps> = ({
  forDisabledPeople,
  smartLot,
  isBicycle,
  isMotorcycle,
}) => {
  return (
    <>
      <List bgColor={"black"} borderRadius={"16px"} padding={"1rem"}>
        {forDisabledPeople === "true" && (
          <>
            {" "}
            <ListItem
              width={"100%"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              fontSize={"12px"}
              color={"#F6D13A"}
            >
              For disabled people
            </ListItem>
          </>
        )}
        {smartLot === "true" && (
          <>
            <ListItem
              width={"100%"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              fontSize={"12px"}
              color={"#F6D13A"}
            >
              For smart car
            </ListItem>
          </>
        )}
        {isMotorcycle === "true" && (
          <>
            <ListItem
              width={"100%"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              fontSize={"12px"}
              color={"#F6D13A"}
            >
              Motorcycle
            </ListItem>
          </>
        )}
        {isBicycle === "true" && (
          <>
            {" "}
            <ListItem
              width={"100%"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              fontSize={"12px"}
              color={"#F6D13A"}
            >
              <ListIcon
                as={isBicycle === "true" ? CheckIcon : CloseIcon}
                color="black.500"
              />
              Bicycle
            </ListItem>
          </>
        )}
      </List>
    </>
  );
};

export default ListOfAttributesForRent;
