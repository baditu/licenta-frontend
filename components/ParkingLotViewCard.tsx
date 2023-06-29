import { BADON_ABI, MARKETPLACE_ABI } from "@/contracts/abis";
import { reverseGeocode } from "@/lib/helperFunctions";
import {
  useAllowanceForToken,
  useMyBadonBalance,
  useTokensOfOwnerPRKL,
} from "@/lib/hooks";
import { LotsDataFilters } from "@/lib/types";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  Icon,
  HStack,
  List,
  ListItem,
  ListIcon,
  VStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils.js";
import React, { useEffect, useState } from "react";
import { TbParking } from "react-icons/tb";
import { useAccount, useContractWrite } from "wagmi";
import ListOfAttributes from "./ListOfAttributes";
import ListOfAttributesForRent from "./ListOfAttributesForRent";

interface ParkingLotViewCardProps {
  lot: LotsDataFilters;
}

const ParkingLotViewCard: React.FC<ParkingLotViewCardProps> = ({ lot }) => {
  const [isForSell, setIsForSell] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notEnoughBadons, setNotEnoughBadons] = useState<boolean>(false);
  const toast = useToast();
  const toastId = "error-toast";

  const { address: account } = useAccount();
  const { data: myBalanceOfBadons, refetch: refetchBadons } =
    useMyBadonBalance();
  const allowance = useAllowanceForToken(
    process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`
  );
  const { refetch: refetchLotsInMarket } = useTokensOfOwnerPRKL(
    process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`
  );

  const {
    writeAsync: buyLot,
    isLoading: isBuying,
    isError: isErrorAtBuy,
    isSuccess: isSuccessAtBuy,
    reset: resetBuy,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: "buyNFT",
    onSuccess: async (data) => {
      await data.wait();
    },
  });

  const {
    writeAsync: writeApproveForBadon,
    isLoading: isLoadingAtApproveForBadon,
    isError: isErrorAtApproveForBadon,
    reset: resetApproveForBadon,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_BADON as `0x${string}`,
    abi: BADON_ABI,
    functionName: "approve",
    onSuccess: async (data) => {
      await data.wait();
    },
  });

  const onBuyClick = async () => {
    if (lot.listed === true) {
      try {
        if (lot.price.gt(myBalanceOfBadons ?? 0)) {
          setNotEnoughBadons(true);
          return;
        }

        if (allowance?.lt(lot.price ?? 0)) {
          const difAmount = lot.price.sub(allowance ?? 0);

          if (writeApproveForBadon) {
            await writeApproveForBadon({
              recklesslySetUnpreparedArgs: [
                process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`,
                difAmount,
              ],
            });
          }
        }

        if (buyLot) {
          await buyLot({
            recklesslySetUnpreparedArgs: [lot.id],
          });

          await refetchLotsInMarket();
          await refetchBadons();
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  if (isErrorAtBuy) {
    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        position: "bottom",
        isClosable: true,
        duration: 1000,
        render: () => (
          <Box
            alignItems={"center"}
            p={3}
            bgGradient="linear(to-b, #F6D13A, #D56B2D)"
            rounded="md"
          >
            {(notEnoughBadons === true && (
              <Text color="black">
                You don&apos;t have enough Badons to buy this parking lot.
              </Text>
            )) || (
              <Text color="black">
                Something went wrong while buying your parking space.
                <br />
                Please try again.
              </Text>
            )}
          </Box>
        ),
      });
    }
  }

  useEffect(() => {
    setIsForSell(lot.listed);
  }, [lot.listed]);

  useEffect(() => {
    reverseGeocode("26.050242", "44.454618") //must be changed with nft loadout
      .then((address: any) => {
        setAddress(address);
      })
      .catch((error) => {
        console.error("Eroare:", error);
      });
  }, [lot]);

  useEffect(() => {
    setIsLoading(isLoadingAtApproveForBadon || isBuying);
  }, [isBuying, isLoadingAtApproveForBadon]);

  return (
    <Card
      bgGradient="linear(to-b, #F6D13A, #D56B2D)"
      borderRadius={"16px"}
      borderColor={"black"}
      padding={"0.5rem"}
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      maxH={"250px"}
      maxW={"600px"}
    >
      <CardHeader w={"65%"}>
        <HStack flexDirection={"column"} alignItems={"flex-start"}>
          <Box position="relative">
            <Box bgColor={"transparent"}>
              <Image
                mt={0}
                alt={`lot number ${lot?.id}`}
                src={`https://ipfs.io/ipfs/${lot.image.split("/")[2]}/`}
                maxW={"200px"}
              />
            </Box>
            <Icon
              as={TbParking}
              position="absolute"
              top="7%"
              left="7%"
              transform="translate(-50%, -50%)"
              boxSize="40px"
            />
          </Box>
          {(isForSell && (
            <>
              <VStack alignItems={"flex-start"}>
                <HStack spacing={"1"}>
                  <Text fontSize={"20px"} color={"black"}>
                    {`PRICE: ${Math.trunc(Number(formatEther(lot.price)))}`}
                  </Text>
                  <Box maxW={"24px"}>
                    <Image alt={"badons-for-rent"} src={"./images/badon.png"} />
                  </Box>
                </HStack>
                {address !== null && (
                  <>
                    <Text fontSize={"16"} color={"black"}>
                      {`${address}`}
                    </Text>
                  </>
                )}
              </VStack>
            </>
          )) || (
            <>
              <VStack spacing={"-1"} alignItems={"flex-start"}>
                <HStack spacing={"1"}>
                  <Text fontSize={"16px"} color={"black"}>
                    {`PRICE: ${Math.trunc(Number(formatEther(lot.price)))}`}
                  </Text>
                  <Box maxW={"24px"}>
                    <Image alt={"badons-for-rent"} src={"./images/badon.png"} />
                  </Box>
                </HStack>
                <HStack>
                  <Text fontSize={"16px"} color={"black"}>
                    {"Period: "}
                  </Text>
                  <Text fontSize={"16px"} color={"black"}>
                    {Number(lot.daysOfPeriod ?? 0) > 0
                      ? `${lot.daysOfPeriod} ${
                          Number(lot.daysOfPeriod ?? 0) > 1 ? "days" : "day"
                        }`
                      : ""}
                  </Text>
                  <Text fontSize={"16px"} color={"black"}>
                    {Number(lot.hoursOfPeriod ?? 0) > 0
                      ? `${lot.hoursOfPeriod} ${
                          Number(lot.hoursOfPeriod ?? 0) > 1 ? "hours" : "hour"
                        }`
                      : ""}
                  </Text>
                </HStack>
                {address !== null && (
                  <>
                    <Text fontSize={"16"} color={"black"}>
                      {`${address}`}
                    </Text>
                  </>
                )}
              </VStack>
            </>
          )}
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack>
          <VStack>
            <Heading size="md">{`${lot.name}`}</Heading>
            <List bgColor={"black"} borderRadius={"16px"} padding={"1rem"}>
              <ListItem
                width={"100%"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
                fontSize={"12px"}
                color={"#F6D13A"}
              >
                <ListIcon
                  as={lot.forDisabledPeople === "true" ? CheckIcon : CloseIcon}
                />
                Disabled people
              </ListItem>
              <ListItem
                width={"100%"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
                fontSize={"12px"}
                color={"#F6D13A"}
              >
                <ListIcon
                  as={lot.smartLot === "true" ? CheckIcon : CloseIcon}
                  color="black.500"
                />
                For smart car
              </ListItem>
              <ListItem
                width={"100%"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
                fontSize={"12px"}
                color={"#F6D13A"}
              >
                <ListIcon
                  as={lot.isMotorcycle === "true" ? CheckIcon : CloseIcon}
                />
                Motorcycle
              </ListItem>
              <ListItem
                width={"100%"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
                fontSize={"12px"}
                color={"#F6D13A"}
              >
                <ListIcon
                  as={lot.isBicycle === "true" ? CheckIcon : CloseIcon}
                  color="black.500"
                />
                Bicycle
              </ListItem>
            </List>
          </VStack>

          {(isForSell && (
            <>
              <Button onClick={onBuyClick} variant={"blackVariant"}>
                {isLoading === true ? <Spinner /> : "Buy NFT"}
              </Button>
            </>
          )) || (
            <>
              <Button variant={"blackVariant"}>Borrow</Button>
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ParkingLotViewCard;
