import React from "react";
import { Droppable } from "react-beautiful-dnd";
import List from "@material-ui/core/List";
import ListItemCustom from "./ListItemCustom";
import Typography from "@material-ui/core/Typography";

export default function Column({ column }) {
  return (
    <div
      style={{
        backgroundColor: "gray",
        margin: 10,
        padding: 20,
        color: "white"
      }}
    >
      <Typography variant={"h4"}>{column.id}</Typography>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <List>
              {column.list.map((itemObject, index) => {
                return <ListItemCustom index={index} itemObject={itemObject} />;
              })}
              {provided.placeholder}
            </List>
          </div>
        )}
      </Droppable>
    </div>
  );
};
