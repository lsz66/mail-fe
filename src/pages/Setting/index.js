/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { withRouter } from 'react-router-dom';
import { Button, Dialog, Input, Message } from '@alifd/next';
import {
  FormBinder as IceFormBinder,
  FormBinderWrapper as IceFormBinderWrapper,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import ContainerTitle from '../../components/ContainerTitle';
import UserApi from '../../api/user';

@withRouter
export default class BasicSetting extends Component {
  static displayName = 'BasicSetting';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: { name: '' },
      show: false,
    };
    UserApi.getName()
      .then((resp) => {
        this.setState({
          value: {
            name: resp.data,
          },
        });
      });
  }

  onClose = () => {
    this.setState({ show: false });
  };

  onSubmit = () => {
    const { name, password, re } = this.state.value;
    UserApi.updateInfo(this.state.value)
      .then((resp) => {
        if (resp.data) {
          Message.success('修改成功，请重新登录');
          setTimeout(() => {
            UserApi.logout()
              .then(() => {
              });
            this.props.history.push('/user/login');
          }, 1500);
        } else {
          Message.error('原密码错误，请检查后重新输入');
        }
      });
    this.setState(
      {
        value: { name, password, re, old: '' },
      }
    );
  };

  validateAllFormField = () => {
    const { password, re } = this.state.value;
    if (password !== undefined && password.length !== 0) {
      if (password.length < 6) {
        Message.error('密码长度最小为6');
        return;
      }
      if (password !== re) {
        Message.error('密码输入不匹配，请重新输入');
        return;
      }
      this.setState({ show: true });
    } else {
      UserApi.updateName(this.state.value)
        .then(() => {
          Message.success('修改成功');
          location.reload();
        });
    }
  };

  onEnter = (e) => {
    if (e.keyCode === 13) {
      this.validateAllFormField();
    }
  };

  onDialogEnter = (e) => {
    if (e.keyCode === 13) {
      this.onSubmit();
    }
  };

  render() {
    return (
      <div>
        <ContainerTitle title="基本设置" />
        <IceContainer style={styles.container}>
          <IceFormBinderWrapper
            value={this.state.value}
            ref="form"
          >
            <div>
              <div style={styles.formItem}>
                <div style={styles.formLabel}>发件人姓名：</div>
                <IceFormBinder name="name">
                  <Input style={{ width: '400px' }} onKeyUp={this.onEnter} />
                </IceFormBinder>
              </div>
              <div style={styles.formItem}>
                <div style={styles.formLabel}>修改密码：</div>
                <IceFormBinder
                  triggerType="onBlur"
                  name="password"
                >
                  <Input
                    htmlType="password"
                    style={{ width: '400px' }}
                    placeholder="如不修改请保持为空"
                    onKeyUp={this.onEnter}
                  />
                </IceFormBinder>
                <div style={styles.formError}>
                  <IceFormError name="password" />
                </div>
              </div>
              <div style={styles.formItem}>
                <div style={styles.formLabel}>确认修改密码：</div>
                <IceFormBinder
                  triggerType="onBlur"
                  name="re"
                >
                  <Input
                    htmlType="password"
                    style={{ width: '400px' }}
                    placeholder="如不修改请保持为空"
                    onKeyUp={this.onEnter}
                  />
                </IceFormBinder>
                <div style={styles.formError}>
                  <IceFormError name="re" />
                </div>
              </div>
              <Button
                type="primary"
                onClick={this.validateAllFormField}
              >
                提 交
              </Button>
            </div>
          </IceFormBinderWrapper>
          <Dialog
            title="请输入原密码"
            footer={<Button type="primary" onClick={this.onSubmit}>确认</Button>}
            visible={this.state.show}
            onClose={this.onClose}
          >
            <IceFormBinderWrapper
              value={this.state.value}
              ref="form"
            >
              <IceFormBinder name="old">
                <Input htmlType="password" style={{ width: '400px' }} onKeyUp={this.onDialogEnter} />
              </IceFormBinder>
            </IceFormBinderWrapper>
          </Dialog>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: '20px',
  },
  title: {
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: '500',
    color: 'rgba(0, 0, 0,.85)',
  },
  summary: {
    margin: '0 0 20px',
  },
  formItem: {
    marginBottom: '20px',
  },
  formLabel: {
    marginBottom: '10px',
  },
  formError: {
    marginTop: '10px',
  },
};
