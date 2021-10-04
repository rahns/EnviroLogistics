import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Draggable } from "react-beautiful-dnd";

export default function ListItemCustom({ itemObject, index }) {
  return (
    <Draggable draggableId={itemObject.id} key={itemObject.id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <ListItem
            key={itemObject.id}
            role={undefined}
            dense
            button
            ContainerComponent="li"
          >
            <ListItemText
              primary={`${itemObject.content}`}
            />
          </ListItem>
        </div>
      )}
    </Draggable>
  );
};

