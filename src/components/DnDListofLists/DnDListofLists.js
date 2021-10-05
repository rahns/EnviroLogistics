// The code in this file and folder are modified from https://codesandbox.io/s/react-material-ui-drag-and-drop-trello-clone-2-lists-7q46h

import React from "react";
import Grid from "@material-ui/core/Grid";
//import makeStyles from "@material-ui/core/styles/makeStyles";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

// const useStyles = makeStyles((theme) => ({

// }));

export default function DragDropListOfLists({ stateUpdater, state }) {
  //const classes = useStyles();

  /*
    TODO: It's really important how you structure your data!!!
      each column has to have a unique id, each item has to have a unique id and ideally consecutive else funky things happen
      each droppable has to have a unique id, each draggable also - cannot stress this enough because that is the only way
      the framework knows how what went from which list
    */
  // const initialColumns = {
  //   todo: {
  //     id: "todo",
  //     list: [
  //       { id: "1", text: "text1" },
  //       { id: "2", text: "text2" },
  //       { id: "3", text: "text3" }
  //     ]
  //   },
  //   doing: {
  //     id: "doing",
  //     list: [
  //       { id: "4", text: "text4" },
  //       { id: "5", text: "text5" },
  //       { id: "6", text: "text6" }
  //     ]
  //   },
  //   done: {
  //     id: "done",
  //     list: []
  //   }
  // };

  const onDragEnd = ({ source, destination }) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    const start = state[source.droppableId];
    const end = state[destination.droppableId];

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter((_, idx) => idx !== source.index);

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      // Then create a new copy of the column object
      const newCol = {...start,
        id: start.id,
        list: newList
      };

      // Update the state
      stateUpdater((state) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter((_, idx) => idx !== source.index);

      // Create a new start column
      const newStartCol = {...start,
        id: start.id,
        list: newStartList
      };

      // Make a new end list array
      const newEndList = end.list;

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {...end,
        id: end.id,
        list: newEndList
      };

      // Update the state
      stateUpdater((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }));
      return null;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container direction={"row"} justifyContent={"center"}>
        {Object.values(state).map((column) => {
          return (
            <Grid item>
              <Column column={column} key={column.id} />
            </Grid>
          );
        })}
      </Grid>
    </DragDropContext>
  );
};
