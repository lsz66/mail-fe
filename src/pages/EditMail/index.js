import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import IceContainer from '@icedesign/container';
import { Button, Dialog, Form, Grid, Input, Message } from '@alifd/next';
import {
  FormBinder as IceFormBinder,
  FormBinderWrapper as IceFormBinderWrapper,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import MailApi from '../../api/mail';
import DraftApi from '../../api/draft';

const { Row, Col } = Grid;
const FormItem = Form.Item;

@withRouter
export default class ContentEditor extends Component {
  static displayName = 'ContentEditor';

  state = {
    value: {},
    sending: false,
  };

  componentWillMount() {
    DraftApi.getById(location.hash.substring(7))
      .then((resp) => {
        const { id, userId, to, subject, text, reply } = resp.data;
        this.setState({
          value: { id, userId, to, subject, text, reply },
        });
      });
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
          DraftApi.del(location.hash.substring(7))
            .then(() => {
            });
          this.props.history.push('/success');
        })
        .catch(() => {
          this.setState({ sending: false });
          Message.error('发送失败，可能是服务器出错');
        });
    });
  };

  handleSave = () => {
    DraftApi.update(this.state.value)
      .then(() => {
        Message.success('保存成功');
        this.props.history.push('/draftbox');
      });
  };

  handleExit = () => {
    Dialog.confirm({
      title: '确定',
      content: '您确定要退出吗？修改的部分将会被丢弃',
      onOk: () => this.props.history.push('/draftbox'),
    });
  };

  handleDelete = () => {
    Dialog.confirm({
      title: '确定',
      content: '您确定要删除这份草稿吗？',
      onOk: () => {
        DraftApi.del(location.hash.substring(7))
          .then(() => {
            Message.success('删除成功');
            this.props.history.push('/draftbox');
          });
      },
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
            <h2 style={styles.title}>编辑邮件</h2>
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
                    initialContent={this.state.value.text}
                    height={300}
                    contentFormat="html"
                  />
                </IceFormBinder>
              </FormItem>
              <FormItem>
                <Button type="primary"
                  onClick={this.handleSubmit}
                  loading={this.state.sending}
                  style={styles.buttons}
                >
                  发送
                </Button>
                <Button onClick={this.handleSave} style={styles.buttons}>
                  保存
                </Button>
                <Button type="primary" onClick={this.handleExit} warning style={styles.buttons}>
                  不保存退出
                </Button>
                <Button type="primary" onClick={this.handleDelete} warning style={styles.buttons}>
                  删除并退出
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
  buttons: {
    margin: '10px',
  },
};
