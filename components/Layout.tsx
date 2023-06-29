import Head from "next/head";
import { Box, Flex } from "@chakra-ui/react";

const Layout = ({ children }: { children: any }) => {
  return (
    <Box minHeight="100vh" position="relative" overflow="hidden">
      <Head>
        <title>Parking Block DApp</title>
        <meta name="description" content="Parking Block DApp" />
        <meta property="og:title" content="Parking Block DApp" />
        <meta property="og:description" content="Parking Block DApp" />
        <meta property="og:image" content="/images/licenta-icon.png" />
        <link rel="icon" href="/images/licenta-icon.png" />
      </Head>
      {children}
    </Box>
  );
};

export default Layout;
