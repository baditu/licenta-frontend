import { getGeocode, reverseGeocode } from "@/lib/helperFunctions";
import { Box, Text, Input } from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils.js";
import mapboxgl, { LngLat } from "mapbox-gl";
import { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { AddressAutofill } from "@mapbox/search-js-react";
import SearchInput from "./SearchInput";

interface MapProps {
  listedLots: any;
  selectedLot: any;
  setSelectedLot: Function;
}

const MyMap: React.FC<MapProps> = ({
  listedLots,
  selectedLot,
  setSelectedLot,
}) => {
  const [map, setMap] = useState<Map | null>();
  const [value, setValue] = useState<string>("");
  const [coordinates, setCoordinates] = useState<number[] | null>(null);

  const coordForLots: number[][] = [
    [26.048777762367735, 44.45515159566261],
    [26.048992, 44.454817],
    [26.04809, 44.456479],
    [26.04609, 44.456379],
  ];

  const mapNode = useRef(null);

  useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    const myMap = new Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN as string,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [26.04884492428791, 44.45568784752788], //lng, lat
      zoom: 15,
      minZoom: 5,
      maxZoom: 20,
    });

    setMap(myMap);

    return () => {
      myMap.remove();
    };
  }, []);

  let popup: any;
  (listedLots ?? []).map((lot: any, index: number) => {
    //we must change the coordonates for nfts

    popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(
      `<h3>${lot.name}</h3><p>Price: ${Math.trunc(
        Number(formatEther(lot.price))
      )}</p>`
    );

    popup.on("open", () => {
      setSelectedLot(lot);
    });

    popup.on("close", () => {});

    new mapboxgl.Marker({ color: "#F6D13A", scale: 0.7 })
      .setLngLat([coordForLots?.[index]?.[0], coordForLots?.[index]?.[1]]) //must be changed with the coordonates of the nft
      .setPopup(popup)
      .addTo(map!);
  });

  useEffect(() => {
    if (map && coordinates !== null) {
      map.flyTo({
        center: coordinates as [number, number],
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
    }
  });

  return (
    <>
      <Box pb={"1rem"}>
        <SearchInput
          coordinates={coordinates}
          setCoordinates={setCoordinates}
        />
      </Box>
      <Box zIndex={100} ref={mapNode} width={"100%"} height={"72%"}></Box>
    </>
  );
};

export default MyMap;
