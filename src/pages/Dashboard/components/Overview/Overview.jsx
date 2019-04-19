import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Message } from '@alifd/next';
import ContainerTitle from '../../../../components/ContainerTitle';
import UserApi from '../../../../api/user';

const { Row, Col } = Grid;

export default class Overview extends Component {
  static displayName = 'Overview';

  static propTypes = {};

  static defaultProps = {};

  state = {
    unread: '···',
    inbox: '···',
    outbox: '···',
    draft: '···',
  };

  constructor(props) {
    super(props);
    Message.loading('正在获取邮件信息');
    UserApi.getOverview()
      .then((resp) => {
        if (resp.data.length === 0) {
          Message.error('请登陆');
          return;
        }
        const { unread, inbox, outbox, draft } = resp.data;
        this.setState({ unread, inbox, outbox, draft });
        Message.success('获取完毕');
      });
  }

  render() {
    const { unread, inbox, outbox, draft } = this.state;
    return (
      <div>
        <ContainerTitle title="总概览" />
        <IceContainer style={styles.container}>
          <Row>
            <Col l="4">
              <div style={styles.item}>
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/heTdoQXAHjxNGiLSUkYA.svg"
                  alt=""
                />
              </div>
            </Col>
            <Col l="5">
              <div style={styles.item}>
                <p style={styles.itemTitle}>新消息</p>
                <p style={styles.itemValue}>{unread}</p>
              </div>
            </Col>
            <Col l="5">
              <div style={styles.item}>
                <p style={styles.itemTitle}>收件箱</p>
                <p style={styles.itemValue}>{inbox}</p>
              </div>
            </Col>
            <Col l="5">
              <div style={styles.item}>
                <p style={styles.itemTitle}>发件箱</p>
                <p style={styles.itemValue}>{outbox}</p>
              </div>
            </Col>
            <Col l="5">
              <div style={styles.item}>
                <p style={styles.itemTitle}>草稿箱</p>
                <p style={styles.itemValue}>{draft}</p>
              </div>
            </Col>
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
