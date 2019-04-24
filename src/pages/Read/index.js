import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { withRouter } from 'react-router-dom';
import { Button, Message } from '@alifd/next';
import MailApi from '../../api/mail';

@withRouter
export default class ReadMail extends Component {
  static displayName = 'ReadMail';

  state = {};

  constructor(props) {
    super(props);
    const url = location.hash.substring(7).split('/');
    const box = url[0];
    const id = url[1];
    MailApi.read(box, id)
      .then((resp) => {
        const { subject, from, to, receiveTime, text, state } = resp.data;
        this.setState({ subject, from, to, receiveTime, text, state });
      });
  }

  handleHam = () => {
    Message.success('谢谢您的反馈');
    this.setState({ state: 0 });
  };

  handleSpam = () => {
    Message.success('邮件已移动到垃圾箱');
    const url = location.hash.substring(7).split('/');
    const id = url[1];
    MailApi.moveOne(id, 'inbox', 'spam')
      .then(() => {
      });
    this.props.history.push('/inbox');
    this.setState({ state: 0 });
  };

  render() {
    const { subject, from, to, receiveTime, text, state } = this.state;
    const spamMsg = (
      <Message key="spam" title="温馨提示" type="warning" size="large">
        <h3>这封邮件看起来像是垃圾邮件。</h3>
        <div style={{ textAlign: 'right' }}>
          <Button warning size="small" onClick={this.handleSpam}>这是垃圾邮件，请帮我移到垃圾箱</Button>
          <Button type="secondary" style={{ marginLeft: '20px' }} size="small" onClick={this.handleHam}>这不是垃圾邮件</Button>
        </div>
      </Message>);
    return (
      <div className="detail-table">
        <IceContainer title="邮件详情">
          <ul>
            <li style={styles.detailItem}>
              <div style={styles.detailTitle}>发件人</div>
              <div style={styles.detailBody}>{from}</div>
            </li>
            <li style={styles.detailItem}>
              <div style={styles.detailTitle}>收件人</div>
              <div style={styles.detailBody}>{to}</div>
            </li>
            <li style={styles.detailItem}>
              <div style={styles.detailTitle}>时间</div>
              <div style={styles.detailBody}>{receiveTime}</div>
            </li>
            <li style={styles.detailItem}>
              <div style={styles.detailTitle}>主题</div>
              <div style={styles.detailBody}>{subject}</div>
            </li>
            <li style={styles.detailItem}>
              <div style={styles.detailTitle}>操作</div>
              <div style={styles.detailBody}>
                <Button type="secondary" style={styles.button} onClick={this.getData} size="small">
                  回复
                </Button>
                <Button style={styles.button} onClick={this.handleMoveToRecycle} size="small">
                  移到回收站
                </Button>
                <Button style={styles.button} onClick={this.handleMoveToRecycle} size="small">
                  标为垃圾邮件
                </Button>
                <Button style={styles.button} warning onClick={this.handleDelete} size="small">
                  彻底删除
                </Button>
              </div>
            </li>
          </ul>
        </IceContainer>
        <IceContainer title="正文">
          <hr />
          { state === 1 ? spamMsg : ''}
          <div style={styles.textBody} dangerouslySetInnerHTML={{ __html: text }} />
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  detailItem: {
    padding: '15px 0px',
    display: 'flex',
    borderTop: '1px solid #EEEFF3',
  },
  detailTitle: {
    marginRight: '30px',
    textAlign: 'right',
    width: '120px',
    color: '#999999',
  },
  detailBody: {
    flex: 1,
  },
  textBody: {
    margin: '30px',
  },
  statusProcessing: {
    color: '#64D874',
  },
  button: {
    marginRight: '20px',
  },
};
