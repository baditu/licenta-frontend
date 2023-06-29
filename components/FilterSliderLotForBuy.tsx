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
} from "@chakra-ui/react";

interface FilterSliderLotForBuyProps {
  title: string;
  sliderValue: any;
  onChangeCallback: Function;
}

const FilterSliderLotForBuy: React.FC<FilterSliderLotForBuyProps> = ({
  title,
  sliderValue,
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
      <Box
        display={"flex"}
        justifyContent={"flex-start"}
        flexDirection={"column"}
        width={"100%"}
      >
        <Text mb={"4"} textColor={"blackAlpha.900"}>
          {title}
        </Text>
        <Slider
          onChange={(val) => onChangeCallback(val)}
          defaultValue={sliderValue}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          min={0}
          max={10000}
          step={1}
        >
          <SliderMark value={0} {...labelStyles}>
            0
          </SliderMark>
          <SliderMark value={2500} {...labelStyles}>
            2500
          </SliderMark>
          <SliderMark value={5000} {...labelStyles}>
            5000
          </SliderMark>
          <SliderMark value={7500} {...labelStyles}>
            7500
          </SliderMark>
          <SliderMark value={10000} {...labelStyles}>
            10000
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
    </>
  );
};

export default FilterSliderLotForBuy;
