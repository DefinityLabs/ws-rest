import React, { Component } from 'react';
import {wsRestClient} from 'ws-rest';
import Box from './Box';

class App extends Component {

  componentWillMount() {
    wsRestClient.connect('ws://localhost:9999/ws', {autoClose: true});
  }

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

  componentWillUnmount() {
    wsRestClient.close();
  }
}

export default App;
