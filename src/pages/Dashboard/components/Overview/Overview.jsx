import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid } from '@alifd/next';
import ContainerTitle from '../../../../components/ContainerTitle';

const { Row, Col } = Grid;

const mockData = [
  {
    title: '收件箱',
    value: '87',
  },
  {
    title: '发件箱',
    value: '62',
  },
  {
    title: '草稿箱',
    value: '123',
  },
  {
    title: '垃圾箱',
    value: '10',
  },
];

export default class Overview extends Component {
  static displayName = 'Overview';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ContainerTitle title="总概览" />
        <IceContainer style={styles.container}>
          <Row>
            <Col l="5">
              <div style={styles.item}>
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/heTdoQXAHjxNGiLSUkYA.svg"
                  alt=""
                />
              </div>
            </Col>
            {mockData.map((item, index) => {
              return (
                <Col l="4" key={index}>
                  <div style={styles.item}>
                    <p style={styles.itemTitle}>{item.title}</p>
                    <p style={styles.itemValue}>{item.value}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  item: {
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    color: '#697b8c',
    fontSize: '14px',
  },
  itemValue: {
    color: '#314659',
    fontSize: '36px',
    marginTop: '10px',
  },
};
