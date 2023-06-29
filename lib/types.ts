import { BigNumber } from "ethers";

export type LotAttributes = {
  latitude: string;
  longitude: string;
  forDisabledPeople: string;
  smartLot: string;
  isMotorcycle: string;
  isBicycle: string;
};

export type BaseLotData = LotAttributes & {
  id: number;
  name: string;
  image: string;
};

export type ListedLotData = BaseLotData & {
  owner: string;
  price: BigNumber;
  listed: boolean;
};

export type LotsDataFilters = BaseLotData & {
  id: number;
  daysOfPeriod: BigNumber | undefined;
  hoursOfPeriod: BigNumber | undefined;
  price: BigNumber;
  listed: boolean;
};

export type LotForRent = {
  targetId: number;
  borrowed: boolean;
  borrower: string;
  lender: string;
  daysOfPeriod: BigNumber;
  hoursOfPeriod: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  badonsPerPeriod: BigNumber;
};

export type LotDataForRent = BaseLotData & LotForRent;
