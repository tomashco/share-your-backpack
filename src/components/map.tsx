import React, { useEffect, useState } from "react";

// Leaflet Map App
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";

// Main functions
import { parseGpxFile, type Position } from "@/utils/mapMainFunctions";

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
  const [gpxData, setGpxData] = useState<Position[] | undefined>();

  useEffect(() => {
    async function setGpx() {
      const trackPositions = await parseGpxFile(
        `https://share-your-backpack.s3.eu-west-1.amazonaws.com/${packId}`,
      );

      if (trackPositions && trackPositions.length > 0)
        setGpxData(trackPositions);
    }

    setGpx().catch((err) => console.log("setGpx err: ", err));
  }, [packId]);
  return (
    <>
      {gpxData?.[0] && (
        <MapContainer
          center={[gpxData[0][0], gpxData[0][1]]}
          zoom={zoom}
          style={style}
        >
          return (
          <Polyline
            pathOptions={{ fillColor: "red", color: "#0000ff" }}
            positions={gpxData}
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
