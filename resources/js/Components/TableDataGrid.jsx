import React from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PropTypes from "prop-types";

const TableDataGrid = ({ data, columns, handleCellEditStop, handleCellEditStart }) => {
    return (
        <Box sx={{ height: "70vh", width: "100%" }}>
            <DataGrid
                rows={data}
                columns={columns}
                slots={{
                    toolbar: GridToolbar,
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: {
                            debounceMs: 500,
                        },
                    },
                }}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 20,
                        },
                    },
                }}
                onCellEditStop={(params, e) => {
                    handleCellEditStop(params.row.id, params.field, e.target.value);
                }}
                onCellEditStart={(params, e) => {
                    handleCellEditStart(params.row.id, params.field, e.target.value);
                }}
                pageSizeOptions={[20, 40, 60, 80, 100]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
};

export default TableDataGrid;

TableDataGrid.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
    handleCellEditStop: PropTypes.func,
    handleCellEditStart: PropTypes.func,
};
