import axios, { type AxiosResponse } from "axios";

type Position = [number,number,number]
export type PositionType = Position[] | undefined

export type GpxDataType = {
  id: number,
  name: string,
  positions: PositionType | undefined
}

// Parse gpx file
export async function parseGpxFile(gpxXmlFile: string): Promise<GpxDataType[]> {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return new Promise(async (resolve) => {
    try {
      await axios
        .get(gpxXmlFile)
        .then((response: AxiosResponse<string, unknown>) => {
          
          // Gpx file string
          let gpxStr = response.data;

          // Count lat & lon
          const trkCount = gpxStr.match(/<trk>/g)?.length;

          // While loop params
          let i = 0;
          const resultArray = [];

          if(trkCount)
            while (i < trkCount) {
              // Number of total characters
              const totalGpxStr = gpxStr.length;

              // Slice str to each <trk></trk> segment
              const trkPosition = gpxStr.indexOf("<trk>");
              const trkLastPosition = gpxStr.indexOf("</trk>") + "</trk>".length;
              const trkStr = gpxStr.substring(trkPosition, trkLastPosition);

              // If <trk></trk> is existing
              if (trkPosition > 0) {
                // Redefine the native string
                gpxStr = gpxStr.substring(trkLastPosition, totalGpxStr);

                resultArray.push(trkStr);
              }

              // Incrementation
              i++;
            }

          // Foreach loop params
          const resultArrObj = [];

          // Get all latitudes and longitudes data for each track
          for (let f = 0; f < resultArray.length; f++) {
            // Variables params
            let track = resultArray[f] ?? '';

            // Track's name
            const namePosition = track.indexOf("<name>") + ("<name>".length);
            const nameLastPosition = track.indexOf("</name>");
            const trackName = track.substring(
              namePosition,
              nameLastPosition
            );

            // Params
            let n = 0;
            const arr = [];

            // Count lat & lon
            const latLonCount = track.match(/lat=/g)?.length ?? 0;

            while (n < latLonCount) {
              // Number of total characters
              const totalStr = track.length;

              // Selection of string
              const selectedStrPosition = track.indexOf("<trkpt");
              const selectedStrLastPosition = track.indexOf("</trkpt>");
              const selectedStr = track.substring(
                selectedStrPosition,
                selectedStrLastPosition
              );

              // Get elevations
              const selectedElevationStrPosition =
                track.indexOf("<ele>") + "<ele>".length;
              const selectedElevationStrLastPosition = track.indexOf("</ele>");
              const selectedElevationsStr = track.substring(
                selectedElevationStrPosition,
                selectedElevationStrLastPosition
              );
              const eleValue = parseFloat(selectedElevationsStr);

              // Get latitude and longitude between double quotes from the string
              const reg = new RegExp(/"(.*?)"/g); // Double quotes included
              const matches = selectedStr.match(reg) ?? '';
              const matchesArr = [];

              // Record matches
              for (const match of matches) {
                // Match convert to number format
                const v = parseFloat(match.replace(/['"]+/g, ""));

                // Record
                matchesArr.push(v);
              }

              // Latitude value
              const latValue = matchesArr[0];

              // Longitude value
              const lonValue = matchesArr[1];

              // If <trkpt></trkpt> is existing
              if (selectedStrPosition > 0) {
                // Redefine the native string
                track = track.substring(selectedStrLastPosition + 5, totalStr);

                // Record
                arr.push([latValue, lonValue, eleValue]);
              }

              // Incrementation
              n++;

              // While loop end
              if (n === latLonCount) {
                // Remove duplicated values
                const stringArray = arr.map(el => JSON.stringify(el));
                const uniqueStringArray = new Set(stringArray);
                const uniqueArray = Array.from(uniqueStringArray).map((el) => JSON.parse(el) as Position)

                // Result object
                const obj = {
                  id: f,
                  name: trackName,
                  positions: uniqueArray,
                };

                // Record
                resultArrObj.push(obj);
              }
            }

            // For loop end
            if (f + 1 === resultArray.length) {
              resolve(resultArrObj);
            }
          }
        }).catch(err => console.log(err))
  }
  catch(error) {
    console.error(":( parseGpxFile error");
  }
})
}