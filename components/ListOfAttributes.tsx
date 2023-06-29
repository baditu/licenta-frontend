import { List, ListIcon, ListItem } from "@chakra-ui/react";
import React from "react";
import { CheckIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";

interface ListOfAttributesProps {
  attributes: any;
}

const ListOfAttributes: React.FC<ListOfAttributesProps> = ({ attributes }) => {
  return (
    <>
      <List bgColor={"black"} borderRadius={"16px"} padding={"1rem"}>
        <ListItem
          width={"100%"}
          whiteSpace={"nowrap"}
          textOverflow={"ellipsis"}
          fontSize={"12px"}
          color={"#F6D13A"}
        >
          <ListIcon
            as={attributes[2].value === "true" ? CheckIcon : CloseIcon}
          />
          Disabled people
        </ListItem>
        <ListItem
          width={"100%"}
          whiteSpace={"nowrap"}
          textOverflow={"ellipsis"}
          fontSize={"12px"}
          color={"#F6D13A"}
        >
          <ListIcon
            as={attributes[3].value === "true" ? CheckIcon : CloseIcon}
            color="black.500"
          />
          For smart car
        </ListItem>
        <ListItem
          width={"100%"}
          whiteSpace={"nowrap"}
          textOverflow={"ellipsis"}
          fontSize={"12px"}
          color={"#F6D13A"}
        >
          <ListIcon
            as={attributes[4].value === "true" ? CheckIcon : CloseIcon}
          />
          Motorcycle
        </ListItem>
        <ListItem
          width={"100%"}
          whiteSpace={"nowrap"}
          textOverflow={"ellipsis"}
          fontSize={"12px"}
          color={"#F6D13A"}
        >
          <ListIcon
            as={attributes[5].value === "true" ? CheckIcon : CloseIcon}
            color="black.500"
          />
          Bicycle
        </ListItem>
      </List>
    </>
  );
};

export default ListOfAttributes;
