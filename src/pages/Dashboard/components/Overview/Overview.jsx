import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Loading, Message } from '@alifd/next';
import ContainerTitle from '../../../../components/ContainerTitle';
import UserApi from '../../../../api/user';
import LineChart from '../LineChart';

const { Row, Col } = Grid;

const cols = {
  acc: {
    alias: '邮件数',
  },
};

export default class Overview extends Component {
  static displayName = 'Overview';

  static propTypes = {};

  static defaultProps = {};

  state = {
    unread: '···',
    inbox: '···',
    outbox: '···',
    chart: [],
    loading: true,
  };

  constructor(props) {
    super(props);
    UserApi.getOverview()
      .then((resp) => {
        if (resp.data.length === 0) {
          Message.error('请登陆');
          return;
        }
        const { unread, inbox, outbox } = resp.data;
        this.setState({ unread, inbox, outbox, loading: false });
        UserApi.getDateCount()
          .then((respData) => {
            this.setState({ chart: respData.data });
          });
      });
  }

  render() {
    const { unread, inbox, outbox } = this.state;
    return (
      <div>
        <Loading visible={this.state.loading}
          fullScreen
          shape="fusion-reactor"
          tip="正在连接至邮件服务器，请稍等..."
          tipAlign="right"
        />
        <ContainerTitle title="总概览" />
        <IceContainer style={styles.container}>
          <Row>
            <Col l="6">
              <div style={styles.item}>
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/heTdoQXAHjxNGiLSUkYA.svg"
                  alt=""
                />
              </div>
            </Col>
            <Col l="6">
              <div style={styles.item}>
                <p style={styles.itemTitle}>新消息</p>
                <p style={styles.itemValue}>{unread}</p>
              </div>
            </Col>
            <Col l="6">
              <div style={styles.item}>
                <p style={styles.itemTitle}>收件箱</p>
                <p style={styles.itemValue}>{inbox}</p>
              </div>
            </Col>
            <Col l="6">
              <div style={styles.item}>
                <p style={styles.itemTitle}>发件箱</p>
                <p style={styles.itemValue}>{outbox}</p>
              </div>
            </Col>
          </Row>
        </IceContainer>
        <ContainerTitle title="最近两周收发邮件数" />
        <IceContainer style={styles.container}>
          <LineChart cols={cols} data={this.state.chart} axisName="name" />
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
