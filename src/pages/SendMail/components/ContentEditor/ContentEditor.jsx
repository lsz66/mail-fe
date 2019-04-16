import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Button, Form, Grid, Input, Message } from '@alifd/next';
import {
  FormBinder as IceFormBinder,
  FormBinderWrapper as IceFormBinderWrapper,
  FormError as IceFormError,
} from '@icedesign/form-binder';

import RichEditor from './RichEditor';

const { Row, Col } = Grid;
const FormItem = Form.Item;

export default class ContentEditor extends Component {
  static displayName = 'ContentEditor';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        title: '',
        desc: '',
        author: '',
        body: null,
        cats: [],
      },
    };
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };

  handleSubmit = () => {
    this.postForm.validateAll((errors, values) => {
      console.log('errors', errors, 'values', values);
      if (errors) {
        return false;
      }

      Message.success('提交成功');
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
                    <IceFormBinder name="title" required message="标题必填">
                      <Input placeholder="这里填写文档标题" />
                    </IceFormBinder>
                    <IceFormError name="title" />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                  <FormItem label="主题" required>
                    <IceFormBinder
                      name="author"
                      required
                      message="作者信息必填"
                    >
                      <Input placeholder="填写作者名称" />
                    </IceFormBinder>
                    <IceFormError name="author" />
                  </FormItem>
                </Col>
              </Row>
              <FormItem label="正文" required>
                <IceFormBinder name="body">
                  <RichEditor />
                </IceFormBinder>
              </FormItem>
              <FormItem label=" ">
                <Button type="primary" onClick={this.handleSubmit}>
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
