import { useMyBadonBalance } from "@/lib/hooks";
import { HStack, Image, Box, VStack, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import FlipCoin from "./FlipCoin";

export const ComponentConnect = () => {
  const { data: badons } = useMyBadonBalance();
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  
  const myBalanceOfBadons =
    typeof window !== "undefined" && badons !== undefined ? badons : 0;

  return (
    <VStack alignItems={"flex-end"}>
      <ConnectButton showBalance={false} />;
      <HStack spacing={"1rem"}>
        <Text suppressHydrationWarning fontSize={"24px"}>
          {account && chain?.id === 80001
            ? Math.trunc(Number(formatEther(myBalanceOfBadons!)))
            : ""}
        </Text>
        <Box maxW={"32px"}>
          <FlipCoin />
        </Box>
      </HStack>
    </VStack>
  );
};
