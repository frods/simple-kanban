import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable.jsx';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const laneSource = {
  beginDrag(props) {
    return {
      id: props.lane.id
    };
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  }
};

const laneTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.lane.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId});
    }
  }
};

const noteTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.lane.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetId,
        noteId: sourceId
      });
    }
  }
}

@DragSource(ItemTypes.LANE, laneSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging() // map isDragigng() state to isDragging prop
}))
@DropTarget(ItemTypes.LANE, laneTarget, (connect) => ({
  connectLaneDropTarget: connect.dropTarget()
}))
@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Lane extends React.Component {
  constructor(props) {
    super(props);

    const id = props.lane.id;

    this.addNote = this.addNote.bind(this, id);
    this.deleteNote = this.deleteNote.bind(this, id);
    this.editName = this.editName.bind(this, id);
  }
  render() {
    const {connectDragSource, connectLaneDropTarget, connectDropTarget, lane, 
      onMove, ...props} = this.props;

    return connectDragSource(connectLaneDropTarget(connectDropTarget(
      <div {...props}>
        <div className="lane-header">
          <Editable className="lane-name" value={lane.name}
            onEdit={this.editName} />
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            items: () => NoteStore.get(lane.notes)
          }}
        >
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    )));
  }
  addNote(laneId) {
    NoteActions.create({task: 'New task'});
    LaneActions.attachToLane({laneId});
  }
  editNote(id, task) {
    NoteActions.update({id, task});
  }
  deleteNote(laneId, noteId) {
    LaneActions.detachFromLane({laneId, noteId});
    NoteActions.delete(noteId);
  }

  editName(id, name) {
    if(name) {
      LaneActions.update({id, name});
    }
    else {
      LaneActions.delete(id);
    }
  }
}