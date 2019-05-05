import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Dialog, Message, Pagination, Table } from '@alifd/next';
import MailApi from '../../api/mail';

@withRouter
export default class Outbox extends Component {

  state = {
    current: 1,
    dataSource: [],
    selectedKeys: [],
    total: 0,
    isLoading: true,
  };

  componentWillMount() {
    MailApi.getTotalCount('outbox')
      .then((resp) => {
        const total = resp.data;
        this.getData(1, total);
        this.setState({ total });
      });
  }

  getData = (pageNo, total) => {
    this.setState({ isLoading: true });
    MailApi.getList('outbox', pageNo, total)
      .then((resp) => {
        this.setState({ dataSource: resp.data, isLoading: false });
      });
  };

  handlePagination = (current) => {
    this.setState({
      current,
    });
    this.getData(current, this.state.total);
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

  renderOpenMail = (id, index, mail) => {
    return <Link to={`/read/outbox/${mail.id}`}>{mail.subject}</Link>;
  };

  onRowChange = (selectedKeys) => {
    this.setState({
      selectedKeys,
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
          MailApi.del(this.state.selectedKeys, 'outbox')
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

  render() {
    const { dataSource, isLoading, total } = this.state;
    return (
      <div style={styles.tableContainer}>
        <div style={styles.tableFilter}>
          <div style={styles.title}>发件箱</div>
          <div style={styles.filter}>
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
        >
          <Table.Column width={250} title="收件人" dataIndex="to" />
          <Table.Column width={600} title="主题" dataIndex="subject" cell={this.renderOpenMail} />
          <Table.Column width={200} title="发送时间" dataIndex="sendTime" />
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
    background: '#28a745',
    width: '8px',
    height: '8px',
    borderRadius: '50px',
    marginRight: '4px',
  },
  stateText: {
    color: '#28a745',
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
