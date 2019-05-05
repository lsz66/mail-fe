import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import Overview from './components/Overview';
import Ability from './components/AbilityIntroduction';

const { Row, Col } = Grid;

export default class Dashboard extends Component {
  static displayName = 'Dashboard';

  render() {
    return (
      <div>
        <Row gutter="20" wrap>
          <Col l="24">
            <Overview />
          </Col>
          <Col l="24">
            <Ability />
          </Col>
        </Row>
      </div>
    );
  }
}
