// // https://gbank.gsj.jp/seamless/elev/tile.html
// // https://maps.gsi.go.jp/development/hyokochi.html
// const SEEMLESS = "https://tiles.gsj.jp/tiles/elev/mixed/{z}/{y}/{x}.png";
// const DEM5A = "https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png";
// const DEM10B = "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png";
// const DEMGM = "https://cyberjapandata.gsi.go.jp/xyz/demgm_png/{z}/{x}/{y}.png";
// const [elevationData, setElevationData] = useState(DEM10B);
// const autoElevationData = (zoom: number) =>
//   setElevationData("https://tiles.gsj.jp/tiles/elev/gsidem5a/{z}/{y}/{x}.png");
// // setElevationData(zoom >= 13.5 ? DEM5A : zoom >= 7.5 ? DEM10B : DEMGM);

// // case "GsiTerrainLayer":
// //   return new GsiTerrainLayer({
// //     ...item,
// //     // elevationData: elevationData,
// //     // maxZoom: 15.99,
// //   });

// const layersWithSetting = testLayer.map((item: any, index: number) => {
//     const setting = {
//       ...item,
//       updateTriggers: {
//         getFillColor: layers[index]?.getFillColor,
//         // all: layers[index].layerType,
//       },
//       // onDataLoad: (value) => console.log(value),
//     };
