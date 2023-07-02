import {
  Box,
  HStack,
  Icon,
  Image,
  VStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useLayoutEffect, useState } from "react";
import { TbParking } from "react-icons/tb";

interface SmallCardLotProps {
  item: any;
  buttonFunction: Function;
}

const SmallCardLot: React.FC<SmallCardLotProps> = ({
  item,
  buttonFunction,
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useLayoutEffect(() => {
    function onResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <HStack
        w={`calc(${windowWidth < 1200 ? "70%" : "50%"} - 1rem)`}
        h={"6rem"}
        bgGradient="linear(to-b, #F6D13A, #D56B2D)"
        padding={"1rem"}
        borderRadius={"16px"}
        justifyContent={"space-between"}
      >
        <HStack spacing={"1rem"}>
          <Box position="relative">
            <Image
              mt={0}
              alt={`lot number ${item?.id}`}
              src={`https://ipfs.io/ipfs/${item?.image.split("/")[2]}/`}
              maxW={"150px"}
            />
            <Icon
              as={TbParking}
              position="absolute"
              top="15%"
              left="4%"
              transform="translate(-50%, -50%)"
              boxSize="25px"
            />
          </Box>

          <VStack alignItems={"start"}>
            <Text fontSize={"24px"} color={"black"}>
              ParkingLot #{item?.id}
            </Text>
          </VStack>
        </HStack>

        <Button minW={"80px"} onClick={onOpen} variant={"blackVariant"}>
          Transfer
        </Button>
      </HStack>
      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(7px) grayscale(100%)"
        />
        <ModalContent
          bgGradient="linear(to-b, #F6D13A, #D56B2D)"
          borderRadius={"16px"}
        >
          <ModalHeader>{`Transfer your parking lot #${item?.id}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="address" isRequired>
              <FormLabel>To address:</FormLabel>
              <Input
                focusBorderColor={"black"}
                placeholder="address"
                value={toAddress}
                variant={"outline"}
                onChange={(event) => setToAddress(event.target.value)}
              ></Input>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={"1rem"}>
              <Button onClick={onClose} variant={"blackVariant"}>
                Close
              </Button>
              <Button
                onClick={() => onTransferClick(item?.id)}
                variant={"blackVariant"}
              >
                {isTransferring === true ? <Spinner /> : "Transfer"}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  );
};

export default SmallCardLot;
