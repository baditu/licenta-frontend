import Layout from "@/components/Layout";
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
