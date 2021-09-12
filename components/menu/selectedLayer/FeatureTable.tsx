import React from "react";

import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import renderCellExpand from "./renderCellExpand";

export const FeatureTable = ({ loadedData }) => {
  //   const columns: GridColDef[] = [
  //     { field: "id", headerName: "ID", width: 90 },
  //     {
  //       field: "firstName",
  //       headerName: "First name",
  //       width: 150,
  //       editable: true,
  //     },
  //     {
  //       field: "lastName",
  //       headerName: "Last name",
  //       width: 150,
  //       editable: true,
  //     },
  //     {
  //       field: "age",
  //       headerName: "Age",
  //       type: "number",
  //       width: 110,
  //       editable: true,
  //     },
  //   ];

  //   const rows = [
  //     { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  //     { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  //     { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  //     { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  //     { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  //     { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  //     { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  //     { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  //     { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  //   ];

  const data = loadedData?.["disaster_lore_all"];
  console.log("loadedData0", data);
  const col = Object.keys(data?.[0].properties || {});
  console.log("col", col);

  const columns: GridColDef[] = col.map((d) => ({
    field: d,
    headerName: d,
    minWidth: 150,
    renderCell: renderCellExpand,
  }));

  const rows = data?.map((d, index) => ({ id: index, ...d?.properties }));
  //   console.log("rows", rows);
  //   const test2 = data?.map((d, index) => (
  //     <div key={index} style={{ padding: 8 }}>
  //       {JSON.stringify(d?.properties)}
  //     </div>
  //   ));
  //   const result = test2?.map((d) => <div>{JSON.stringify(test2)}</div>);

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport csvOptions={{ allColumns: true }} />
    </GridToolbarContainer>
  );

  return (
    <div style={{}}>
      {data && (
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          components={{
            Toolbar: CustomToolbar,
          }}
          style={{ height: "700px", maxHeight: "80vh" }}
          //   autoHeight
          //   style={{ overflow: "scroll" }}
          //   pageSize={5}
          //   rowsPerPageOptions={[5]}
        />
      )}
      {/* {test2} */}
      <style jsx>{`
        .test {
          background-color: red;
          width: 300px;
        }
      `}</style>
    </div>
  );
};

export default React.memo(FeatureTable);
