import React, {Component} from 'react';
import {render} from 'react-dom';

class BitKariero extends React.Component {
  render () {
    return (
      <div>
        <h1> Hello! </h1>
      </div>
    );
  }
}

render(<BitKariero/>, document.getElementById('root'));
