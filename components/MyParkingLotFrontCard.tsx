import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  VStack,
  Text,
  Button,
  Flex,
  HStack,
  Image,
  useToast,
  useDisclosure,
  Box,
  Icon,
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
} from "@chakra-ui/react";
import { getTimeTillExpired, reverseGeocode } from "../lib/helperFunctions";
import { useRouter } from "next/router";
import { useAccount, useContractWrite } from "wagmi";
import { useTokensOfOwnerPRKL } from "@/lib/hooks";
import { PARKING_LOT_ABI } from "@/contracts/abis";
import ListOfAttributes from "./ListOfAttributes";
import { TbParking } from "react-icons/tb";

interface MyParkingLotFrontCardProps {
  item: any;
  isListLayout: boolean;
}

const MyParkingLotFrontCard: React.FC<MyParkingLotFrontCardProps> = ({
  item,
  isListLayout,
}) => {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [toAddress, setToAddress] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const toast = useToast();
  const toastId = "error-toast";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address: account } = useAccount();

  const { refetch: refetchLots } = useTokensOfOwnerPRKL(account!);

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

  useEffect(() => {
    if (item && item.attributes) {
      reverseGeocode(item.attributes[1].value, item.attributes[0].value) //must be changed with nft loadout
        .then((address: any) => {
          const cuvinte: string[] = address.split(" ");

          const index_Buc: number = cuvinte.indexOf("Bucharest");

          const rightAddress: string = cuvinte
            .slice(0, index_Buc + 1)
            .join(" ");

          setAddress(rightAddress);
        })
        .catch((error) => {
          console.error("Eroare:", error);
        });
    }
  }, [item]);

  const {
    writeAsync: transferLot,
    isLoading: isTransferring,
    isError: isErrorAtTransfer,
    isSuccess: isSuccessAtTransfer,
    reset: resetTransfer,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_PARKING_LOT as `0x${string}`,
    abi: PARKING_LOT_ABI,
    functionName: "safeTransferFrom",
    onSuccess: async (data) => {
      await data.wait();
    },
  });

  const onTransferClick = async (lotId: any) => {
    try {
      if (transferLot) {
        await transferLot({
          recklesslySetUnpreparedArgs: [
            account! as `0x${string}`,
            toAddress! as `0x${string}`,
            lotId,
          ],
        });

        await refetchLots();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  if (isErrorAtTransfer) {
    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        position: "bottom",
        isClosable: true,
        duration: 3000,
        render: () => (
          <Box
            alignItems={"center"}
            p={3}
            bgGradient="linear(to-b, #F6D13A, #D56B2D)"
            rounded="md"
          >
            <Text color="black">
              Something went wrong while transferring your parking space.
              <br />
              Please try again.
            </Text>
          </Box>
        ),
      });
    }
  }

  return (
    <>
      {(isListLayout && (
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
          <Modal isOpen={isOpen} onClose={onClose}>
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
          </Modal>
        </>
      )) ||
        (!isListLayout && (
          <Box borderRadius={"16px"} w={`calc(100% - 2rem)`}>
            <VStack borderRadius={"16px"} spacing={"1rem"}>
              <Box
                bgGradient="linear(to-b, #F6D13A, #D56B2D)"
                borderRadius={"16px"}
                padding={"1rem"}
              >
                <HStack>
                  <Box position="relative">
                    <Image
                      mt={0}
                      alt={`lot number ${item?.id}`}
                      src={`https://ipfs.io/ipfs/${item?.image.split("/")[2]}/`}
                      maxW={"250px"}
                    />
                    <Icon
                      as={TbParking}
                      position="absolute"
                      top="10%"
                      left="7%"
                      transform="translate(-50%, -50%)"
                      boxSize="50px"
                    />
                  </Box>
                  <Box
                    borderRadius={"16px"}
                    alignSelf={"center"}
                    boxShadow={"dark-lg"}
                  >
                    <ListOfAttributes attributes={item?.attributes} />
                  </Box>
                </HStack>
                <HStack justifyContent={"space-between"}>
                  <VStack align={"left"} spacing={"-0.5"}>
                    <Text fontSize={"24px"} color={"black"}>
                      {item?.name}
                    </Text>
                    {address !== null && (
                      <>
                        <Text fontSize={"16"} color={"black"}>
                          {`${address}`}
                        </Text>
                      </>
                    )}
                  </VStack>
                  <Button onClick={onOpen} variant={"blackVariant"}>
                    Transfer
                  </Button>
                </HStack>
              </Box>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
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
            </Modal>
          </Box>
        ))}
    </>
  );
};

export default MyParkingLotFrontCard;
