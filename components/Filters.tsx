import { useUserContext } from "@/context/UserContext";
import { Box, Checkbox, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import FilterSliderLotForBuy from "./FilterSliderLotForBuy";
import FilterSliderLotForRent from "./FilterSliderLotForRent";

interface FiltersProps {
  onChangeCallback: Function;
}

const Filters: React.FC<FiltersProps> = ({ onChangeCallback }) => {
  const { state: userState } = useUserContext();
  const { filters } = userState;
  const [isForRent, setIsForRent] = useState<boolean | undefined>(undefined);
  const [isForDisabled, setIsForDisabled] = useState<boolean>(
    filters?.attributes?.forDisabledPeople
  );
  const [isForSmartCar, setIsForSmartCar] = useState<boolean>(
    filters?.attributes?.forSmartCar
  );
  const [isForBicycle, setIsFoBicycle] = useState<boolean>(
    filters?.attributes?.forBicycle
  );
  const [isForMotorcycle, setIsForMotorcycle] = useState<boolean>(
    filters?.attributes?.forMotorcycle
  );

  const [isForBuy, setIsForBuy] = useState<boolean>(filters?.purpose?.forBuy);
  const [isForBorrow, setIsForBorrow] = useState<boolean>(
    filters?.purpose?.forBorrow
  );
  const [sortByState, setSortByState] = useState<any>(filters?.sortBy);

  const [sliderValueForBuy, setSliderValueForBuy] = useState<any>(10000);
  const [sliderValueForBorrow, setSliderValueForBorrow] = useState<any>(1000);
  const [periodInDays, setPeriodInDays] = useState<number>(0);
  const [periodInHours, setPeriodInHours] = useState<number>(0);
  const [rule, setRule] = useState<any>("more");

  useEffect(() => {
    onChangeCallback({
      ...filters,
      attributes: {
        forDisabledPeople: isForDisabled,
        forSmartCar: isForSmartCar,
        forBicycle: isForBicycle,
        forMotorcycle: isForMotorcycle,
      },
      purpose: {
        forBorrow: isForBorrow,
        forBuy: isForBuy,
      },
      sortBy: sortByState,
      price: isForRent ? sliderValueForBorrow : sliderValueForBuy,
      periodInDays: periodInDays,
      periodInHours: periodInHours,
      rule: rule,
    });
  }, [
    filters,
    isForBicycle,
    isForBorrow,
    isForBuy,
    isForDisabled,
    isForMotorcycle,
    isForRent,
    isForSmartCar,
    onChangeCallback,
    periodInDays,
    periodInHours,
    rule,
    sliderValueForBorrow,
    sliderValueForBuy,
    sortByState,
  ]);

  useEffect(() => {
    if (isForBuy === false && isForBorrow === false) {
      setIsForRent(undefined);
    } else if (isForBorrow === true) {
      setIsForRent(true);
    } else if (isForBuy === true) {
      setIsForRent(false);
    }
  }, [isForBorrow, isForBuy]);

  return (
    <VStack
      alignItems={"flex-start"}
      spacing={"3rem"}
      h={"100%"}
      w={"100%"}
      my={"2rem"}
    >
      <Box>
        <Text
          fontFamily={"cursive"}
          fontWeight={"bold"}
          color={"black"}
          fontSize={"24px"}
          pb={"0.5"}
        >
          Filters - Parking Lots
        </Text>
        <Box pb={"0.5"}>
          <Text textColor={"white"} fontSize={"18px"}>
            By attributes
          </Text>
          <VStack alignItems={"flex-start"}>
            <Checkbox
              isChecked={isForDisabled}
              onChange={() => setIsForDisabled(!isForDisabled)}
              colorScheme={"blackAlpha"}
              variant={"filterMenu"}
            >
              For disabled people
            </Checkbox>
            <Checkbox
              isChecked={isForSmartCar}
              onChange={() => setIsForSmartCar(!isForSmartCar)}
              colorScheme={"blackAlpha"}
              variant={"filterMenu"}
            >
              For smart car
            </Checkbox>
            <Checkbox
              isChecked={isForBicycle}
              onChange={() => setIsFoBicycle(!isForBicycle)}
              colorScheme={"blackAlpha"}
              variant={"filterMenu"}
            >
              For Bicycle
            </Checkbox>
            <Checkbox
              isChecked={isForMotorcycle}
              onChange={() => setIsForMotorcycle(!isForMotorcycle)}
              colorScheme={"blackAlpha"}
              variant={"filterMenu"}
            >
              For Motorcycle
            </Checkbox>
          </VStack>
        </Box>
        <Box pb={"2rem"}>
          <Text textColor={"white"} fontSize={"18px"}>
            By purpose (set this for other filters)
          </Text>
          <VStack alignItems={"flex-start"}>
            <Checkbox
              isChecked={isForBuy}
              isDisabled={isForBorrow}
              onChange={() => {
                setIsForBuy(!isForBuy);
                setIsForRent(false);
              }}
              colorScheme={"blackAlpha"}
              variant={"filterMenu"}
            >
              For buy
            </Checkbox>
            <Checkbox
              isChecked={isForBorrow}
              isDisabled={isForBuy}
              onChange={() => {
                setIsForBorrow(!isForBorrow);
                setIsForRent(true);
              }}
              colorScheme={"blackAlpha"}
              variant={"filterMenu"}
            >
              For borrow
            </Checkbox>
          </VStack>
        </Box>
        {isForRent !== undefined && (
          <>
            <Text textColor={"white"} fontSize={"18px"}>
              {isForRent ? "By price or period" : "By price"}
            </Text>

            {(isForRent && (
              <>
                <FilterSliderLotForRent
                  sliderValue={sliderValueForBorrow}
                  setRuleForPeriod={setRule}
                  setPeriodInDays={setPeriodInDays}
                  setPeriodInHours={setPeriodInHours}
                  onChangeCallback={setSliderValueForBorrow}
                  title={"PRICE"}
                />
              </>
            )) || (
              <>
                <FilterSliderLotForBuy
                  sliderValue={sliderValueForBuy}
                  onChangeCallback={setSliderValueForBuy}
                  title={"PRICE"}
                />
              </>
            )}
          </>
        )}
      </Box>
      <Box>
        <Text
          fontFamily={"cursive"}
          fontWeight={"bold"}
          color={"black"}
          fontSize={"24px"}
          pb={"1rem"}
        >
          Sort - Parking Lots
        </Text>
        <HStack spacing={"2rem"}>
          <VStack alignItems={"flex-start"}>
            <Text fontFamily={"cursive"} color={"white"}>
              PRICE
            </Text>
            <Checkbox
              isChecked={sortByState === "PriceHighestLowest"}
              onChange={() => setSortByState("PriceHighestLowest")}
              colorScheme={"blackAlpha"}
              variant={"filterMenu"}
            >
              Highest to lowest
            </Checkbox>
            <Checkbox
              isChecked={sortByState === "PriceLowestHighest"}
              onChange={() => setSortByState("PriceLowestHighest")}
              colorScheme={"blackAlpha"}
              variant={"filterMenu"}
            >
              Lowest to highest
            </Checkbox>
          </VStack>
          {isForRent && (
            <>
              <VStack alignItems={"flex-start"}>
                <Text fontFamily={"cursive"} color={"white"}>
                  PERIOD
                </Text>
                <Checkbox
                  isChecked={sortByState === "PeriodHighestLowest"}
                  onChange={() => setSortByState("PeriodHighestLowest")}
                  colorScheme={"blackAlpha"}
                  variant={"filterMenu"}
                >
                  Highest to lowest
                </Checkbox>
                <Checkbox
                  isChecked={sortByState === "PeriodLowestHighest"}
                  onChange={() => setSortByState("PeriodLowestHighest")}
                  colorScheme={"blackAlpha"}
                  variant={"filterMenu"}
                >
                  Lowest to highest
                </Checkbox>
              </VStack>
            </>
          )}
        </HStack>
      </Box>
    </VStack>
  );
};

export default Filters;
