const fs = require("fs");
const path = require("path");

const resultPath = path.resolve("./MapMarkersCache.json");

fs.promises
  .readFile(resultPath, { encoding: "utf-8" })
  .then((source) => {
    const data = JSON.parse(source);

    const initialMarkers = [...data["M_MARKER_CACHE_ARRAY"]].filter((item) => {
      const markerName = item["M_MARKER_NAME"];
      return (
        !markerName.includes("Helic") && !markerName.includes("Convoy Vanilla")
      );
    });

    console.log(initialMarkers);

    Object.assign(data, {
      M_MARKER_CACHE_ARRAY: initialMarkers,
    });

    return fs.promises.writeFile(resultPath, JSON.stringify(data, null, 4));
  })
  .then();
