import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import MailApi from '../../api/mail';

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
        const { subject, from, to, receiveTime, text } = resp.data;
        this.setState({ subject, from, to, receiveTime, text });
      });
  }

  render() {
    const { subject, from, to, receiveTime, text } = this.state;
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
          </ul>
        </IceContainer>
        <IceContainer title="正文">
          <hr />
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
};
