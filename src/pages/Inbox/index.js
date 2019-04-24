import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Dialog, Icon, Input, Message, Pagination, Table } from '@alifd/next';
import { FormBinder as IceFormBinder, FormBinderWrapper as IceFormBinderWrapper } from '@icedesign/form-binder';
import MailApi from '../../api/mail';

@withRouter
export default class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      dataSource: [],
      selectedKeys: [],
      isLoading: true,
      value: { search: '' },
    };
  }

  getData = () => {
    this.setState({ isLoading: true });
    MailApi.getList('inbox')
      .then((resp) => {
        this.setState({ dataSource: resp.data, isLoading: false });
      });
  };

  componentWillMount() {
    this.getData();
  }

  handlePagination = (current) => {
    this.setState({
      current,
    });
  };

  handleSort = (dataIndex, order) => {
    const dataSource = this.state.dataSource.sort((a, b) => {
      const result = a[dataIndex] - b[dataIndex];
      if (order === 'asc') {
        return result > 0 ? 1 : -1;
      }
      return result > 0 ? -1 : 1;
    });

    this.setState({
      dataSource,
    });
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
              this.getData();
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
              this.getData();
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
        this.getData();
        this.setState({ selectedKeys: [] });
      });
  };

  handleSearch = () => {
    const search = this.state.value.search;
    if (search.length === 0) {
      this.getData();
    } else {
      this.setState({ isLoading: true });
      MailApi.search('inbox', search)
        .then((resp) => {
          this.setState({ dataSource: resp.data, isLoading: false });
        });
    }
  };

  render() {
    const { dataSource, isLoading } = this.state;
    return (
      <div style={styles.tableContainer}>
        <div style={styles.tableFilter}>
          <div style={styles.title}>收件箱</div>
          <div style={styles.filter}>
            <Button type="secondary" style={styles.button} onClick={this.getData}>
              刷新
            </Button>
            <Button type="secondary" style={styles.button} onClick={this.handleSeen}>
              标为已读
            </Button>
            <Button style={styles.button} onClick={this.handleMoveToRecycle}>
              移到回收站
            </Button>
            <Button style={styles.button} onClick={this.handleMoveToRecycle}>
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
          total={1}
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
