import { CheckIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { getTimeTillExpired, reverseGeocode } from "../lib/helperFunctions";
import { TbParking } from "react-icons/tb";
import { useAccount, useContractWrite } from "wagmi";
import { LENDING_MARKET_ABI, PARKING_LOT_ABI } from "@/contracts/abis";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useTokensOfOwnerPRKL } from "@/lib/hooks";
import { LotAttributes, LotDataForRent } from "@/lib/types";
import ListOfAttributes from "./ListOfAttributes";
import ListOfAttributesForRent from "./ListOfAttributesForRent";
import { formatEther } from "ethers/lib/utils.js";

interface ParkingLotCardPropsRent {
  lot: LotDataForRent;
  isForBorrowing: boolean;
}

const ParkingLotCardRent: React.FC<ParkingLotCardPropsRent> = ({
  lot,
  isForBorrowing,
}) => {
  const { address: account } = useAccount();
  const toast = useToast();
  const toastId = "error-toast";
  const [address, setAddress] = useState<string>("");

  const { refetch: refetchMyParkingLots } = useTokensOfOwnerPRKL(account!);
  const { refetch: refetchLotsInLendingMarket } = useTokensOfOwnerPRKL(
    process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`
  );

  const {
    writeAsync: redeemLot,
    isLoading: isRedeeming,
    isError: isErrorAtRedeem,
    isSuccess: isSuccessAtRedeem,
    reset: resetRedeem,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`,
    abi: LENDING_MARKET_ABI,
    functionName: "redeemLot",
    onSuccess: async (data) => {
      await data.wait();
    },
  });

  const {
    writeAsync: cancelLot,
    isLoading: isCancelling,
    isError: isErrorAtCancel,
    isSuccess: isSuccessAtCancel,
    reset: resetCancel,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`,
    abi: LENDING_MARKET_ABI,
    functionName: "cancelLendingLot",
    onSuccess: async (data) => {
      await data.wait();
    },
  });

  const onRedeemClick = async () => {
    try {
      if (redeemLot) {
        await redeemLot({
          recklesslySetUnpreparedArgs: [BigNumber.from(lot.id)],
        });

        await refetchMyParkingLots();
        await refetchLotsInLendingMarket();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCancelClick = async () => {
    try {
      if (cancelLot) {
        await cancelLot({
          recklesslySetUnpreparedArgs: [BigNumber.from(lot.id)],
        });

        await refetchMyParkingLots();
        await refetchLotsInLendingMarket();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isErrorAtRedeem) {
    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        position: "bottom",
        isClosable: true,
        duration: 2000,
        render: () => (
          <Box
            alignItems={"center"}
            p={3}
            bgGradient="linear(to-b, #F6D13A, #D56B2D)"
            rounded="md"
          >
            <Text color="black">
              Something went wrong while redeeming your parking space.
              <br />
              Please try again.
            </Text>
          </Box>
        ),
      });
    }
  }

  if (isErrorAtCancel) {
    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        position: "bottom",
        isClosable: true,
        duration: 2000,
        render: () => (
          <Box
            alignItems={"center"}
            p={3}
            bgGradient="linear(to-b, #F6D13A, #D56B2D)"
            rounded="md"
          >
            <Text color="black">
              Something went wrong while cancelling your parking space.
              <br />
              Please try again.
            </Text>
          </Box>
        ),
      });
    }
  }

  const totalCost = useMemo(() => {
    if (
      lot.badonsPerPeriod !== BigNumber.from(0) ||
      lot.badonsPerPeriod !== undefined
    ) {
      return lot.badonsPerPeriod?.mul(
        BigNumber.from(24)
          .mul(lot.daysOfPeriod ?? 0)
          .add(lot.hoursOfPeriod ?? 0)
      );
    } else {
      return 0;
    }
  }, [lot.badonsPerPeriod, lot.daysOfPeriod, lot.hoursOfPeriod]);

  useEffect(() => {
    reverseGeocode(lot.longitude, lot.latitude)
      .then((address: any) => {
        const cuvinte: string[] = address.split(" ");

        const index_Buc: number = cuvinte.indexOf("Bucharest");

        const rightAddress: string = cuvinte.slice(0, index_Buc + 1).join(" ");

        setAddress(rightAddress);
      })
      .catch((error) => {
        console.error("Eroare:", error);
      });
  }, [lot])

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
              <Box bgColor={"transparent"}>
                <Image
                  mt={0}
                  alt={`lot number ${lot?.id}`}
                  src={`https://ipfs.io/ipfs/${lot.image.split("/")[2]}/`}
                  maxW={"250px"}
                />
              </Box>
              <Icon
                as={TbParking}
                position="absolute"
                top="10%"
                left="7%"
                transform="translate(-50%, -50%)"
                boxSize="50px"
              />
            </Box>
            <VStack>
              <VStack spacing={"-0.5"}>
                <Text
                  fontSize={"20px"}
                  color={"black"}
                  width={"100%"}
                  whiteSpace={"nowrap"}
                  textOverflow={"ellipsis"}
                >
                  Parking time
                </Text>
                <Text fontSize={"19px"} color={"white"}>
                  {lot.borrowed === true
                    ? Number(lot.endTime) * 1000 - Date.now() > 0
                      ? getTimeTillExpired(Number(lot.endTime))
                      : "Expired"
                    : "Not loaned"}
                </Text>
              </VStack>
              <Box
                borderRadius={"16px"}
                alignSelf={"center"}
                boxShadow={"dark-lg"}
              >
                <ListOfAttributesForRent
                  forDisabledPeople={lot.forDisabledPeople}
                  smartLot={lot.smartLot}
                  isMotorcycle={lot.isMotorcycle}
                  isBicycle={lot.isBicycle}
                />
              </Box>
              <HStack spacing={"0"}>
                <Box maxW={"24px"}>
                  <Image alt={"badons-for-rent"} src={"./images/badon.png"} />
                </Box>
                <Text fontSize={"20px"} color={"black"}>
                  {`${Math.trunc(
                    Number(formatEther(totalCost !== undefined ? totalCost : 0))
                  )}`}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          <HStack justifyContent={"space-between"} pr={"8px"}>
            <VStack align={"left"} spacing={"-0.5"}>
              <Text fontSize={"24px"} color={"black"}>
                {`${lot?.name}`}
              </Text>
              {address !== null && (
                <>
                  <Text fontSize={"16"} color={"black"}>
                    {`${address}`}
                  </Text>
                </>
              )}
            </VStack>
            {(isForBorrowing === false && lot.borrowed === true && (
              <>
                <Button onClick={onRedeemClick} variant={"blackVariant"}>
                  {isRedeeming === true ? <Spinner /> : "Redeem"}
                </Button>
              </>
            )) ||
              (isForBorrowing === false && lot.borrowed === false && (
                <>
                  <Button onClick={onCancelClick} variant={"blackVariant"}>
                    {isCancelling === true ? <Spinner /> : "Cancel"}
                  </Button>
                </>
              ))}
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ParkingLotCardRent;
