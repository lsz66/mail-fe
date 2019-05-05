import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Dialog, Message, Pagination, Table } from '@alifd/next';
import MailApi from '../../api/mail';

@withRouter
export default class Inbox extends Component {

  state = {
    current: 1,
    total: 0,
    dataSource: [],
    selectedKeys: [],
    isLoading: true,
  };

  getData = (pageNo, total) => {
    this.setState({ isLoading: true });
    MailApi.getList('spam', pageNo, total)
      .then((resp) => {
        this.setState({ dataSource: resp.data, isLoading: false });
      });
  };

  componentWillMount() {
    MailApi.getTotalCount('spam')
      .then((resp) => {
        const total = resp.data;
        this.getData(1, total);
        this.setState({ total });
      });
  }

  handlePagination = (current) => {
    this.setState({
      current,
    });
    this.getData(current, this.state.total);
  };

  onRowChange = (selectedKeys) => {
    this.setState({
      selectedKeys,
    });
  };

  renderOpenMail = (id, index, mail) => {
    return <Link to={`/read/spam/${mail.id}`}>{mail.subject}</Link>;
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

  handleMarkAsHam = () => {
    Dialog.confirm({
      title: '确定',
      content: '确定要把这些邮件标记为正常邮件吗？',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.move(this.state.selectedKeys, 'spam', 'inbox')
            .then(() => {
              Message.success('这些邮件已被移回收件箱');
              this.getData();
            })
            .then(() => {
              resolve(true);
            });
          MailApi.markAs('spam', this.state.selectedKeys, 'ham')
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
          <div style={styles.title}>垃圾箱</div>
          <div style={styles.filter}>
            <Button style={styles.button} onClick={this.handleMarkAsHam}>
              标为普通邮件
            </Button>
            <Button style={styles.button} warning onClick={this.handleDelete}>
              彻底删除
            </Button>
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
