const fs = require("fs");
const path = require("path");

const sourcePath = path.resolve("./data/source.json");
const resultPath = path.resolve("./MapMarkersCache.json");

const { IzurviveTransformation } = require("./sdk/izurvive");
const { Coordinate } = require("./sdk/model");

const transformation = IzurviveTransformation.chernarusPlus();

const helicMapItems = [];
const convoyMapItems = [];

fs.promises
  .readFile(sourcePath, { encoding: "utf-8" })
  .then((source) => {
    const data = JSON.parse(source);

    const helicPositions = [];
    const convoyPositions = [];

    data.events[0].types.forEach((event) => {
      if (event.name === "StaticHeliCrash") {
        event.positions.forEach((pos) => {
          helicPositions.push(pos);
        });
      }

      if (event.name === "StaticMilitaryConvoy") {
        event.positions.forEach((pos) => {
          convoyPositions.push(pos);
        });
      }
    });

    helicPositions.forEach((pos, idx) => {
      const coordinate = new Coordinate(pos[0], pos[1]);
      const point = transformation.izurviveCoordinateToDayzPoint(coordinate);

      helicMapItems.push({
        M_MARKER_NAME: `Helic ${idx + 1}`,
        M_ICON_PATH: "dz\\gear\\navigation\\data\\map_broadleaf_ca.paa",
        M_COLOR: [205.0, 53.0, 154.0],
        M_POSITION: [point.x, 0.0, point.y],
        M_ISACTIVE: 1,
        M_IS_3D_ACTIVE: 0,
      });
    });

    convoyPositions.forEach((pos, idx) => {
      const coordinate = new Coordinate(pos[0], pos[1]);
      const point = transformation.izurviveCoordinateToDayzPoint(coordinate);

      convoyMapItems.push({
        M_MARKER_NAME: `Convoy Vanilla ${idx + 1}`,
        M_ICON_PATH: "dz\\gear\\navigation\\data\\map_broadleaf_ca.paa",
        M_COLOR: [235.0, 194.0, 31.0],
        M_POSITION: [point.x, 0.0, point.y],
        M_ISACTIVE: 1,
        M_IS_3D_ACTIVE: 0,
      });
    });

    return fs.promises.readFile(resultPath, { encoding: "utf-8" });
  })
  .then((source) => {
    const data = JSON.parse(source);

    const initialMarkers = [...data["M_MARKER_CACHE_ARRAY"]];

    Object.assign(data, {
      M_MARKER_CACHE_ARRAY: [
        ...initialMarkers,
        ...helicMapItems,
        ...convoyMapItems,
      ],
    });

    return fs.promises.writeFile(resultPath, JSON.stringify(data, null, 4));
  })
  .then();
