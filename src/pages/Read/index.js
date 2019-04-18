import React, { Component } from 'react';
import DetailTable from './components/DetailTable';

export default class Read extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="read-page">
        {/* 展示详情信息的表格 */}
        <DetailTable />
      </div>
    );
  }
}
