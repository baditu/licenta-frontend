import React, { useEffect, useState } from "react";
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
  Tooltip,
  VStack,
  Checkbox,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  RadioGroup,
  Radio,
  HStack,
  Flex,
  Select,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { MdArrowDropDown } from "react-icons/md";

interface FilterSliderLotForRentProps {
  title: string;
  sliderValue: any;
  setPeriodInHours: Function;
  setPeriodInDays: Function;
  setRuleForPeriod: Function;
  onChangeCallback: Function;
}

const FilterSliderLotForRent: React.FC<FilterSliderLotForRentProps> = ({
  title,
  sliderValue,
  setRuleForPeriod,
  setPeriodInHours,
  setPeriodInDays,
  onChangeCallback,
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };
  return (
    <>
      <VStack alignItems={"flex-start"}>
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          flexDirection={"column"}
          mb={"2rem"}
          width={"80%"}
        >
          <Text textColor={"blackAlpha.900"} mb={4}>
            {title}
          </Text>
          <Slider
            onChange={(val) => onChangeCallback(val)}
            defaultValue={sliderValue}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            min={0}
            max={1000}
            step={1}
          >
            <SliderMark value={0} {...labelStyles}>
              0
            </SliderMark>
            <SliderMark value={250} {...labelStyles}>
              250
            </SliderMark>
            <SliderMark value={500} {...labelStyles}>
              500
            </SliderMark>
            <SliderMark value={750} {...labelStyles}>
              750
            </SliderMark>
            <SliderMark value={1000} {...labelStyles}>
              1000
            </SliderMark>
            <SliderTrack bg="black">
              <Box position="relative" right={10} />
              <SliderFilledTrack bg="white" />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="#D56B2D"
              color="#F6D13A"
              placement="top"
              isOpen={showTooltip}
              label={`${sliderValue}`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
        </Box>
        <VStack pt={"1rem"} spacing={"2rem"} alignItems={"flex-start"}>
          {/* <Text textColor={"blackAlpha.900"}>PERIOD</Text> */}
          <FormControl
            borderColor={"black"}
            borderRadius={"16px"}
            variant="floating"
            id="bid"
            bgColor={"transparent"}
            _focus={{ bgColor: "", borderColor: "purple.500" }}
          >
            <Input
              textColor={"white"}
              colorScheme={"white"}
              focusBorderColor="white"
              placeholder=" "
              type="period"
              onChange={(event) =>
                setPeriodInDays(
                  Number(
                    isNaN(Number(event.target.value)) ? 0 : event.target.value
                  )
                )
              }
            />
            <FormLabel>
              <Text>Period (days)</Text>
            </FormLabel>
          </FormControl>
          <FormControl
            borderColor={"black"}
            borderRadius={"16px"}
            variant="floating"
            id="bid"
            bgColor={"transparent"}
            _focus={{ bgColor: "", borderColor: "purple.500" }}
          >
            <Input
              textColor={"white"}
              colorScheme={"white"}
              focusBorderColor="white"
              placeholder=" "
              type="period"
              onChange={(event) =>
                setPeriodInHours(
                  Number(
                    isNaN(Number(event.target.value)) ? 0 : event.target.value
                  )
                )
              }
            />
            <FormLabel>
              <Text>Period (hours)</Text>
            </FormLabel>
          </FormControl>
        </VStack>
        <RadioGroup defaultValue="more than">
          <HStack spacing="24px">
            <Radio
              textColor={"blackAlpha.900"}
              colorScheme={"blackAlpha"}
              value="less than"
              onChange={() => setRuleForPeriod("less")}
            >
              less than
            </Radio>
            <Radio
              textColor={"blackAlpha.900"}
              colorScheme={"blackAlpha"}
              value="more than"
              onChange={() => setRuleForPeriod("more")}
            >
              more than
            </Radio>
            <Radio
              textColor={"blackAlpha.900"}
              colorScheme={"blackAlpha"}
              value="exact"
              onChange={() => setRuleForPeriod("exact")}
            >
              exact
            </Radio>
          </HStack>
        </RadioGroup>
      </VStack>
    </>
  );
};

export default FilterSliderLotForRent;
