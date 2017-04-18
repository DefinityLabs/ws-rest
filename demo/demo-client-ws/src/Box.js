import React, { Component } from 'react';
import WSRepository from './WSRepository';

const repository = new WSRepository();

class Box extends Component {

  constructor(props) {
    super(props);
    this.state = { number: '' };
  }

  componentWillMount() {
    let self = this;
    repository.echo(this.props.number).then(function(data) {
      self.setState({number: data});
    });
  }

  render() {
    return (
      <div className="box">{this.state.number}</div>
    );
  }
}

export default Box;
