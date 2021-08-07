// Adapted from https://codesandbox.io/s/k260nyxq9v?file=/index.js:2682-2704
// Assumes each list element has a toString method defined

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useState } from "react";

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});


const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const DraggableList = React.memo(function DraggableList({ elements }) {
    return elements.map((element, i) => (
        <Draggable draggableId={"draggable" + i} index={i}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging,provided.draggableProps.style)}>
                    {element.toString()}
                </div>
            )}
        </Draggable>
    ));
});

export default function DragDropList({ initialList }) {
    const [state, setState] = useState({ list: initialList });

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const list = reorder(
            state.list,
            result.source.index,
            result.destination.index
        );

        setState({ list });
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {(provided, snapshot)=> (
                    <div  ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                        <DraggableList elements={state.list} />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
