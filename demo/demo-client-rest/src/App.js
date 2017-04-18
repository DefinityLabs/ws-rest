import React, { Component } from 'react';
import Box from './Box';

class App extends Component {

  render() {
    let boxes = [];

    for (let i = 1; i <= 100; i++) {
      boxes.push(<Box key={i} number={"" + i} />);
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2>{this.props.message}</h2>
        </div>
        {boxes}
      </div>
    );
  }

}

export default App;
