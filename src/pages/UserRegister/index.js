/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Input, Message } from '@alifd/next';
import {
  FormBinder as IceFormBinder,
  FormBinderWrapper as IceFormBinderWrapper,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/foundation-symbol';
import UserApi from '../../api/user';

@withRouter
class UserRegister extends Component {
  static displayName = 'UserRegister';

  constructor(props) {
    super(props);
    this.state = {
      value: {
        username: '',
        password: '',
        re: '',
      },
      isLoading: false,
    };
  }

  checkUsername = (rule, values, callback) => {
    if (!values) {
      callback('请输入用户名');
    }
    if (!(/^[A-Za-z0-9]+$/.test(values))) {
      callback('用户名中有非法字符，请输入仅英文或数字');
    }
    if (values.length < 3) {
      callback('用户名最小长度为3');
    } else if (values.length > 20) {
      callback('用户名最大长度为20');
    } else {
      callback();
    }
  };

  checkPassword = (rule, values, callback) => {
    if (!values) {
      callback('请输入正确的密码');
    } else if (values.length < 6) {
      callback('密码必须大于6位');
    } else if (values.length > 20) {
      callback('密码必须小于20位');
    } else {
      callback();
    }
  };

  checkRePassword = (rule, values, callback, stateValues) => {
    if (!values) {
      callback('请输入正确的密码');
    } else if (values && values !== stateValues.password) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  onEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        return;
      }
      this.setState({ isLoading: true });
      UserApi.register(values)
        .then((resp) => {
          if (resp.data) {
            Message.success('注册成功');
            this.props.history.push('/user/login');
          } else {
            Message.error('用户名已存在，请换个用户名再试');
          }
          this.setState({ isLoading: false });
        });
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <h4 style={styles.title}>注 册</h4>
        <IceFormBinderWrapper
          value={this.state.value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formItems}>
            <div style={styles.formItem}>
              <IceIcon type="person" size="small" style={styles.inputIcon} />
              <IceFormBinder name="username"
                required
                validator={this.checkUsername}
              >
                <Input
                  size="large"
                  placeholder="用户名"
                  innerAfter="@szlee.cn&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                  style={styles.inputCol}
                  onKeyUp={this.onEnter}
                />
              </IceFormBinder>
              <IceFormError name="username" />
            </div>

            <div style={styles.formItem}>
              <IceIcon type="lock" size="small" style={styles.inputIcon} />
              <IceFormBinder
                name="password"
                required
                validator={this.checkPassword}
              >
                <Input
                  htmlType="password"
                  size="large"
                  placeholder="至少6位密码"
                  style={styles.inputCol}
                  onKeyUp={this.onEnter}
                />
              </IceFormBinder>
              <IceFormError name="password" />
            </div>

            <div style={styles.formItem}>
              <IceIcon type="lock" size="small" style={styles.inputIcon} />
              <IceFormBinder
                name="re"
                required
                validator={(rule, values, callback) =>
                  this.checkRePassword(rule, values, callback, this.state.value)
                }
              >
                <Input
                  htmlType="password"
                  size="large"
                  placeholder="确认密码"
                  style={styles.inputCol}
                  onKeyUp={this.onEnter}
                />
              </IceFormBinder>
              <IceFormError name="re" />
            </div>

            <div className="footer">
              <Button
                type="primary"
                onClick={this.handleSubmit}
                style={styles.submitBtn}
                size="large"
                isLoading={this.state.isLoading}
              >
                注 册
              </Button>
              <Link to="/user/login" style={styles.tips}>
                使用已有账户登录
              </Link>
            </div>
          </div>
        </IceFormBinderWrapper>
      </div>
    );
  }
}

const styles = {
  container: {
    width: '400px',
    padding: '40px',
    background: '#fff',
    borderRadius: '6px',
  },
  title: {
    margin: '0 0 40px',
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '28px',
    fontWeight: '500',
    textAlign: 'center',
  },
  formItem: {
    position: 'relative',
    marginBottom: '20px',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '12px',
    color: '#666',
  },
  inputCol: {
    width: '100%',
    paddingLeft: '20px',
  },
  submitBtn: {
    width: '100%',
  },
  tips: {
    marginTop: '20px',
    display: 'block',
    textAlign: 'center',
  },
};

export default UserRegister;
