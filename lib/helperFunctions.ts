import fs from "fs";
import path from "path";
import keyBy from "lodash/keyBy";
import axios from "axios";

export const getTimeTillExpired = (period: number) => {
  const countdown = new Date(period * 1000 - Date.now());

  const daysDate = countdown.getUTCDate() - 1;

  const hoursDate = countdown.getUTCHours();

  const minutesDate = countdown.getUTCMinutes();
  const secondsDate = countdown.getUTCMinutes();

  return daysDate > 0
    ? `${daysDate > 9 ? daysDate : "0".concat(daysDate.toString())}:${
        hoursDate > 9 ? hoursDate : "0".concat(hoursDate.toString())
      }:${minutesDate > 9 ? minutesDate : "0".concat(minutesDate.toString())}`
    : hoursDate > 0
    ? `00:${hoursDate > 9 ? hoursDate : "0".concat(hoursDate.toString())}:${
        minutesDate > 9 ? minutesDate : "0".concat(minutesDate.toString())
      }`
    : `00:00:${
        minutesDate > 9 ? minutesDate : "0".concat(minutesDate.toString())
      }`;
};

export function getAllLotsMetadata() {
  let str = fs.readFileSync(
    path.join(process.cwd(), `/data/metadata/final.json`),
    "utf8"
  );

  str = str.replace(/^\ufeff/g, "");
  return keyBy(JSON.parse(str)["Standard Metadata"], "id");
}

export const getSortedLots = (filteredLots: any, filterRequest: any) => {
  if (filterRequest === "PriceHighestLowest") {
    return filteredLots.sort(function (a: any, b: any) {
      return b.price.sub(a.price);
    });
  } else if (filterRequest === "PriceLowestHighest") {
    return filteredLots.sort(function (a: any, b: any) {
      return a.price.sub(b.price);
    });
  } else if (filterRequest === "PeriodHighestLowest") {
    return filteredLots.sort(function (a: any, b: any) {
      return (
        Number(b.daysOfPeriod ?? 0) * 24 +
        Number(b.hoursOfPeriod ?? 0) -
        (Number(a.daysOfPeriod ?? 0) * 24 + Number(a.hoursOfPeriod ?? 0))
      );
    });
  } else if (filterRequest === "PeriodLowestHighest") {
    return filteredLots.sort(function (a: any, b: any) {
      return (
        Number(a.daysOfPeriod ?? 0) * 24 +
        Number(a.hoursOfPeriod ?? 0) -
        (Number(b.daysOfPeriod ?? 0) * 24 + Number(b.hoursOfPeriod ?? 0))
      );
    });
  }
};

export const reverseGeocode = async (long: string, lat: string) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${
    process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN as string
  }`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    const address = data.features[0].place_name;
    return address as string;
  } catch (error) {
    console.error("Eroare:", error);
    return null;
  }
};

export const getGeocode = async (address: string) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN as string}`;

  try {
    const response = await axios.get(url);

    if (
      response &&
      response.data &&
      response.data.features &&
      response.data.features.length > 0
    ) {
      const [longitude, latitude] = response.data.features[0].center;

      return [longitude, latitude];
    }

    throw new Error("No results found.");
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    throw error;
  }
};

export const areCoordinatesNearby = (
  coordinatesToCheck: number[],
  targetCoordinates: number[],
  distanceThreshold: number
): boolean => {
  const distance = calculateDistance(coordinatesToCheck, targetCoordinates);
  if (distance <= distanceThreshold) {
    return true;
  }

  return false;
};

const calculateDistance = (coord1: number[], coord2: number[]): number => {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371; // Earth's radius in kilometers
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const degToRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
