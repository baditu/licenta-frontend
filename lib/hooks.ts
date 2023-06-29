import { ListedLot } from "@/components/ParkingLotCard";
import {
  BADON_ABI,
  LENDING_MARKET_ABI,
  MARKETPLACE_ABI,
  PARKING_LOT_ABI,
  PARKING_LOT_RENT_ABI,
} from "@/contracts/abis";
import { BigNumber } from "ethers";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useContractReads,
} from "wagmi";
import { LotForRent } from "./types";

export const useMyBadonBalance = () => {
  const { address: account } = useAccount();

  const contractData = useContractRead({
    address: process.env.NEXT_PUBLIC_BADON as `0x${string}` | undefined,
    abi: BADON_ABI,
    functionName: "balanceOf",
    args: [account as `0x${string}`],
    enabled: !!account,
  });

  return { ...contractData };
};

export const useMyParkingLotBalance = () => {
  const { address: account } = useAccount();

  const contractData = useContractRead({
    address: process.env.NEXT_PUBLIC_PARKING_LOT as `0x${string}` | undefined,
    abi: PARKING_LOT_ABI,
    functionName: "balanceOf",
    args: [account as `0x${string}`],
    enabled: !!account,
  });

  return { ...contractData };
};

export const useTokensOfOwnerPRKL = (account: `0x${string}`) => {
  const contractData = useContractRead({
    address: process.env.NEXT_PUBLIC_PARKING_LOT as `0x${string}` | undefined,
    abi: PARKING_LOT_ABI,
    functionName: "tokensOfOwner",
    args: [account],
    enabled: !!account,
  });

  return { ...contractData };
};

export const useTokensOfOwnerForRentLots = (account: `0x${string}`) => {
  const contractData = useContractRead({
    address: process.env.NEXT_PUBLIC_PARKING_LOT_RENT as `0x${string}`,
    abi: PARKING_LOT_RENT_ABI,
    functionName: "tokensOfOwner",
    args: [account],
    enabled: !!account,
  });

  return { ...contractData };
};

export const useAllowanceForToken = (spender: `0x${string}`) => {
  const { address: account } = useAccount();
  const contractData = useContractRead({
    address: process.env.NEXT_PUBLIC_BADON as `0x${string}`,
    abi: BADON_ABI,
    functionName: "allowance",
    args: [
      account as `0x${string}`,
      spender
    ],
    enabled: !!account,
  });

  return contractData.data;
};

export const useListedLotsInMarketplace = (
  listedLotId: BigNumber
): ListedLot => {
  const contractData = useContractRead({
    address: process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: "listedLots",
    args: [listedLotId],
  });

  const listedLot = contractData.data as ListedLot;

  return listedLot;
};

export const useLotsInLendingMarket = (lotForRentId: BigNumber): LotForRent => {
  const contractData = useContractRead({
    address: process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`,
    abi: LENDING_MARKET_ABI,
    functionName: "lots",
    args: [lotForRentId],
  });

  const listedLot = contractData.data as LotForRent;

  return listedLot;
};

export const useAllListedLotsInMarketplace = (
  listedLotIds: readonly BigNumber[]
) => {

  const contractData = useContractReads({
    contracts: listedLotIds
      ? listedLotIds.map((lot: BigNumber) => ({
          address: process.env.NEXT_PUBLIC_MARKETPLACE as `0x${string}`,
          abi: MARKETPLACE_ABI,
          functionName: "listedLots",
          args: [lot],
        }))
      : [],
  });

  return { ...contractData };
};


export const useAllLotsInLendingMarket = (lots: readonly BigNumber[]) => {
  const contractData = useContractReads({
    contracts: lots
      ? lots.map((lot: BigNumber) => ({
          address: process.env.NEXT_PUBLIC_LENDING_MARKET as `0x${string}`,
          abi: LENDING_MARKET_ABI,
          functionName: "lots",
          args: [lot],
        }))
      : [],
  });

  return { ...contractData };
};

export const useApproveOfParkingLot = (
  account: `0x${string}`,
  address: `0x${string}`
) => {
  const contractData = useContractRead({
    address: process.env.NEXT_PUBLIC_PARKING_LOT as `0x${string}`,
    abi: PARKING_LOT_ABI,
    functionName: "isApprovedForAll",
    args: [account, address],
  });

  return contractData.data;
};
