import React, { useEffect, useState } from "react";

// Leaflet Map App
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";

// Main functions
import {
  parseGpxFile,
  type PositionType,
  type GpxDataType,
} from "@/utils/mapMainFunctions";

// Map's params
const zoom = 9;
const style = { height: "400px", marginBottom: "20px" };
const mapViewFormatObj = {
  OpenStreetMapMapnik: {
    formatName: "OpenStreetMapMapnik",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  },
};

// MAP DISPLAY COMPONENT
const MapDisplay = ({ packId }: { packId: string }) => {
  // States
  const [gpxData, setGpxData] = useState<PositionType[] | undefined>();
  console.log("DATA: ", gpxData);
  useEffect(() => {
    async function setGpx() {
      const parseGpxData: GpxDataType[] = await parseGpxFile(
        `https://share-your-backpack.s3.eu-west-1.amazonaws.com/${packId}`,
      );

      // Tracks positions
      const trackPositions: PositionType[] = [parseGpxData[0]?.positions];

      if (trackPositions) setGpxData(trackPositions);
    }

    setGpx().catch((err) => console.log("setGpx err: ", err));
  }, []);
  return (
    <>
      {gpxData?.[0]?.[0] && (
        <MapContainer
          center={[gpxData[0][0][0], gpxData[0][0][1]]}
          zoom={zoom}
          style={style}
        >
          return (
          <Polyline
            pathOptions={{ fillColor: "red", color: "#0000ff" }}
            positions={gpxData[0]}
          />
          );
          <TileLayer
            attribution={mapViewFormatObj.OpenStreetMapMapnik.attribution}
            url={mapViewFormatObj.OpenStreetMapMapnik.url}
          />
        </MapContainer>
      )}
    </>
  );
};

export default MapDisplay;
