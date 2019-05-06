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

  getData = (pageNo) => {
    this.setState({ isLoading: true });
    MailApi.getList('recycle', pageNo)
      .then((resp) => {
        this.setState({ dataSource: resp.data, isLoading: false });
      });
  };

  componentWillMount() {
    MailApi.getTotalCount('recycle')
      .then((resp) => {
        this.getData(1);
        this.setState({ total: resp.data });
      });
  }

  handlePagination = (current) => {
    this.setState({
      current,
    });
    this.getData(current);
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

  onRowChange = (selectedKeys) => {
    this.setState({
      selectedKeys,
    });
  };

  renderOpenMail = (id, index, mail) => {
    return <Link to={`/read/recycle/${mail.id}`}>{mail.subject}</Link>;
  };

  handleMoveToInbox = () => {
    if (this.state.selectedKeys.length === 0) {
      Message.error('请选择邮件');
      return;
    }
    Dialog.confirm({
      title: '确定',
      content: '您确定要将所选邮件移回收件箱吗？',
      onOk: () => {
        return new Promise((resolve) => {
          MailApi.move(this.state.selectedKeys, 'recycle', 'inbox')
            .then(() => {
              Message.success('所选邮件已经移回收件箱');
              MailApi.getTotalCount('recycle')
                .then((resp) => {
                  this.setState({ total: resp.data });
                  this.getData(this.state.current);
                });
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
        MailApi.del(this.state.selectedKeys, 'recycle')
          .then(() => {
            Message.success('所选邮件已删除');
            MailApi.getTotalCount('recycle')
              .then((resp) => {
                this.setState({ total: resp.data });
                const { total, current } = this.state;
                if ((total % 10 === 0) && total / 10 < current) {
                  this.setState((prev) => {
                    return {
                      total: prev.total - 1,
                    };
                  });
                }
                this.getData(this.state.current);
              });
            this.setState({ selectedKeys: [] });
          });
      },
    });
  };

  render() {
    const { dataSource, isLoading, total } = this.state;
    return (
      <div style={styles.tableContainer}>
        <div style={styles.tableFilter}>
          <div style={styles.title}>回收站</div>
          <div style={styles.filter}>
            <Button style={styles.button} onClick={this.handleMoveToInbox}>
              移回收件箱
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
