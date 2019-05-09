import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { withRouter } from 'react-router-dom';
import { Button, Dialog, Message } from '@alifd/next';
import MailApi from '../../api/mail';

@withRouter
export default class ReadMail extends Component {
  static displayName = 'ReadMail';

  state = {
    spamLoading: false,
    hamLoading: false,
    showSpamMsg: true,
  };

  constructor(props) {
    super(props);
    const url = location.hash.substring(7).split('/');
    const box = url[0];
    const id = url[1];
    MailApi.read(box, id)
      .then((resp) => {
        const { subject, from, to, receiveTime, text, state } = resp.data;
        this.setState({ subject, from, to, receiveTime, text, state, box, id });
      });
    if (box !== 'inbox') {
      this.setState({ showSpamMsg: false });
    }
  }

  handleHam = () => {
    const { box, id } = this.state;
    this.setState({ hamLoading: true });
    MailApi.markAs(box, [id], 'ham')
      .then(() => {
        Message.success('谢谢您的反馈');
        this.setState({ hamLoading: false, showSpamMsg: false });
      });
  };

  handleMoveToSpam = () => {
    const { box, id } = this.state;
    Dialog.confirm({
      title: '确定',
      content: '这封邮件是垃圾邮件吗？',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.move([id], box, 'spam')
            .then(() => {
              Message.success('这封邮件已被移到垃圾箱');
              this.props.history.push('/inbox');
            })
            .then(() => {
              resolve(true);
            });
          MailApi.markAs(box, [id], 'spam')
            .then(() => {
            });
        });
      },
    });
  };

  handleMoveToRecycle = () => {
    const { box, id } = this.state;
    Dialog.confirm({
      title: '确定',
      content: '您确定要将这封邮件移到回收站吗？',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.move([id], box, 'recycle')
            .then(() => {
              Message.success('所选邮件已经移到回收站');
              this.props.history.push('/inbox');
            })
            .then(() => {
              resolve(true);
            });
        });
      },
    });
  };

  handleMoveToInbox = () => {
    const { box, id } = this.state;
    Dialog.confirm({
      title: '确定',
      content: '您确定要将这封邮件移回收件箱吗？',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.move([id], box, 'inbox')
            .then(() => {
              Message.success('所选邮件已经移回收件箱');
              this.props.history.push('/inbox');
            })
            .then(() => {
              resolve(true);
            });
        });
      },
    });
  };

  handleMoveToHam = () => {
    const { box, id } = this.state;
    Dialog.confirm({
      title: '确定',
      content: '这封邮件是普通邮件吗，如果是，该邮件将移回收件箱？',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.move([id], box, 'inbox')
            .then(() => {
              Message.success('此已经移回收件箱');
            })
            .then(() => {
              resolve(true);
            });
          MailApi.markAs(box, [id], 'ham')
            .then();
        });
      },
    });
  };

  handleDelete = () => {
    const { box, id } = this.state;
    Dialog.confirm({
      title: '确定',
      content: '您确定要将这封邮件彻底删除吗？这一操作不可恢复',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.del([id], box)
            .then(() => {
              Message.success('所选邮件已删除');
              this.props.history.push(`/${box}`);
            })
            .then(() => {
              resolve(true);
            });
        });
      },
    });
  };

  handleSpam = () => {
    const { box, id } = this.state;
    this.setState({ spamLoading: true });
    MailApi.move([id], box, 'spam')
      .then(() => {
        Message.success('邮件已移动到垃圾箱');
        this.props.history.push('/inbox');
      })
      .catch(() => {
        Message.error('服务器出错');
        this.setState({ spamLoading: false });
      });
    MailApi.markAs(box, [id], 'spam')
      .then(() => {
      });
  };

  handleReply = () => {
    const { id } = this.state;
    this.props.history.push(`/reply/${id}`);
  };

  handleReSend = () => {
    const { id } = this.state;
    this.props.history.push(`/resend/${id}`);
  };

  render() {
    const { subject, from, to, receiveTime, text, state, spamLoading, hamLoading, showSpamMsg, box } = this.state;
    const spamMsg = (
      <Message key="spam" title="温馨提示" type="warning" size="large">
        <h3>这封邮件看起来像是垃圾邮件。</h3>
        <div style={{ textAlign: 'right' }}>
          <Button warning size="small" onClick={this.handleSpam} loading={spamLoading}>这是垃圾邮件，请帮我移到垃圾箱</Button>
          <Button type="secondary" style={{ marginLeft: '20px' }} size="small" onClick={this.handleHam} loading={hamLoading}>这不是垃圾邮件</Button>
        </div>
      </Message>
    );
    const inboxOperator = (
      <li style={styles.detailItem}>
        <div style={styles.detailTitle}>操作</div>
        <div style={styles.detailBody}>
          <Button type="secondary" style={styles.button} onClick={this.handleReply} size="small">
            回复
          </Button>
          <Button style={styles.button} onClick={this.handleMoveToRecycle} size="small">
            移到回收站
          </Button>
          <Button style={styles.button} onClick={this.handleMoveToSpam} size="small">
            标为垃圾邮件
          </Button>
          <Button style={styles.button} warning onClick={this.handleDelete} size="small">
            彻底删除
          </Button>
        </div>
      </li>
    );
    const outboxOperator = (
      <li style={styles.detailItem}>
        <div style={styles.detailTitle}>操作</div>
        <div style={styles.detailBody}>
          <Button type="secondary" style={styles.button} onClick={this.handleReSend} size="small">
            再次发送
          </Button>
          <Button style={styles.button} warning onClick={this.handleDelete} size="small">
            彻底删除
          </Button>
        </div>
      </li>
    );
    const recycleOperator = (
      <li style={styles.detailItem}>
        <div style={styles.detailTitle}>操作</div>
        <div style={styles.detailBody}>
          <Button type="secondary" style={styles.button} onClick={this.handleMoveToInbox} size="small">
            恢复到收件箱
          </Button>
          <Button style={styles.button} warning onClick={this.handleDelete} size="small">
            彻底删除
          </Button>
        </div>
      </li>
    );
    const spamOperator = (
      <li style={styles.detailItem}>
        <div style={styles.detailTitle}>操作</div>
        <div style={styles.detailBody}>
          <Button type="secondary" style={styles.button} onClick={this.handleMoveToHam} size="small">
            标记为普通邮件
          </Button>
          <Button style={styles.button} warning onClick={this.handleDelete} size="small">
            彻底删除
          </Button>
        </div>
      </li>
    );
    let operator;
    switch (box) {
      case 'inbox':
        operator = inboxOperator;
        break;
      case 'outbox':
        operator = outboxOperator;
        break;
      case 'spam':
        operator = spamOperator;
        break;
      case 'recycle':
        operator = recycleOperator;
        break;
      default:
        operator = '';
    }
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
            {operator}
          </ul>
        </IceContainer>
        <IceContainer title="正文">
          <hr />
          {state === 1 && showSpamMsg ? spamMsg : ''}
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
