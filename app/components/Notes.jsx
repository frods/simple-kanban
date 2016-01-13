import React from 'react';
import Editable from './Editable.jsx';
import Note from './Note.jsx';

import LaneActions from '../actions/LaneActions';

export default class Editables extends React.Component {
  render() {
    const notes = this.props.items;

    return <ul className="notes">{notes.map(this.renderNote, this)}</ul>;
  }
  renderNote(note) {
    return (
      <Note className="note" id={note.id} key={note.id}
        onMove={LaneActions.moveNote}>
        <Editable 
          value={note.task}
          onEdit={this.props.onEdit.bind(null, note.id)}
          onDelete={this.props.onDelete.bind(null, note.id)}/>
      </Note>
    );
  }

}