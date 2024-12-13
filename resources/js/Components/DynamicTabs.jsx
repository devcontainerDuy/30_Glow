import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import PropTypes from "prop-types";
import TableDataGrid from "@/Components/TableDataGrid";

const DynamicTabs = ({ tabsData }) => {
    return (
        <Tabs defaultActiveKey={tabsData[0]?.eventKey} id="dynamic-tabs">
            {tabsData.map((tab, index) => (
                <Tab eventKey={tab.eventKey} title={`${tab.title} (${tab.data.length})`} key={index}>
                    <TableDataGrid data={tab.data} columns={tab.columns} handleCellEditStop={tab.handleCellEditStop} handleCellEditStart={tab.handleCellEditStart} />
                </Tab>
            ))}
        </Tabs>
    );
};

DynamicTabs.propTypes = {
    tabsData: PropTypes.arrayOf(
        PropTypes.shape({
            eventKey: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            data: PropTypes.array.isRequired,
            columns: PropTypes.array.isRequired,
            handleCellEditStop: PropTypes.func,
            handleCellEditStart: PropTypes.func,
        })
    ).isRequired,
};

export default DynamicTabs;
