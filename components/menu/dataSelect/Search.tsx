// const [filterWord, setFilterWord] = useState("");
// const [isSearchVisible, setIsSearchVisible] = useState(false);
// const [expanded, setExpanded] = useState([]);
// const handleToggle = (event, nodeIds: string[]) => {
//   setExpanded(nodeIds);
// };
// const filterChildren = (list) =>
//   list.filter(
//     (d) =>
//       d.title.includes(filterWord) ||
//       (d.entries && filterChildren(d.entries).length)
//   );

// const filterdLayer = layerList
//   .map((d) => {
//     const filterdCildren = d.entries ? filterChildren(d.entries) : [];
//     return (
//       (d.title.includes(filterWord) && d) ||
//       (filterdCildren.length > 0 && { ...d, entries: filterdCildren })
//     );
//   })
//   .filter(Boolean); //配列からnullの削除

// const getNodeId = (list) =>
//   list
//     .flatMap((d, index) => {
//       const key = d.category + d.title + index;
//       const isMatch = d.title.includes(filterWord);
//       return d.entries && isMatch
//         ? key
//         : d.entries && !isMatch && [key, ...getNodeId(d.entries)];
//     })
//     .filter(Boolean);

// const [nodeId, setNodeId] = useState(
//   filterWord === "" ? [] : getNodeId(filterdLayer)
// );
// const newNodeId = filterWord === "" ? [] : getNodeId(filterdLayer);

// const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   setFilterWord(event.target.value);
//   setExpanded(nodeId);
// };

// //サーチボタン
// <IconButton
//   size="small"
//   onClick={() => {
//     setIsSearchVisible((prev) => !prev);
//     setFilterWord("");
//   }}
// >
//   {<SearchIcon />}
// </IconButton>;
// {
//   isSearchVisible && (
//     <TextField
//       autoFocus
//       onChange={handleChange}
//       value={filterWord}
//       style={{ flex: 1 }}
//     />
//   );
// }
