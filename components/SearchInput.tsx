import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { AddressAutofill } from "@mapbox/search-js-react";
import React, { useState } from "react";
import { getGeocode } from "@/lib/helperFunctions";

interface SearchInputProps {
  coordinates: any;
  setCoordinates: Function;
}

const SearchInput: React.FC<SearchInputProps> = ({
  coordinates,
  setCoordinates,
}) => {
  const [address, setAddress] = useState<string>("");

  const handleSearch = async (address: string) => {
    try {
      const coordinates = await getGeocode(address);

      setCoordinates(coordinates);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <HStack>
      <Input
        focusBorderColor={"black"}
        placeholder="Search by address"
        _placeholder={{ color: "#F6D13A" }}
        borderColor={"#F6D13A"}
        variant={"outline"}
        textColor={"#F6D13A"}
        maxW={"350px"}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <IconButton
        color={"black"}
        backgroundColor={"#F6D13A"}
        _hover={{ bg: "#f5d556" }}
        aria-label="Căutare"
        icon={<SearchIcon />}
        onClick={() => handleSearch(address!)}
      />
    </HStack>
  );
};

export default SearchInput;
