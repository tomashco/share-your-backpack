import axios, { type AxiosResponse } from "axios";
import GpxParser from "gpxparser";

export type Position = [number,number]

// Parse gpx file
export async function parseGpxFile(gpxXmlFile: string): Promise<Position[] |undefined> {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return new Promise(async (resolve) => {
    try {
      await axios
        .get(gpxXmlFile)
        .then((response: AxiosResponse<string, unknown>) => {
          
          const gpxParsed = new GpxParser();

          gpxParsed.parse(response.data);

      const trackPositions: Position[] | undefined  = gpxParsed.tracks[0]?.points.map((el):Position => [el.lat, el.lon])
              resolve(trackPositions);

        }).catch(err => console.log(err))
  }
  catch(error) {
    console.error(":( parseGpxFile error");
  }
})
}