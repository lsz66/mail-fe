import React, { Component } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import IceContainer from '@icedesign/container';
import { Button, Form, Grid, Input, Message } from '@alifd/next';
import {
  FormBinder as IceFormBinder,
  FormBinderWrapper as IceFormBinderWrapper,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import MailApi from '../../../../api/mail';

const { Row, Col } = Grid;
const FormItem = Form.Item;

export default class ContentEditor extends Component {
  static displayName = 'ContentEditor';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {},
      sending: false,
    };
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  handleSubmit = () => {
    this.postForm.validateAll((errors, values) => {
      if (errors) {
        return false;
      }
      this.setState({ sending: true });
      MailApi.send(values)
        .then(() => {
          this.setState({ sending: false });
          Message.success('发送成功');
        })
        .catch(() => {
          Message.error('发送失败，可能是服务器出错');
        });
    });
  };

  render() {
    return (
      <div className="content-editor">
        <IceFormBinderWrapper
          ref={(refInstance) => {
            this.postForm = refInstance;
          }}
          value={this.state.value}
          onChange={this.formChange}
        >
          <IceContainer>
            <h2 style={styles.title}>写邮件</h2>
            <Form labelAlign="top" style={styles.form}>
              <Row>
                <Col span="24">
                  <FormItem label="收件人" required>
                    <IceFormBinder name="to" required message="收件人必填">
                      <Input placeholder="请填写收件人" />
                    </IceFormBinder>
                    <IceFormError name="to" />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                  <FormItem label="主题">
                    <IceFormBinder
                      name="subject"
                    >
                      <Input placeholder="请填写邮件主题" />
                    </IceFormBinder>
                    <IceFormError name="subject" />
                  </FormItem>
                </Col>
              </Row>
              <FormItem label="正文">
                <IceFormBinder name="text">
                  <BraftEditor
                    height={300}
                    contentFormat="html"
                    value="<p></p>"
                    onChange={this.handleText}
                  />
                </IceFormBinder>
              </FormItem>
              <FormItem label=" ">
                <Button type="primary" onClick={this.handleSubmit} loading={this.state.sending}>
                  发送
                </Button>
              </FormItem>
            </Form>
          </IceContainer>
        </IceFormBinderWrapper>
      </div>
    );
  }
}

const styles = {
  title: {
    margin: '0px 0px 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    color: '#333',
  },
  form: {
    marginTop: 30,
  },
  cats: {
    width: '100%',
  },
};
