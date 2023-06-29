import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { ComponentConnect } from "@/components/ComponentConnect";
import Layout from "@/components/Layout";
import { Center } from "@chakra-ui/react";
import { NavBar } from "@/components/Navbar";
import MaineMenu from "@/components/MainMenu";
import Background from "@/components/Background";
import { GetStaticPropsContext } from "next";
import { getAllLotsMetadata } from "@/lib/helperFunctions";

export default function Home() {
  return (
    <>
      <Layout>
        <Background />
        <NavBar />
        <MaineMenu />
      </Layout>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      allLotsMetadata: getAllLotsMetadata(),
    },
    revalidate: 30 * 60,
  };
}
