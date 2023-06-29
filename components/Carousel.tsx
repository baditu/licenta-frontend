import { Flex, HStack, IconButton, Wrap, WrapItem } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CarouselCard from "./CarouselCard";

type CarouselProps<TItem> = {
  items: TItem[];
  selectedIndex?: number;
  width?: number;
  isListLayout?: boolean;
  renderFront?: (item: TItem, index: number) => React.ReactElement;
  renderBack?: (item: TItem, index: number) => React.ReactElement;
  onChange?: (index: number) => void;
};

export default function Carousel<TItem>(
  props: CarouselProps<TItem>
): JSX.Element {
  const {
    items,
    selectedIndex,
    width = 32,
    isListLayout = false,
    renderFront,
    renderBack,
    onChange,
  } = props;

  const [pointer, setPointer] = useState<number>(selectedIndex ?? 0);

  const incPointer = () => {
    if (pointer >= items.length - 1) return;
    if (pointer < 0) setPointer(0);

    setPointer((prev) => prev + 1);
  };

  const decPointer = () => {
    if (pointer <= 0) return;
    if (pointer > items.length - 1) setPointer(items.length - 1);

    setPointer((prev) => prev - 1);
  };

  const scrollCarousel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.shiftKey) return;

    if (event.deltaY > 0) incPointer();
    else if (event.deltaY < 0) decPointer();
  };

  const left = `calc(50% - ${width / 2}rem - ${pointer * (width / 2 + 4)}rem)`;
  useEffect(() => {
    if (onChange) onChange(pointer);
  }, [onChange, pointer]);

  return (
    <>
      {(isListLayout && (
        <Flex
          flexGrow={1}
          maxH={"50vh"}
          w={"100vw"}
          overflowY={"auto"}
          zIndex={100}
        >
          <Wrap w={"100%"} spacing={"2rem"} justify={"center"}>
            {items.map((item, index) => (
              <React.Fragment key={`carousel-item-${index}`}>
                {renderFront && renderFront(item, index)}
              </React.Fragment>
            ))}
          </Wrap>
        </Flex>
      )) ||
        (!isListLayout && (
          <Flex flexGrow={1} w={"100%"} onWheel={scrollCarousel}>
            <Flex
              position={"relative"}
              alignItems={"center"}
              w={"100%"}
              h={"100%"}
              minH={"520px"}
              maxH="520px"
            >
              <HStack
                as={motion.div}
                position={"absolute"}
                h={"100%"}
                spacing={"4rem"}
                left={left}
                animate={{
                  left: left,
                }}
                transition={"0.5s"}
                zIndex={100}
              >
                {items.map((item, index) => (
                  <CarouselCard
                    key={`carousel-item-${index}`}
                    index={index}
                    currIndex={pointer}
                    front={renderFront && renderFront(item, index)}
                    back={renderBack && renderBack(item, index)}
                    width={width}
                  />
                ))}
              </HStack>
              <IconButton
                aria-label="Previous Item"
                icon={<FaChevronLeft />}
                position={"absolute"}
                bgColor={"transparent"}
                color={"#F6D13A"}
                left={"2rem"}
                zIndex={1001}
                disabled={pointer <= 0}
                onClick={decPointer}
                id="js-previousCarouselCard"
              />
              <IconButton
                aria-label="Next Item"
                icon={<FaChevronRight />}
                bgColor={"transparent"}
                color={"#F6D13A"}
                position={"absolute"}
                right={"2rem"}
                zIndex={1001}
                disabled={pointer >= items.length - 1}
                onClick={incPointer}
                id="js-nextCarouselCard"
              />
            </Flex>
          </Flex>
        ))}
    </>
  );
}
