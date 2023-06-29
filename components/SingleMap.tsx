import { Box, Text } from "@chakra-ui/react";
import { Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { MapboxMarker } from "react-map-gl/dist/esm/types";

interface SingleMapProp {}

const SingleMap: React.FC<SingleMapProp> = ({}) => {
  const [map, setMap] = useState<Map | null>();
  const mapNode = useRef(null);

  useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    const myMap = new Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN as string,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [26.04884492428791, 44.45568784752788], //need to change that with lot.latitude and lot.longitude
      zoom: 14,
      scrollZoom: false,
      minZoom: 5,
      maxZoom: 20,
    });

    setMap(myMap);

    return () => {
      myMap.remove();
    };
  }, []);

  return <Box zIndex={100} ref={mapNode} width={"100%"} height={"80%"}></Box>;
};

export default SingleMap;
