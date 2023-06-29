import Background from "@/components/Background";
import Layout from "@/components/Layout";
import { NavBar } from "@/components/Navbar";
import { getAllLotsMetadata } from "@/lib/helperFunctions";
import { useAllLotsInLendingMarket, useTokensOfOwnerPRKL } from "@/lib/hooks";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { BsCurrencyDollar } from "react-icons/bs";
import {
  Box,
  Image,
  VStack,
  Text,
  Button,
  Flex,
  HStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import ParkingLotCard from "@/components/ParkingLotCard";
import LotCardForRent from "@/components/LotCardForRent";
import ClientOnly from "../lib/clientOnly";
import { BaseLotData, LotDataForRent } from "@/lib/types";

const RentalSchema = (props: any) => {
  const [userWantToBorrow, setUserWantToBorrow] = useState<boolean>(false);
  const { address: account } = useAccount();
  const router = useRouter();

  // =========== FUNCTIONS FOR FETCH DATA FOR LOTS ===========

  // fetch all my parking lots data
  const { data: myParkingLots, isLoading: isLoadingParkingLots } =
    useTokensOfOwnerPRKL(account!);

  const myParkingLotsIds = myParkingLots?.map((lot: any) => lot.toNumber());

  const myParkingLotsMetadata: any[] = useMemo(
    () =>
      (myParkingLotsIds ?? []).reduce((lots: any, lotId: number) => {
        lots = [...lots, props.allLotsMetadata?.[lotId]];
        return lots;
      }, []),
    [myParkingLotsIds, props.allLotsMetadata]
  );

  // fetch data for all lots for borrow => all lots in lending market
  const {
    data: parkingLotsInLendingMarket,
    isLoading: isLoadingParkingLotsInLendingMarket,
  } = useTokensOfOwnerPRKL(
    process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`
  );

  const parkingLotsIds = parkingLotsInLendingMarket?.map((lot: any) =>
    lot.toNumber()
  );

  const parkingLotsInLendingMarketplaceMetadata: BaseLotData[] = useMemo(
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
    }
    (parkingLotsInLendingMarketplaceMetadata ?? []).map((lotMetadata: any) => {
      const lotInfo = lotsDataInLendingMarket?.find(
        (lot: any) => lot?.targetId?.toString() === lotMetadata?.id?.toString()
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

  // =========== CAN FETCH FUNCTIONS ===========

  const canFetchLotsInLendingMarket = useMemo(
    () =>
      !isLoadingParkingLotsInLendingMarket &&
      parkingLotsInLendingMarket &&
      parkingLotsInLendingMarket.length > 0,
    [isLoadingParkingLotsInLendingMarket, parkingLotsInLendingMarket]
  );

  const canFetchParkingLots = useMemo(
    () => !isLoadingParkingLots && myParkingLots && myParkingLots.length > 0,
    [isLoadingParkingLots, myParkingLots]
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
        <Button
          color={"black"}
          backgroundColor={"#F6D13A"}
          _hover={{ bg: "#f5d556" }}
          leftIcon={<BsCurrencyDollar />}
          onClick={() => setUserWantToBorrow(false)}
        >
          Loaned out
        </Button>
        <Button
          color={"black"}
          backgroundColor={"#F6D13A"}
          _hover={{ bg: "#f5d556" }}
          leftIcon={<BsCurrencyDollar />}
          onClick={() => setUserWantToBorrow(true)}
        >
          Borrow
        </Button>
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
          h={"60vh"}
          w={"80%"}
          mt={"5px"}
          pt={8}
          pb={8}
          overflow={"hidden"}
          overflowY={"auto"}
          borderRadius={"32px"}
        >
          <ClientOnly>
            <Wrap spacing={"1.5rem"} justify={"center"}>
              {(userWantToBorrow === false &&
                canFetchParkingLots &&
                myParkingLotsMetadata &&
                myParkingLotsMetadata.map((lot: any, index: number) => {
                  return (
                    <WrapItem key={index}>
                      <LotCardForRent lot={lot} isForBorrowing={false} />
                    </WrapItem>
                  );
                })) ||
                (userWantToBorrow === true &&
                  canFetchLotsInLendingMarket &&
                  filteredDataLots &&
                  filteredDataLots.map((lot: LotDataForRent, index: number) => {
                    return (
                      <WrapItem key={index}>
                        <LotCardForRent lot={lot} isForBorrowing={true} />
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

export default RentalSchema;
