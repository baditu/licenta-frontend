import Background from "@/components/Background";
import Layout from "@/components/Layout";
import { NavBar } from "@/components/Navbar";
import ParkingLotCardOwned from "@/components/ParkingLotCardOwned";
import { getAllLotsMetadata } from "@/lib/helperFunctions";
import {
  useTokensOfOwnerForRentLots,
  useTokensOfOwnerPRKL,
  useAllLotsInLendingMarket,
  useListedLotsInMarketplace,
} from "@/lib/hooks";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FaListUl } from "react-icons/fa";
import {
  Box,
  Image,
  VStack,
  Text,
  Button,
  Flex,
  Tab,
  Tabs,
  TabList,
  Wrap,
  Spinner,
  WrapItem,
  HStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { v4 as uuidv4 } from "uuid";
import { BsListUl, BsFillGridFill } from "react-icons/bs";
import MyParkingLotBackCard from "../components/MyParkingLotBackCard";
import MyParkingLotFrontCard from "../components/MyParkingLotFrontCard";
import Carousel from "@/components/Carousel";
import CarouselCard from "@/components/CarouselCard";
import ClientOnly from "../lib/clientOnly";
import LotCardForRent from "@/components/LotCardForRent";
import { BaseLotData, LotDataForRent } from "@/lib/types";
import ParkingLotCardRent from "@/components/ParkingLotCardRent";
import { TbLayoutDistributeHorizontal } from "react-icons/tb";

const MyParkintLots = (props: any) => {
  const [isShownForBorrow, setIsShownForBorrow] = useState<boolean | undefined>(
    undefined
  );
  const [isListLayout, setIsListLayout] = useState<boolean>(false);
  const [selectedLot, setSelectedLot] = useState<any>();
  const router = useRouter();
  const { address: account } = useAccount();

  const [carouselCanBe, setCarouselCanBe] = useMediaQuery("(max-width: 650px)");

  // =========== FUNCTIONS FOR FETCH DATA FOR LOTS ===========

  // fetch all my parking lots owned (metadata)
  const { data: myParkingLots, isLoading: isLoadingParkingLots } =
    useTokensOfOwnerPRKL(account!);

  const myParkingLotsIds = myParkingLots?.map((lot: any) => lot.toNumber());

  const myParkingLotsMetadata: BaseLotData[] = useMemo(
    () =>
      (myParkingLotsIds ?? []).reduce((lots: any, lotId: number) => {
        lots = [...lots, props.allLotsMetadata?.[lotId]];
        return lots;
      }, []),
    [myParkingLotsIds, props.allLotsMetadata]
  );

  // fetch all my loaned out parking lots (metadata + lend info)
  const {
    data: parkingLotsInLendingMarket,
    isLoading: isLoadingParkingLotsInLendingMarket,
  } = useTokensOfOwnerPRKL(
    process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`
  );

  const parkingLotsIds = parkingLotsInLendingMarket?.map((lot: any) =>
    lot.toNumber()
  );

  const parkingLotsInLendingMarketplaceMetadata: any[] = useMemo(
    () =>
      (parkingLotsIds ?? []).reduce((lots: any, lotId: number) => {
        lots = [...lots, props.allLotsMetadata?.[lotId]];
        return lots;
      }, []),
    [parkingLotsIds, props.allLotsMetadata]
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
      (parkingLotsInLendingMarketplaceMetadata ?? []).map(
        (lotMetadata: any) => {
          const lotInfo = lotsDataInLendingMarket?.find(
            (lot: any) =>
              lot?.targetId?.toString() === lotMetadata?.id?.toString()
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
        }
      );
    }

    return array;
  }, [
    isLoadingLotsDataInLendingMarket,
    isLoadingParkingLotsInLendingMarket,
    lotsDataInLendingMarket,
    parkingLotsInLendingMarketplaceMetadata,
  ]);

  const filteredDataLots = dataForLotsInLendingMarket.filter(
    (lot: LotDataForRent) => lot.lender.toLowerCase() === account?.toLowerCase()
  );

  //fetch all my borrowed parking lots (metadata + borrow info)
  const {
    data: myParkingLotsBorrowed,
    isLoading: isLoadingParkingLotsBorrowed,
  } = useTokensOfOwnerForRentLots(account!);

  const myBorrowedLotIds = myParkingLotsBorrowed?.map((lot: any) =>
    lot.toNumber()
  );

  const myBorrowedLotsMetadata: BaseLotData[] = useMemo(
    () =>
      (myBorrowedLotIds ?? []).reduce((lots: any, lotId: number) => {
        lots = [...lots, props.allLotsMetadata?.[lotId]];
        return lots;
      }, []),
    [myBorrowedLotIds, props.allLotsMetadata]
  );

  const myBorrowedLots = dataForLotsInLendingMarket.filter(
    (lot: LotDataForRent) =>
      lot.borrower.toLowerCase() === account?.toLowerCase()
  );

  // =========== CAN FETCH FUNCTIONS ===========

  const canFetchParkingLots = useMemo(
    () => !isLoadingParkingLots && myParkingLots && myParkingLots.length > 0,
    [isLoadingParkingLots, myParkingLots]
  );

  const canFetchMyLoanedOutLots = useMemo(
    () =>
      !isLoadingParkingLotsInLendingMarket &&
      !isLoadingLotsDataInLendingMarket &&
      parkingLotsInLendingMarket,
    [
      isLoadingLotsDataInLendingMarket,
      isLoadingParkingLotsInLendingMarket,
      parkingLotsInLendingMarket,
    ]
  );

  const canFetchBorrowedParkingLots = useMemo(
    () =>
      !isLoadingParkingLotsBorrowed &&
      myParkingLotsBorrowed &&
      myParkingLotsBorrowed.length > 0,
    [isLoadingParkingLotsBorrowed, myParkingLotsBorrowed]
  );

  return (
    <Layout>
      <Background />
      <NavBar />
      <HStack padding={"2rem"}>
        <Button
          color={"black"}
          backgroundColor={"#F6D13A"}
          _hover={{ bg: "#f5d556" }}
          leftIcon={<ArrowBackIcon />}
          onClick={() => router.push("/")}
        >
          Back
        </Button>
        {isShownForBorrow === undefined && (
          <Button
            color={"black"}
            backgroundColor={isListLayout ? "#f7e28d" : "#F6D13A"}
            _hover={{ bg: "#f5d556" }}
            leftIcon={
              isListLayout ? <TbLayoutDistributeHorizontal /> : <FaListUl />
            }
            onClick={() => setIsListLayout(!isListLayout)}
          >
            Layout
          </Button>
        )}
      </HStack>

      <Flex
        justifyContent="center"
        alignItems="flex-start"
        height="100vh"
        position="relative"
        zIndex={"100"}
      >
        <Box
          bg={"blackAlpha.900"}
          opacity={"0.9!important"}
          h={"60vh"}
          w={"80%"}
          mt={"5px"}
          pt={8}
          pb={8}
          overflowX={"hidden"}
          overflowY={isShownForBorrow === undefined ? isListLayout ? "auto" : "hidden" : "scroll"}
        >
          <Tabs variant="enclosed" isLazy>
            <TabList
              color={"#f5d556"}
              m={"20px auto"}
              maxW={["360px", "600px"]}
              display={"flex"}
              justifyContent={"center"}
              flexWrap={"wrap"}
            >
              <Tab
                fontSize={["10px", "14px"]}
                _focus={{ boxShadow: "none", color: "#D56B2D" }}
                onClick={() => setIsShownForBorrow(undefined)}
                textColor={"#f5d556"}
              >
                Owned Parking Spaces
              </Tab>
              <Tab
                fontSize={["10px", "14px"]}
                _focus={{ boxShadow: "none", color: "#D56B2D" }}
                onClick={() => setIsShownForBorrow(false)}
                textColor={"#f5d556"}
              >
                Loaned Out Parking Spaces
              </Tab>
              <Tab
                fontSize={["10px", "14px"]}
                _focus={{ boxShadow: "none", color: "#D56B2D" }}
                onClick={() => setIsShownForBorrow(true)}
                textColor={"#f5d556"}
              >
                Borrowed Parking Spaces
              </Tab>
            </TabList>
          </Tabs>
          <ClientOnly>
            {isShownForBorrow === undefined &&
              canFetchParkingLots &&
              myParkingLotsMetadata && (
                <>
                  <VStack w={"100%"} h={"100%"} spacing={"1rem"}>
                    <Carousel<BaseLotData>
                      items={myParkingLotsMetadata}
                      isListLayout={isListLayout}
                      renderFront={(item) => (
                        <MyParkingLotFrontCard
                          item={item}
                          isListLayout={isListLayout}
                        />
                      )}
                      renderBack={(item) => (
                        <MyParkingLotBackCard item={item} />
                      )}
                      onChange={(index) =>
                        setSelectedLot(myParkingLotsMetadata[index])
                      }
                    />
                  </VStack>
                </>
              )}
            <Wrap spacing={"1.5rem"} justify={"center"}>
              {(isShownForBorrow === false &&
                canFetchMyLoanedOutLots &&
                filteredDataLots &&
                filteredDataLots.map((lot: any, index: number) => {
                  return (
                    <WrapItem key={index}>
                      <ParkingLotCardRent lot={lot} isForBorrowing={false} />
                    </WrapItem>
                  );
                })) ||
                (isShownForBorrow === true &&
                  canFetchBorrowedParkingLots &&
                  myBorrowedLots &&
                  myBorrowedLots.map((lot: any, index: number) => {
                    return (
                      <WrapItem key={index}>
                        <ParkingLotCardRent lot={lot} isForBorrowing={true} />
                      </WrapItem>
                    );
                  }))}
            </Wrap>
          </ClientOnly>
        </Box>
      </Flex>
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

export default MyParkintLots;
