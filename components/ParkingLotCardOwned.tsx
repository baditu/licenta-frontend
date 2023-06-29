import {
  Box,
  Image,
  VStack,
  Text,
  Button,
  useDisclosure,
  HStack,
  Flex,
  UnorderedList,
  ListItem,
  ListIcon,
  List,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { getTimeTillExpired } from "../lib/helperFunctions";
import { TbParking } from "react-icons/tb";
import { useAccount, useContractWrite } from "wagmi";
import { PARKING_LOT_ABI } from "@/contracts/abis";
import { BigNumber } from "ethers";
import { useState } from "react";
import { useTokensOfOwnerPRKL } from "@/lib/hooks";
import { BaseLotData } from "@/lib/types";
import ListOfAttributes from "./ListOfAttributes";
import Attribute from "./Attribute";

interface ParkingLotCardPropsOwned {
  lot: any;
}

const ParkingLotCardOwned: React.FC<ParkingLotCardPropsOwned> = ({ lot }) => {
  const [toAddress, setToAddress] = useState<string>("");
  const toast = useToast();
  const toastId = "error-toast";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address: account } = useAccount();

  const { refetch: refetchLots } = useTokensOfOwnerPRKL(account!);

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
                alt={`lot number ${lot?.id}`}
                src={`https://ipfs.io/ipfs/${lot.image.split("/")[2]}/`}
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
              <ListOfAttributes attributes={lot.attributes} />
            </Box>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <VStack align={"left"} spacing={"-0.5"}>
              <Text fontSize={"24px"} color={"black"}>
                {lot?.name}
              </Text>
              <Text color={"white"}>Str. Ceahlaul no. 13</Text>
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
          <ModalHeader>{`Transfer your parking lot #${lot?.id}`}</ModalHeader>
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
                onClick={() => onTransferClick(lot?.id)}
                variant={"blackVariant"}
              >
                {isTransferring === true ? <Spinner /> : "Transfer"}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ParkingLotCardOwned;
