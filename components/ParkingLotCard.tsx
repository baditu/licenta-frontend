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
import { BADON_ABI, MARKETPLACE_ABI, PARKING_LOT_ABI } from "@/contracts/abis";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import {
  useAllowanceForToken,
  useApproveOfParkingLot,
  useListedLotsInMarketplace,
  useMyBadonBalance,
  useTokensOfOwnerPRKL,
} from "@/lib/hooks";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import ListOfAttributes from "./ListOfAttributes";

interface ParkingLotCardProps {
  lot: any;
  isForBuying: boolean | undefined;
}

export type ListedLot = {
  tokenId: number;
  owner: string;
  price: BigNumber;
  listed: boolean;
};

const ParkingLotCard: React.FC<ParkingLotCardProps> = ({
  lot,
  isForBuying,
}) => {
  const [price, setPrice] = useState<string>("");
  const [notEnoughBadons, setNotEnoughBadons] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const toast = useToast();
  const toastId = "error-toast";
  const listedLot: ListedLot = useListedLotsInMarketplace(lot.id);

  const {
    isOpen: isOpenForList,
    onOpen: onOpenForList,
    onClose: onCloseForList,
  } = useDisclosure();
  const { address: account } = useAccount();
  const { data: myBalanceOfBadons } = useMyBadonBalance();
  const allowance = useAllowanceForToken(
    process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`
  );

  const { refetch: refetchLots } = useTokensOfOwnerPRKL(account!);
  const { refetch: refetchLotsInMarket } = useTokensOfOwnerPRKL(
    process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`
  );

  useEffect(() => {
    if (lot && lot.attributes) {
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
  }, [lot]);

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

  const {
    writeAsync: listLot,
    isLoading: isListing,
    isError: isErrorAtList,
    isSuccess: isSuccessAtList,
    reset: resetList,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: "listNFT",
    onSuccess: async (data) => {
      await data.wait();
    },
  });

  const {
    writeAsync: cancelNFT,
    isLoading: isCancelling,
    isError: isErrorAtCancel,
    isSuccess: isSuccessAtCancel,
    reset: resetCancel,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: "cancelNFT",
    onSuccess: async (data) => {
      await data.wait();
    },
  });

  const onCancelClick = async () => {
    try {
      if (cancelNFT) {
        await cancelNFT({
          recklesslySetUnpreparedArgs: [BigNumber.from(lot.id)],
        });

        await refetchLots();
        await refetchLotsInMarket();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onBuyClick = async () => {
    try {
      if (listedLot.price.gt(myBalanceOfBadons ?? 0)) {
        setNotEnoughBadons(true);
        return;
      }

      if (allowance?.lt(listedLot.price ?? 0)) {
        const difAmount = listedLot.price.sub(allowance ?? 0);

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
        await refetchLots();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const isApprovedForAll = useApproveOfParkingLot(
    account as `0x${string}`,
    process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`
  );

  const onListClick = async (lotId: any, price: string) => {
    try {
      if (writeApproveForAll && isApprovedForAll === false) {
        await writeApproveForAll({
          recklesslySetUnpreparedArgs: [
            process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`,
            true,
          ],
        });
      }

      if (listLot) {
        await listLot({
          recklesslySetUnpreparedArgs: [lotId, parseEther(price)],
        });

        await refetchLots();
        await refetchLotsInMarket();
      }
    } catch (error) {
      console.log("error: ", error);
      onCloseForList();
    }
  };


  if (isErrorAtBuy) {
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

  if (isErrorAtList || isErrorAtApproveForAll) {
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
              Something went wrong while listing your parking space.
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

  useEffect(() => {
    setIsLoading(
      isLoadingAtApproveForAll ||
        isLoadingAtApproveForBadon ||
        isBuying ||
        isListing ||
        isCancelling
    );
  }, [
    isLoadingAtApproveForAll,
    isBuying,
    isListing,
    isLoadingAtApproveForBadon,
    isCancelling,
  ]);

  if (
    isForBuying &&
    account?.toLowerCase() === listedLot?.owner?.toLowerCase()
  ) {
    return null;
  } else if (
    isForBuying === undefined &&
    account?.toLowerCase() !== listedLot?.owner?.toLowerCase()
  ) {
    return null;
  } else {
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
                <Box
                  borderRadius={"16px"}
                  alignSelf={"center"}
                  boxShadow={"dark-lg"}
                >
                  <ListOfAttributes attributes={lot.attributes} />
                </Box>
                {isForBuying !== false && (
                  <HStack>
                    <Text fontSize={"20px"} color={"black"}>
                      Price:{" "}
                    </Text>
                    <Text fontSize={"20px"} color={"black"}>
                      {`${Math.trunc(
                        Number(formatEther(listedLot?.price ?? 0))
                      )}`}
                    </Text>
                    <Box maxW={"24px"}>
                      <Image
                        alt={"badons-for-rent"}
                        src={"./images/badon.png"}
                      />
                    </Box>
                  </HStack>
                )}
              </VStack>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <VStack align={"left"} spacing={"-0.5"}>
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
              {(isForBuying === false && (
                <>
                  <Button onClick={onOpenForList} variant={"blackVariant"}>
                    List
                  </Button>
                </>
              )) ||
                (isForBuying === true && (
                  <>
                    <Button onClick={onBuyClick} variant={"blackVariant"}>
                      {isLoading === true ? <Spinner /> : "Buy NFT"}
                    </Button>
                  </>
                )) || (
                  <>
                    <Button onClick={onCancelClick} variant={"blackVariant"}>
                      {isLoading === true ? <Spinner /> : "Cancel"}
                    </Button>
                  </>
                )}
            </HStack>
          </Box>
        </VStack>
        <Modal isOpen={isOpenForList} onClose={onCloseForList}>
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(7px) grayscale(100%)"
          />
          <ModalContent
            bgGradient="linear(to-b, #F6D13A, #D56B2D)"
            borderRadius={"16px"}
          >
            <ModalHeader>{`List your parking lot #${lot?.id}`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="price" isRequired>
                <FormLabel>Price:</FormLabel>
                <Input
                  focusBorderColor={"black"}
                  placeholder="price"
                  value={price}
                  variant={"outline"}
                  onChange={(event) => setPrice(event.target.value)}
                ></Input>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={"1rem"}>
                <Button onClick={onCloseForList} variant={"blackVariant"}>
                  Close
                </Button>
                <Button
                  onClick={() => onListClick(lot?.id, price)}
                  variant={"blackVariant"}
                >
                  {isLoading === true ? <Spinner /> : "List NFT"}
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  }
};

export default ParkingLotCard;
