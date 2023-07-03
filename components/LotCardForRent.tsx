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
import {
  BADON_ABI,
  LENDING_MARKET_ABI,
  MARKETPLACE_ABI,
  PARKING_LOT_ABI,
} from "@/contracts/abis";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import {
  useAllowanceForToken,
  useApproveOfParkingLot,
  useListedLotsInMarketplace,
  useLotsInLendingMarket,
  useMyBadonBalance,
  useTokensOfOwnerPRKL,
} from "@/lib/hooks";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { LotDataForRent } from "@/lib/types";
import ListOfAttributes from "./ListOfAttributes";
import ListOfAttributesForRent from "./ListOfAttributesForRent";

interface LotCardForRentProps {
  lot: any;
  isForBorrowing: boolean;
}

const LotCardForRent: React.FC<LotCardForRentProps> = ({
  lot,
  isForBorrowing,
}) => {
  const [price, setPrice] = useState<string>("");
  const [periodInDays, setPeriodInDays] = useState<number>(0);
  const [periodInHours, setPeriodInHours] = useState<number>(0);
  const [notEnoughBadons, setNotEnoughBadons] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const toastId = "error-toast";

  useEffect(() => {
    if (lot) {
      if (isForBorrowing == true) {
        reverseGeocode(lot.longitude, lot.latitude) //must be changed with nft loadout
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
      } else {
        reverseGeocode(lot.attributes[1].value, lot.attributes[0].value) //must be changed with nft loadout
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
    }
  }, [isForBorrowing, lot]);

  const {
    isOpen: isOpenForLend,
    onOpen: onOpenForLend,
    onClose: onCloseForLend,
  } = useDisclosure();
  const { address: account } = useAccount();
  const { data: myBalanceOfBadons } = useMyBadonBalance();
  const allowance = useAllowanceForToken(
    process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`
  );

  const { refetch: refetchLots } = useTokensOfOwnerPRKL(account!);
  const { refetch: refetchLotsInLendingMarket } = useTokensOfOwnerPRKL(
    process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`
  );

  const {
    writeAsync: lendLot,
    isLoading: isLending,
    isError: isErrorAtLend,
    isSuccess: isSuccessAtLend,
    reset: resetLend,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`,
    abi: LENDING_MARKET_ABI,
    functionName: "lendLot",
    onSuccess: async (data) => {
      await data.wait();
    },
  });

  const {
    writeAsync: borrowLot,
    isLoading: isBorrowing,
    isError: isErrorAtBorrow,
    isSuccess: isSuccessAtBorrow,
    reset: resetBorrow,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`,
    abi: LENDING_MARKET_ABI,
    functionName: "borrowLot",
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

  const {
    writeAsync: writeApproveForAll,
    isLoading: isLoadingAtApproveForAll,
    isError: isErrorAtApproveForAll,
    reset: resetApproveForAll,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_PARKING_LOT as `0x${string}`,
    abi: PARKING_LOT_ABI,
    functionName: "setApprovalForAll",
    onSuccess: async (data) => {
      await data.wait();
    },
  });

  const totalCost = useMemo(() => {
    if (lot.badonsPerPeriod !== 0 || lot.badonsPerPeriod !== undefined) {
      return lot.badonsPerPeriod?.mul(
        BigNumber.from(24)
          .mul(lot.daysOfPeriod ?? 0)
          .add(lot.hoursOfPeriod ?? 0)
      );
    } else {
      return 0;
    }
  }, [lot.badonsPerPeriod, lot.daysOfPeriod, lot.hoursOfPeriod]);

  const onBorrowClick = async (lotId: number) => {
    try {
      const totalBadons = lot.badonsPerPeriod.mul(
        BigNumber.from(24)
          .mul(lot.daysOfPeriod ?? 0)
          .add(lot.hoursOfPeriod ?? 0)
      );

      if (totalBadons.gt(myBalanceOfBadons ?? 0)) {
        setNotEnoughBadons(true);
        return;
      }

      if (allowance?.lt(totalBadons ?? 0)) {
        const difAmount = totalBadons.sub(allowance ?? 0);

        if (writeApproveForBadon) {
          await writeApproveForBadon({
            recklesslySetUnpreparedArgs: [
              process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`,
              difAmount,
            ],
          });
        }
      }

      if (borrowLot) {
        await borrowLot({
          recklesslySetUnpreparedArgs: [BigNumber.from(lotId)],
        });

        await refetchLotsInLendingMarket();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const isLendingMarketApprovedOnLots = useApproveOfParkingLot(
    account as `0x${string}`,
    process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`
  );

  const onLendClick = async (
    lotId: any,
    price: string,
    periodInDays: number,
    periodInHours: number
  ) => {
    try {
      if (writeApproveForAll && isLendingMarketApprovedOnLots === false) {
        await writeApproveForAll({
          recklesslySetUnpreparedArgs: [
            process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`,
            true,
          ],
        });
      }

      if (lendLot) {
        await lendLot({
          recklesslySetUnpreparedArgs: [
            lotId,
            BigNumber.from(periodInDays),
            BigNumber.from(periodInHours),
            parseEther(price),
          ],
        });

        await refetchLots();
      }
    } catch (error) {
      console.log("error: ", error);
      onCloseForLend();
    }
  };

  if (isErrorAtBorrow || isErrorAtApproveForBadon) {
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
            {(notEnoughBadons === true && (
              <Text color="black">
                You don&apos;t have enough Badons to buy this parking lot.
              </Text>
            )) || (
              <Text color="black">
                Something went wrong while borrowing your parking space.
                <br />
                Please try again.
              </Text>
            )}
          </Box>
        ),
      });
    }
  }

  if (isErrorAtLend || isErrorAtApproveForAll) {
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
              Something went wrong while lending your parking space.
              <br />
              Please try again.
            </Text>
          </Box>
        ),
      });
    }
  }

  useEffect(() => {
    setIsLoading(
      isLoadingAtApproveForAll ||
        isLoadingAtApproveForBadon ||
        isLending ||
        isBorrowing
    );
  }, [
    isLending,
    isLoadingAtApproveForBadon,
    isBorrowing,
    isLoadingAtApproveForAll,
  ]);

  console.log(lot);

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
            <VStack>
              <VStack spacing={"-0.5"}>
                {isForBorrowing == true && (
                  <>
                    <Text
                      fontSize={"20px"}
                      color={"black"}
                      width={"100%"}
                      whiteSpace={"nowrap"}
                      textOverflow={"ellipsis"}
                    >
                      Parking time
                    </Text>
                    <Text
                      whiteSpace={"nowrap"}
                      textOverflow={"ellipsis"}
                      fontSize={"19px"}
                      color={"white"}
                    >
                      {Number(lot.daysOfPeriod) === 0
                        ? Number(lot.hoursOfPeriod) !== 0
                          ? `${Number(lot.hoursOfPeriod)} ${
                              Number(lot.hoursOfPeriod) > 1 ? "hours" : "hour"
                            }`
                          : "-"
                        : Number(lot.hoursOfPeriod) === 0
                        ? `${Number(lot.daysOfPeriod)} ${
                            Number(lot.daysOfPeriod) > 1 ? "days" : "day"
                          }`
                        : `${Number(lot.daysOfPeriod)} ${
                            Number(lot.daysOfPeriod) > 1 ? "days" : "day"
                          } ${Number(lot.hoursOfPeriod)} ${
                            Number(lot.hoursOfPeriod) > 1 ? "hours" : "hour"
                          }`}
                    </Text>
                  </>
                )}
              </VStack>
              <Box
                borderRadius={"16px"}
                alignSelf={"center"}
                boxShadow={"dark-lg"}
              >
                {(isForBorrowing === true && (
                  <>
                    <ListOfAttributesForRent
                      forDisabledPeople={lot.forDisabledPeople}
                      smartLot={lot.smartLot}
                      isMotorcycle={lot.isMotorcycle}
                      isBicycle={lot.isBicycle}
                    />
                  </>
                )) || (
                  <>
                    <ListOfAttributes attributes={lot.attributes} />
                  </>
                )}
              </Box>
              {isForBorrowing === true && (
                <>
                  <VStack>
                    <HStack spacing={"0"}>
                      <Box maxW={"24px"}>
                        <Image
                          alt={"badons-for-rent"}
                          src={"./images/badon.png"}
                        />
                      </Box>
                      <Text fontSize={"20px"} color={"black"}>
                        {`${Math.trunc(
                          Number(
                            formatEther(totalCost !== undefined ? totalCost : 0)
                          )
                        )}`}
                      </Text>
                    </HStack>
                  </VStack>
                </>
              )}
            </VStack>
          </HStack>
          <HStack justifyContent={"space-between"} pr={"10px"}>
            <VStack alignItems={"flex-start"}>
              <Text fontSize={"24px"} color={"black"}>
                {lot?.name}
              </Text>
              {address !== null && (
                <>
                  <Text fontSize={"16"} color={"black"}>
                    {`${address}`}
                  </Text>
                </>
              )}
            </VStack>
            {(isForBorrowing === false && (
              <>
                <Button onClick={onOpenForLend} variant={"blackVariant"}>
                  Lend
                </Button>
              </>
            )) || (
              <>
                <Button
                  onClick={() => onBorrowClick(lot.id)}
                  variant={"blackVariant"}
                >
                  {isLoading === true ? <Spinner /> : "Borrow"}
                </Button>
              </>
            )}
          </HStack>
        </Box>
      </VStack>
      <Modal isOpen={isOpenForLend} onClose={onCloseForLend}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(7px) grayscale(100%)"
        />
        <ModalContent
          bgGradient="linear(to-b, #F6D13A, #D56B2D)"
          borderRadius={"16px"}
        >
          <ModalHeader>{`Lend your parking lot #${lot?.id}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <FormControl id="price" isRequired>
                <FormLabel>
                  Price: (notice that is the price per hour)
                </FormLabel>
                <Input
                  focusBorderColor={"black"}
                  placeholder="price"
                  value={price}
                  variant={"outline"}
                  onChange={(event) => setPrice(event.target.value)}
                ></Input>
              </FormControl>
              <FormControl id="period in hours" isRequired>
                <FormLabel>{"Period (in hours):"}</FormLabel>
                <Input
                  focusBorderColor={"black"}
                  placeholder="period in hours"
                  value={periodInHours}
                  variant={"outline"}
                  onChange={(event) =>
                    setPeriodInHours(Number(event.target.value))
                  }
                ></Input>
              </FormControl>
              <FormControl id="period in days" isRequired>
                <FormLabel>{"Period (in days)"}</FormLabel>
                <Input
                  focusBorderColor={"black"}
                  placeholder="period in days"
                  value={periodInDays}
                  variant={"outline"}
                  onChange={(event) =>
                    setPeriodInDays(Number(event.target.value))
                  }
                ></Input>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={"1rem"}>
              <Button onClick={onCloseForLend} variant={"blackVariant"}>
                Close
              </Button>
              <Button
                onClick={() =>
                  onLendClick(lot?.id, price, periodInDays, periodInHours)
                }
                variant={"blackVariant"}
              >
                {isLoading === true ? <Spinner /> : "Lend NFT"}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LotCardForRent;
