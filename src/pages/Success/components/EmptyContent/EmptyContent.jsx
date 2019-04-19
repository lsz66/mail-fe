import React, { Component } from 'react';
import { Button } from '@alifd/next';
import { Link, withRouter } from 'react-router-dom';
import IceContainer from '@icedesign/container';
import './EmptyContent.scss';

@withRouter
export default class EmptyContent extends Component {
  static displayName = 'EmptyContent';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="empty-content">
        <IceContainer>
          <div style={styles.exceptionContent} className="exception-content">
            <img
              src={require('./images/TB1WNNxjBHH8KJjy0FbXXcqlpXa-780-780.png')}
              style={styles.image}
              className="imgException"
              alt="empty"
            />
            <div style={styles.prompt}>
              <h3 style={styles.title} className="title">
                发送成功
              </h3>
              <p style={styles.description} className="description">
                邮件已发送成功。
              </p>
              <p style={styles.description} className="description">
                <Link to="/inbox"><Button style={styles.buttons}>收件箱</Button></Link>
                <Link to="/outbox"><Button style={styles.buttons}>发件箱</Button></Link>
                <Link to="/draftbox"><Button style={styles.buttons}>草稿箱</Button></Link>
              </p>
            </div>
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  exceptionContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#333',
  },
  description: {
    color: '#666',
  },
  buttons: {
    marginRight: '10px',
  },
};
