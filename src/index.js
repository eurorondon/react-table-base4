import React from "react";
import ReactDOM from "react-dom";
import BaseTable, { AutoResizer } from "react-base-table";
import "react-base-table/styles.css";

class Table extends React.Component {
  state = {
    expandedRowKeys: []
  };

  expandIconProps = ({ rowData }) => ({
    expanding: !rowData.children,
    isLeaf: !rowData.children
  });

  render() {
    let { expandedRowKeys } = this.state;
    let props = this.props;

    let data = props.data;

    const expandColumnKey = this.props.columns[0].dataKey;

    // const treeData = unflatten(data);

    console.log("treeData:", expandColumnKey, data);

    return (
      <AutoResizer>
        {({ width, height }) => (
          <BaseTable
            {...props}
            expandColumnKey={expandColumnKey}
            width={width}
            height={height}
          />
        )}
      </AutoResizer>
    );
  }
}

const generateColumns = (count = 10, prefix = "column-", props) =>
  new Array(count).fill(0).map((column, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150
  }));

const generateData = (columns, count = 20, prefix = "row-") =>
  new Array(count).fill(0).map((row, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`;

        if (rowIndex === 0) {
          rowData.children = [
            {
              id: "children_" + rowIndex,
              [column.dataKey]: "children_" + rowIndex,
              "column-0": "children_" + rowIndex
            }
          ];
        }

        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null
      }
    );
  });

const columns = generateColumns(10);
const data = generateData(columns, 10);

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen;
  if (columnIndex < 2) frozen = "left";
  if (columnIndex > 8) frozen = "right";

  return { ...column, resizable: true, frozen };
});

class TableDemo extends React.Component {
  render() {
    return (
      <div style={{ height: 400, width: 600 }}>
        <Table fixed columns={fixedColumns} data={data} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<TableDemo />, rootElement);
