import { useUserContext } from "@/context/UserContext";
import { SearchIcon } from "@chakra-ui/icons";
import { Box, Image, VStack, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface MainCardProps {
  type: string;
  image: string;
}

const MainCard: React.FC<MainCardProps> = ({ image, type }) => {
  const router = useRouter();
  const { state: userState, dispatch } = useUserContext();

  const handleClick = (customFilter: any) => {
    router.push("/findParkingLot");

    if (type === "smart") {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          attributes: {
            forDisabledPeople: false,
            forSmartCar: true,
            forBicycle: false,
            forMotorcycle: false,
          },
          purpose: {
            forBuy: false,
            forBorrow: false,
          },
          sortBy: "PriceLowestHighest",
          price: 0,
          period: 0,
          unitsForPeriod: "days",
          rule: "less",
        },
      });
    } else if (type === "disable") {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          attributes: {
            forDisabledPeople: true,
            forSmartCar: false,
            forBicycle: false,
            forMotorcycle: false,
          },
          purpose: {
            forBuy: false,
            forBorrow: false,
          },
          sortBy: "PriceLowestHighest",
          price: 0,
          period: 0,
          unitsForPeriod: "days",
          rule: "less",
        },
      });
    } else if (type === "bicycle") {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          attributes: {
            forDisabledPeople: false,
            forSmartCar: false,
            forBicycle: true,
            forMotorcycle: false,
          },
          purpose: {
            forBuy: false,
            forBorrow: false,
          },
          sortBy: "PriceLowestHighest",
          price: 0,
          period: 0,
          unitsForPeriod: "days",
          rule: "less",
        },
      });
    } else if (type === "motorcycle") {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          attributes: {
            forDisabledPeople: false,
            forSmartCar: false,
            forBicycle: false,
            forMotorcycle: true,
          },
          purpose: {
            forBuy: false,
            forBorrow: false,
          },
          sortBy: "PriceLowestHighest",
          price: 0,
          period: 0,
          unitsForPeriod: "days",
          rule: "less",
        },
      });
    } else {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          attributes: {
            forDisabledPeople: false,
            forSmartCar: false,
            forBicycle: false,
            forMotorcycle: false,
          },
          purpose: {
            forBuy: false,
            forBorrow: false,
          },
          sortBy: "PriceLowestHighest",
          price: 0,
          period: 0,
          unitsForPeriod: "days",
          rule: "less",
        },
      });
    }
  };

  return (
    <Box
      backgroundColor="#F6D13A"
      width="30%"
      height="240px"
      borderRadius="16px"
      borderColor={"black"}
      borderWidth={"2px"}
    >
      <VStack p={2}>
        <Box maxW={"200px"} maxH={"200px"}>
          <Image borderRadius={"16px"} alt={`car-${type}`} src={image} />
        </Box>
        <Text
          fontFamily={"cursive"}
          fontWeight={"bold"}
          align={"center"}
          color={"black"}
        >
          {type === "disable"
            ? "Parking Lot for Disabled People"
            : type === "bicycle" || type === "motorcycle"
            ? `Parking Lot For A ${
                type.charAt(0).toUpperCase() + type.slice(1)
              }`
            : `Parking Lot For ${
                type.charAt(0).toUpperCase() + type.slice(1)
              } Car`}
        </Text>
        <Button
          backgroundColor={"blackAlpha.900"}
          _hover={{ bg: "blackAlpha.600" }}
          color={"white"}
          leftIcon={<SearchIcon />}
          onClick={() => handleClick(type)}
        >
          FIND
        </Button>
      </VStack>
    </Box>
  );
};

export default MainCard;
