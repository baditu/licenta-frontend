import Background from "@/components/Background";
import Layout from "@/components/Layout";
import { NavBar } from "@/components/Navbar";
import { getAllLotsMetadata } from "@/lib/helperFunctions";
import { useTokensOfOwnerPRKL } from "@/lib/hooks";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { BsCurrencyDollar } from "react-icons/bs";
import { GrOverview } from "react-icons/gr";
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
import { PARKING_LOT_ABI } from "@/contracts/abis";
import ClientOnly from "../lib/clientOnly";

const MarketPlace = (props: any) => {
  const [userWantToBuy, setUserWantToBuy] = useState<boolean | undefined>(
    false
  );
  const { address: account } = useAccount();
  const router = useRouter();

  // =========== FUNCTIONS FOR FETCH DATA FOR LOTS ===========

  //my parking lots - for sell (metadata)

  const { data: myParkingLots, isLoading: isLoadingParkingLots } =
    useTokensOfOwnerPRKL(account!);
  const myParkingLotsIds = myParkingLots?.map((lot: any) => lot.toNumber());

  const myParkingLotsMetadata = useMemo(
    () =>
      (myParkingLotsIds ?? []).reduce((lots: any, lotId: number) => {
        lots = [...lots, props.allLotsMetadata?.[lotId]];
        return lots;
      }, []),
    [myParkingLotsIds, props.allLotsMetadata]
  );

  // parking lots in market - for buy (metadata)
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

  //my parking lots in market - for view (metadata)

  // =========== CAN FETCH FUNCTIONS ===========

  const canFetchLotsInMarketplace = useMemo(
    () =>
      !isLoadingParkingLotsInMarketplace &&
      parkingLotsInMarketplace &&
      parkingLotsInMarketplace.length > 0,
    [isLoadingParkingLotsInMarketplace, parkingLotsInMarketplace]
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
          onClick={() => setUserWantToBuy(false)}
        >
          Sell
        </Button>
        <Button
          color={"black"}
          backgroundColor={"#F6D13A"}
          _hover={{ bg: "#f5d556" }}
          leftIcon={<BsCurrencyDollar />}
          onClick={() => setUserWantToBuy(true)}
        >
          Buy
        </Button>
        <Button
          color={"black"}
          backgroundColor={"#F6D13A"}
          _hover={{ bg: "#f5d556" }}
          leftIcon={<GrOverview />}
          onClick={() => setUserWantToBuy(undefined)}
        >
          My listed lots
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
              {(userWantToBuy === false &&
                canFetchParkingLots &&
                myParkingLotsMetadata &&
                myParkingLotsMetadata.map((lot: any, index: number) => {
                  return (
                    <WrapItem key={index}>
                      <ParkingLotCard isForBuying={false} lot={lot} />
                    </WrapItem>
                  );
                })) ||
                (userWantToBuy === true &&
                  canFetchLotsInMarketplace &&
                  parkingLotsInMarketplaceMetadata &&
                  parkingLotsInMarketplaceMetadata.map(
                    (lot: any, index: number) => {
                      return (
                        <WrapItem key={index}>
                          <ParkingLotCard isForBuying={true} lot={lot} />
                        </WrapItem>
                      );
                    }
                  )) ||
                (userWantToBuy === undefined &&
                  canFetchLotsInMarketplace &&
                  parkingLotsInMarketplaceMetadata &&
                  parkingLotsInMarketplaceMetadata.map(
                    (lot: any, index: number) => {
                      return (
                        <WrapItem key={index}>
                          <ParkingLotCard isForBuying={undefined} lot={lot} />
                        </WrapItem>
                      );
                    }
                  ))}
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

export default MarketPlace;
