import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Dialog, Icon, Input, Message, Pagination, Table } from '@alifd/next';
import { FormBinder as IceFormBinder, FormBinderWrapper as IceFormBinderWrapper } from '@icedesign/form-binder';
import MailApi from '../../api/mail';

@withRouter
export default class Inbox extends Component {
  state = {
    current: 1,
    dataSource: [],
    selectedKeys: [],
    isLoading: true,
    total: 0,
    value: { search: '' },
  };

  getData = (pageNo) => {
    this.setState({ isLoading: true });
    MailApi.getList('inbox', pageNo)
      .then((resp) => {
        this.setState({ dataSource: resp.data, isLoading: false });
      });
  };

  componentWillMount() {
    this.handleReceive(1);
  }

  handleReceive = (pageNo) => {
    MailApi.getTotalCount('inbox')
      .then((resp) => {
        this.setState({ total: resp.data });
        this.getData(pageNo);
      });
  };

  handlePagination = (current) => {
    this.setState({
      current,
    });
    this.getData(current);
  };

  renderState = (value) => {
    const stateColor = ['#a73130', '#28a745', '#4ca5a7'];
    const stateText = ['未读', '已读', '已复'];
    return (
      <div style={styles.state}>
        <span style={{ ...styles.circle, background: stateColor[value] }} />
        <span style={{ color: stateColor[value] }}>{stateText[value]}</span>
      </div>
    );
  };

  onRowChange = (selectedKeys) => {
    this.setState({
      selectedKeys,
    });
  };

  renderOpenMail = (id, index, mail) => {
    return <Link to={`/read/inbox/${mail.id}`}>{mail.subject}</Link>;
  };

  handleMoveToRecycle = () => {
    if (this.state.selectedKeys.length === 0) {
      Message.error('请选择邮件');
      return;
    }
    Dialog.confirm({
      title: '确定',
      content: '您确定要将所选邮件移到回收站吗？',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.move(this.state.selectedKeys, 'inbox', 'recycle')
            .then(() => {
              Message.success('所选邮件已经移到回收站');
              this.handleReceive(this.state.current);
              this.setState({ selectedKeys: [] });
            })
            .then(() => {
              resolve(true);
            });
        });
      },
    });
  };

  handleDelete = () => {
    if (this.state.selectedKeys.length === 0) {
      Message.error('请选择邮件');
      return;
    }
    Dialog.confirm({
      title: '确定',
      content: '您确定要将所选邮件彻底删除吗？这一操作不可恢复',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.del(this.state.selectedKeys, 'inbox')
            .then(() => {
              Message.success('所选邮件已删除');
              this.handleReceive(this.state.current);
              this.setState({ selectedKeys: [] });
            })
            .then(() => {
              resolve(true);
            });
        });
      },
    });
  };

  handleSeen = () => {
    MailApi.setSeen(this.state.selectedKeys)
      .then(() => {
        Message.success('设置成功');
        this.handleReceive(this.state.current);
        this.setState({ selectedKeys: [] });
      });
  };

  handleSearch = () => {
    const search = this.state.value.search;
    if (search.length === 0) {
      this.handleReceive(this.state.current);
    } else {
      this.setState({ isLoading: true });
      MailApi.search('inbox', search)
        .then((resp) => {
          this.setState({ dataSource: resp.data, isLoading: false });
        });
    }
  };

  handleMarkAsSpam = () => {
    Dialog.confirm({
      title: '确定',
      content: '这些邮件是垃圾邮件吗？',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.move(this.state.selectedKeys, 'inbox', 'spam')
            .then(() => {
              Message.success('这些邮件已被移到垃圾箱');
              this.handleReceive(this.state.current);
              this.setState({ selectedKeys: [] });
            })
            .then(() => {
              resolve(true);
            });
          MailApi.markAs('inbox', this.state.selectedKeys, 'spam')
            .then();
        });
      },
    });
  };

  render() {
    const { dataSource, isLoading, total } = this.state;
    return (
      <div style={styles.tableContainer}>
        <div style={styles.tableFilter}>
          <div style={styles.title}>收件箱</div>
          <div style={styles.filter}>
            <Button type="secondary" style={styles.button} onClick={() => this.handleReceive(1)}>
              刷新
            </Button>
            <Button type="secondary" style={styles.button} onClick={this.handleSeen}>
              标为已读
            </Button>
            <Button style={styles.button} onClick={this.handleMoveToRecycle}>
              移到回收站
            </Button>
            <Button style={styles.button} onClick={this.handleMarkAsSpam}>
              标为垃圾邮件
            </Button>
            <Button style={styles.button} warning onClick={this.handleDelete}>
              彻底删除
            </Button>
            <IceFormBinderWrapper value={this.state.value}>
              <IceFormBinder name="search">
                <Input style={{ marginLeft: '20px' }}
                  onPressEnter={this.handleSearch}
                  placeholder="全文搜索"
                />
              </IceFormBinder>
            </IceFormBinderWrapper>
            <Button type="secondary" style={styles.button} onClick={this.handleSearch}><Icon type="search" /></Button>
          </div>
        </div>
        <Table
          dataSource={dataSource}
          onSort={this.handleSort}
          hasBorder={false}
          className="custom-table"
          loading={isLoading}
          rowSelection={{
            selectedRowKeys: this.state.selectedKeys,
            onChange: this.onRowChange,
          }}
          primaryKey="id"
        >
          <Table.Column width={250} title="发件人" dataIndex="from" />
          <Table.Column width={600} title="主题" dataIndex="subject" cell={this.renderOpenMail} />
          <Table.Column width={200} title="接收时间" dataIndex="receiveTime" />
          <Table.Column width={100} title="状态" dataIndex="state" cell={this.renderState} />
        </Table>
        <Pagination
          style={styles.pagination}
          current={this.state.current}
          onChange={this.handlePagination}
          total={total}
        />
      </div>
    );
  }
}

const styles = {
  tableContainer: {
    background: '#fff',
    paddingBottom: '10px',
  },
  pagination: {
    margin: '20px',
    textAlign: 'right',
  },
  editIcon: {
    color: '#999',
    cursor: 'pointer',
  },
  circle: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50px',
    marginRight: '4px',
  },
  tableFilter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    marginBottom: '20px',
    background: '#fff',
  },
  title: {
    height: '20px',
    lineHeight: '20px',
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
    paddingLeft: '12px',
    borderLeft: '4px solid #666',
  },
  filter: {
    display: 'flex',
  },
  button: {
    marginLeft: '20px',
  },
};
