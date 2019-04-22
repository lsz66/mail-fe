import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Pagination, Table } from '@alifd/next';
import MailApi from '../../api/mail';

@withRouter
export default class Outbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      dataSource: [],
      selectedKeys: [],
      isLoading: true,
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ isLoading: true });
    MailApi.getList('outbox')
      .then((resp) => {
        this.setState({ dataSource: resp.data, isLoading: false });
      });
  };

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

  renderOpenMail = (id, index, mail) => {
    return <Link to={`/read/outbox/${mail.id}`}>{mail.subject}</Link>;
  };

  onRowChange = (selectedKeys) => {
    this.setState({
      selectedKeys,
    });
  };

  render() {
    const { dataSource, isLoading } = this.state;
    return (
      <div style={styles.tableContainer}>
        <div style={styles.tableFilter}>
          <div style={styles.title}>发件箱</div>
          <div style={styles.filter}>
            <Button type="primary" style={styles.button} onClick={this.getData}>
              刷新
            </Button>
            <Button style={styles.button} warning>
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
