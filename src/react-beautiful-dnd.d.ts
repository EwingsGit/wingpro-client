declare module "react-beautiful-dnd" {
  import * as React from "react";

  export type DraggableId = string;
  export type DroppableId = string;
  export type DragStart = {
    draggableId: DraggableId;
    type: string;
    source: {
      droppableId: DroppableId;
      index: number;
    };
  };
  export type DropResult = {
    draggableId: DraggableId;
    type: string;
    source: {
      droppableId: DroppableId;
      index: number;
    };
    destination?: {
      droppableId: DroppableId;
      index: number;
    };
    reason: "DROP" | "CANCEL";
  };

  export type DraggableProvided = {
    draggableProps: any;
    dragHandleProps: any;
    innerRef: React.RefObject<any>;
  };

  export type DroppableProvided = {
    innerRef: React.RefObject<any>;
    droppableProps: any;
    placeholder: React.ReactNode;
  };

  export type DraggableStateSnapshot = {
    isDragging: boolean;
    isDropAnimating: boolean;
    draggingOver: DroppableId | null;
    dropAnimation: any;
  };

  export type DroppableStateSnapshot = {
    isDraggingOver: boolean;
    draggingOverWith: DraggableId | null;
  };

  export const DragDropContext: React.FC<{
    onDragEnd: (result: DropResult) => void;
    onDragStart?: (initial: DragStart) => void;
    onDragUpdate?: (initial: any) => void;
    children: React.ReactNode;
  }>;

  export const Droppable: React.FC<{
    droppableId: DroppableId;
    type?: string;
    direction?: "horizontal" | "vertical";
    children: (
      provided: DroppableProvided,
      snapshot: DroppableStateSnapshot
    ) => React.ReactNode;
  }>;

  export const Draggable: React.FC<{
    draggableId: DraggableId;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    children: (
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot
    ) => React.ReactNode;
  }>;
}
