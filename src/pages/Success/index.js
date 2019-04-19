import React, { Component } from 'react';
import EmptyContent from './components/EmptyContent';

export default class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="success-page">
        <EmptyContent />
      </div>
    );
  }
}
