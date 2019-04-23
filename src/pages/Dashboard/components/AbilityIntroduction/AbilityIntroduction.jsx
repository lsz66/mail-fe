import React, { Component } from 'react';
import { Grid } from '@alifd/next';

const { Row, Col } = Grid;

const frameworkIcon = require('./images/framework_icon.png');
const componentIcon = require('./images/component_icon.png');
const apiIcon = require('./images/api_icon.png');

const abilities = [
  {
    icon: frameworkIcon,
    title: '界面',
    content: '为用户提供良好易用的用户界面。',
  },
  {
    icon: componentIcon,
    title: '功能',
    content: '为用户提供易用，操作友好的邮件系统',
  },
  {
    icon: apiIcon,
    title: 'API',
    content: '为用户提供各大邮件客户端的支持。',
  },
];

export default class AbilityIntroduction extends Component {
  renderAblities = () => {
    return abilities.map(({ icon, title, content }, idx) => {
      return (
        <Col xxs="24" l="8" style={styles.item} key={idx}>
          <img src={icon} style={{ width: '160px', height: '160px' }} alt="" />
          <div style={{ fontSize: '24px', color: '#333', marginBottom: '6px' }}>
            {title}
          </div>
          <div
            style={{
              width: '182px',
              fontSize: '16px',
              color: '#6D7A82',
              marginBottom: '30px',
              lineHeight: '1.7em',
            }}
          >
            {content}
          </div>
        </Col>
      );
    });
  };
  render() {
    return (
      <div style={styles.container}>
        <div style={styles.title}>功能介绍</div>
        <div style={styles.subtitle}>&lt; Distinguishing Feature &gt;</div>
        <Row wrap style={styles.group}>
          {this.renderAblities()}
        </Row>
      </div>
    );
  }
}

const styles = {
  container: {
    background: '#fafafa',
    padding: '70px 70px 140px',
    textAlign: 'center',
  },
  title: {
    color: '#333',
    fontSize: '48px',
    whiteSpace: 'nowrap',
    marginBottom: '10px',
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40px',
  },
  item: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
};
