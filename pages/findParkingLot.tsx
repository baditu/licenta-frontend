import Background from "@/components/Background";
import Layout from "@/components/Layout";
import { NavBar } from "@/components/Navbar";
import {
  Box,
  Image,
  VStack,
  Text,
  Button,
  Flex,
  WrapItem,
  Wrap,
  HStack,
  Input,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import MyMap from "@/components/Map";
import ClientOnly from "@/lib/clientOnly";
import { useEffect, useMemo, useState } from "react";
import {
  useAllListedLotsInMarketplace,
  useAllLotsInLendingMarket,
  useTokensOfOwnerPRKL,
} from "@/lib/hooks";
import { getAllLotsMetadata, getSortedLots } from "@/lib/helperFunctions";
import { GetStaticPropsContext } from "next";
import {
  BaseLotData,
  ListedLotData,
  LotDataForRent,
  LotsDataFilters,
} from "@/lib/types";
import ParkingLotCard from "@/components/ParkingLotCard";
import LotCardForRent from "@/components/LotCardForRent";
import SearchInput from "@/components/SearchInput";
import { MdFilterList } from "react-icons/md";
import Filters from "@/components/Filters";
import { useUserContext } from "@/context/UserContext";
import { BigNumber } from "ethers";
import ParkingLotViewCard from "@/components/ParkingLotViewCard";
import { formatEther } from "ethers/lib/utils.js";
import { DeleteIcon } from "@chakra-ui/icons";

const FindParkingLot = (props: any) => {
  const router = useRouter();
  const { address: account } = useAccount();
  const { state: userState, dispatch } = useUserContext();
  const [filtersState, setFiltersState] = useState<any>(userState?.filters);
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let filterIsSet = false; //used to change the icon for filters to inform user that filtes are set

  if (
    userState.filters.attributes.forBicycle !== false ||
    userState.filters.attributes.forDisabledPeople !== false ||
    userState.filters.attributes.forSmartCar !== false ||
    userState.filters.attributes.forMotorcycle !== false ||
    userState.filters.purpose.forBuy !== false ||
    userState.filters.purpose.forBorrow !== false ||
    userState.filters.sortBy !== "PriceLowestHighest" ||
    userState.filters.price !== 0 ||
    userState.filters.periodInDays !== 0 ||
    userState.filters.periodInHours !== 0 ||
    userState.filters.rule !== "more"
  ) {
    filterIsSet = true;
  } else {
    filterIsSet = false;
  }

  const handleSetFiltersClick = () => {
    dispatch({
      type: "SET_FILTERS",
      payload: filtersState,
    });
    onClose();
  };

  const handleResetFiltersClick = () => {
    dispatch({
      type: "SET_FILTERS",
      payload: {
        attributes: {
          forDisabledPeople: false,
          forSmartCar: false,
          forBicycle: false,
          forMotorcycle: false,
        },
        purpose: {
          forBuy: false,
          forBorrow: false,
        },
        sortBy: "PriceLowestHighest",
        price: 0,
        periodInDays: 0,
        periodInHours: 0,
        rule: "more",
      },
    });

    setFiltersState({
      attributes: {
        forDisabledPeople: false,
        forSmartCar: false,
        forBicycle: false,
        forMotorcycle: false,
      },
      purpose: {
        forBuy: false,
        forBorrow: false,
      },
      sortBy: "PriceLowestHighest",
      price: 0,
      periodInDays: 0,
      periodInHours: 0,
      rule: "more",
    });

    onClose();
  };

  useEffect(() => {
    setFiltersState(userState?.filters);
  }, [userState]);

  // === get all the lots in marketplace
  const {
    data: parkingLotsInMarketplace,
    isLoading: isLoadingParkingLotsInMarketplace,
  } = useTokensOfOwnerPRKL(
    process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`
  );

  const parkingLotsIds = parkingLotsInMarketplace?.map((lot: any) =>
    lot.toNumber()
  );

  const parkingLotsInMarketplaceMetadata = useMemo(
    () =>
      (parkingLotsIds ?? []).reduce((lots: any, lotId: number) => {
        lots = [...lots, props.allLotsMetadata?.[lotId]];
        return lots;
      }, []),
    [parkingLotsIds, props.allLotsMetadata]
  );

  const {
    data: lotsDataInMarketplace,
    isLoading: isLoadingLotsDataInMarketplace,
  } = useAllListedLotsInMarketplace(parkingLotsInMarketplace!);

  const dataForLotsInMarketplace: ListedLotData[] = useMemo(() => {
    const array: ListedLotData[] = [];

    if (!isLoadingParkingLotsInMarketplace && !isLoadingLotsDataInMarketplace) {
    }
    (parkingLotsInMarketplaceMetadata ?? []).map((lotMetadata: any) => {
      const lotInfo = lotsDataInMarketplace?.find(
        (lot: any) => lot?.tokenId.toString() === lotMetadata.id.toString()
      ) as ListedLotData;

      if (lotInfo !== undefined) {
        array.push({
          id: lotMetadata.id,
          name: lotMetadata.name,
          image: lotMetadata.image,
          latitude: lotMetadata.attributes[0].value,
          longitude: lotMetadata.attributes[1].value,
          forDisabledPeople: lotMetadata.attributes[2].value,
          smartLot: lotMetadata.attributes[3].value,
          isMotorcycle: lotMetadata.attributes[4].value,
          isBicycle: lotMetadata.attributes[5].value,
          owner: lotInfo.owner,
          price: lotInfo.price,
          listed: lotInfo.listed,
        });
      }
    });

    return array;
  }, [
    isLoadingLotsDataInMarketplace,
    isLoadingParkingLotsInMarketplace,
    lotsDataInMarketplace,
    parkingLotsInMarketplaceMetadata,
  ]);

  const filteredDataLotsInMarket = dataForLotsInMarketplace.filter(
    (lot: ListedLotData) => lot.owner.toLowerCase() !== account?.toLowerCase()
  );

  // === get all the lots in lendingmarket ===

  const {
    data: parkingLotsInLendingMarket,
    isLoading: isLoadingParkingLotsInLendingMarket,
  } = useTokensOfOwnerPRKL(
    process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`
  );

  const parkingLotsIdsLending = parkingLotsInLendingMarket?.map((lot: any) =>
    lot.toNumber()
  );

  const parkingLotsInLendingMarketplaceMetadata: BaseLotData[] = useMemo(
    () =>
      (parkingLotsIdsLending ?? []).reduce((lots: any, lotId: number) => {
        lots = [...lots, props.allLotsMetadata?.[lotId]];
        return lots;
      }, []),
    [parkingLotsIdsLending, props.allLotsMetadata]
  );

  const {
    data: lotsDataInLendingMarket,
    isLoading: isLoadingLotsDataInLendingMarket,
  } = useAllLotsInLendingMarket(parkingLotsInLendingMarket!);

  const dataForLotsInLendingMarket: LotDataForRent[] = useMemo(() => {
    const array: LotDataForRent[] = [];

    if (
      !isLoadingParkingLotsInLendingMarket &&
      !isLoadingLotsDataInLendingMarket
    ) {
    }
    (parkingLotsInLendingMarketplaceMetadata ?? []).map((lotMetadata: any) => {
      const lotInfo = lotsDataInLendingMarket?.find(
        (lot: any) => lot?.targetId.toString() === lotMetadata.id.toString()
      ) as LotDataForRent;

      if (lotInfo !== undefined) {
        array.push({
          id: lotMetadata.id,
          name: lotMetadata.name,
          image: lotMetadata.image,
          latitude: lotMetadata.attributes[0].value,
          longitude: lotMetadata.attributes[1].value,
          forDisabledPeople: lotMetadata.attributes[2].value,
          smartLot: lotMetadata.attributes[3].value,
          isMotorcycle: lotMetadata.attributes[4].value,
          isBicycle: lotMetadata.attributes[5].value,
          borrowed: lotInfo.borrowed,
          borrower: lotInfo.borrower,
          lender: lotInfo.lender,
          daysOfPeriod: lotInfo.daysOfPeriod,
          hoursOfPeriod: lotInfo.hoursOfPeriod,
          startTime: lotInfo.startTime,
          endTime: lotInfo.endTime,
          badonsPerPeriod: lotInfo.badonsPerPeriod,
          targetId: lotMetadata.id,
        });
      }
    });

    return array;
  }, [
    isLoadingLotsDataInLendingMarket,
    isLoadingParkingLotsInLendingMarket,
    lotsDataInLendingMarket,
    parkingLotsInLendingMarketplaceMetadata,
  ]);

  const filteredDataLots = dataForLotsInLendingMarket.filter(
    (lot: LotDataForRent) =>
      lot.borrowed === false &&
      lot.lender.toLowerCase() !== account?.toLowerCase()
  );

  // === CAN FETCH FUNCTION ===
  const canFetchLotsInMarketplace = useMemo(
    () =>
      !isLoadingParkingLotsInMarketplace &&
      parkingLotsInMarketplace &&
      parkingLotsInMarketplace.length > 0,
    [isLoadingParkingLotsInMarketplace, parkingLotsInMarketplace]
  );

  const canFetchLotsInLendingMarket = useMemo(
    () =>
      !isLoadingParkingLotsInLendingMarket &&
      parkingLotsInLendingMarket &&
      parkingLotsInLendingMarket.length > 0,
    [isLoadingParkingLotsInLendingMarket, parkingLotsInLendingMarket]
  );

  // create an object with all parking lots (for buy and for borrow)
  const currentLots = useMemo(() => {
    const array: LotsDataFilters[] = [];

    if (canFetchLotsInLendingMarket && canFetchLotsInMarketplace) {
      (filteredDataLots ?? []).map((lotForRent: any) => {
        array.push({
          id: lotForRent.id,
          name: lotForRent.name,
          image: lotForRent.image,
          latitude: lotForRent.latitude,
          longitude: lotForRent.longitude,
          forDisabledPeople: lotForRent.forDisabledPeople,
          smartLot: lotForRent.smartLot,
          isMotorcycle: lotForRent.isMotorcycle,
          isBicycle: lotForRent.isBicycle,
          price: lotForRent.badonsPerPeriod.mul(
            BigNumber.from(24)
              .mul(lotForRent.daysOfPeriod ?? 0)
              .add(lotForRent.hoursOfPeriod ?? 0)
          ),
          daysOfPeriod: lotForRent.daysOfPeriod,
          hoursOfPeriod: lotForRent.hoursOfPeriod,
          listed: false,
        });
      });

      (filteredDataLotsInMarket ?? []).map((lotForBuy: any) => {
        array.push({
          id: lotForBuy.id,
          name: lotForBuy.name,
          image: lotForBuy.image,
          latitude: lotForBuy.latitude,
          longitude: lotForBuy.longitude,
          forDisabledPeople: lotForBuy.forDisabledPeople,
          smartLot: lotForBuy.smartLot,
          isMotorcycle: lotForBuy.isMotorcycle,
          isBicycle: lotForBuy.isBicycle,
          price: lotForBuy.price,
          daysOfPeriod: undefined,
          hoursOfPeriod: undefined,
          listed: lotForBuy.listed,
        });
      });
    }

    return array;
  }, [
    canFetchLotsInLendingMarket,
    canFetchLotsInMarketplace,
    filteredDataLots,
    filteredDataLotsInMarket,
  ]);

  const filteredParkingLots = useMemo(() => {
    const lots = (currentLots ?? []).filter((parkingLot: any) => {
      if (!parkingLot) {
        return null;
      } else {
        if (
          Object.values(filtersState.attributes).some(
            (val: any) => val === true
          ) ||
          Object.values(filtersState.purpose).some((val: any) => val === true)
        ) {
          if (
            filtersState.attributes.forDisabledPeople.toString() === "true" &&
            parkingLot.forDisabledPeople.toString() === "false"
          ) {
            return null;
          }

          if (
            filtersState.attributes.forBicycle.toString() === "true" &&
            parkingLot.isBicycle.toString() === "false"
          ) {
            return null;
          }

          if (
            filtersState.attributes.forMotorcycle.toString() === "true" &&
            parkingLot.isMotorcycle.toString() === "false"
          ) {
            return null;
          }

          if (
            filtersState.attributes.forSmartCar.toString() === "true" &&
            parkingLot.smartLot.toString() === "false"
          ) {
            return null;
          }

          if (
            filtersState.purpose.forBuy.toString() === "true" &&
            parkingLot.listed.toString() === "false"
          ) {
            return null;
          }

          if (
            filtersState.purpose.forBorrow.toString() === "true" &&
            parkingLot.listed.toString() === "true"
          ) {
            return null;
          }

          if (
            Math.trunc(Number(formatEther(parkingLot.price))) >
            Number(filtersState.price)
          ) {
            return null;
          }

          if (filtersState.purpose.forBorrow === true) {
            const totalPeriodInHours =
              Number(parkingLot.daysOfPeriod ?? 0) * 24 +
              Number(parkingLot.hoursOfPeriod ?? 0);

            const totalPeriodInHoursFromUser = (filtersState.periodInDays * 24 +
              filtersState.periodInHours) as number;

            if (
              filtersState.rule === "exact" &&
              totalPeriodInHours !== totalPeriodInHoursFromUser
            ) {
              return null;
            }

            if (
              filtersState.rule === "less" &&
              totalPeriodInHours > totalPeriodInHoursFromUser
            ) {
              return null;
            }

            if (
              filtersState.rule === "more" &&
              totalPeriodInHours < totalPeriodInHoursFromUser
            ) {
              return null;
            }
          }

          return parkingLot;
        } else {
          return parkingLot;
        }
      }
    });

    return lots;
  }, [
    currentLots,
    filtersState.attributes,
    filtersState.periodInDays,
    filtersState.periodInHours,
    filtersState.price,
    filtersState.purpose,
    filtersState.rule,
  ]);

  let sortedParkingLots = filteredParkingLots;

  if (filtersState.sortBy) {
    sortedParkingLots = getSortedLots(filteredParkingLots, filtersState.sortBy);
  }

  return (
    <Layout>
      <Background />
      <NavBar />
      <Box overflow={"hidden"} className="findParkingLot" padding={"2rem"}>
        <HStack justifyContent={"space-between"}>
          <HStack>
            <Button
              color={"black"}
              backgroundColor={"#F6D13A"}
              _hover={{ bg: "#f5d556" }}
              leftIcon={<ArrowBackIcon />}
              onClick={() => router.push("/")}
            >
              Back
            </Button>
            <Button
              color={"black"}
              backgroundColor={"#F6D13A"}
              _hover={{ bg: "#f5d556" }}
              leftIcon={<DeleteIcon />}
              onClick={() => setSelectedLot(null)}
            >
              Reset
            </Button>
          </HStack>

          <HStack>
            {/* <SearchInput /> */}
            <Button
              color={"black"}
              backgroundColor={"#F6D13A"}
              _hover={{ bg: "#f5d556" }}
              leftIcon={<MdFilterList />}
              onClick={onOpen}
            >
              Filters
            </Button>
          </HStack>
        </HStack>

        <Flex
          justifyContent="center"
          alignItems="flex-start"
          height="100%"
          position="relative"
          zIndex={"100"}
        >
          <Box
            bg={"blackAlpha.900"}
            opacity={"0.9!important"}
            h={"80vh"}
            w={"100%"}
            mt={"5px"}
            overflow={"hidden"}
          >
            <ClientOnly>
              <Flex h={"100vh"} flexDir={"row"}>
                <Box h={"100vh"} w={"40%"} m={"1rem"}>
                  <ClientOnly>
                    <Wrap justify={"center"} overflowY={"scroll"} h={"80vh"}>
                      {(selectedLot !== null && (
                        <>
                          <ParkingLotViewCard lot={selectedLot} />
                        </>
                      )) ||
                        (canFetchLotsInLendingMarket &&
                          canFetchLotsInMarketplace &&
                          (sortedParkingLots ?? []).map(
                            (lot: LotsDataFilters, index: number) => {
                              if (!lot) return;

                              return (
                                <WrapItem key={index}>
                                  <ParkingLotViewCard lot={lot} />
                                </WrapItem>
                              );
                            }
                          ))}
                    </Wrap>
                  </ClientOnly>
                </Box>
                <Box w={"60%"} padding={"1rem"}>
                  <MyMap
                    selectedLot={selectedLot}
                    setSelectedLot={setSelectedLot}
                    listedLots={sortedParkingLots}
                  />
                </Box>
              </Flex>
            </ClientOnly>
          </Box>
        </Flex>
      </Box>
      <Drawer size={"sm"} isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bgGradient="linear(to-b, #F6D13A, #D56B2D)">
          <DrawerCloseButton />
          <VStack alignItems={"flex-start"} spacing={"-4"}>
            <DrawerHeader fontSize={"32px"}>Filter & Sort</DrawerHeader>
            <Divider
              border={"1px solid"}
              w={"80%"}
              borderColor={"blackAlpha.900"}
            />
          </VStack>
          <DrawerBody overflowX={"hidden"} overflowY={"hidden"}>
            <Filters onChangeCallback={setFiltersState} />
          </DrawerBody>

          <DrawerFooter>
            <Button
              onClick={handleResetFiltersClick}
              variant={"blackVariant"}
              mr={3}
            >
              Clear all
            </Button>
            <Button onClick={handleSetFiltersClick} variant={"blackVariant"}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      allLotsMetadata: getAllLotsMetadata(),
    },
    revalidate: 30 * 60,
  };
}

export default FindParkingLot;
