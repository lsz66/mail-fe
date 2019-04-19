import React, { Component } from 'react';
import { Balloon, Button, Icon, Pagination, Table } from '@alifd/next';
import MailApi from '../../api/mail';

export default class SpamBox extends Component {
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
    MailApi.getList('spam')
      .then((resp) => {
        console.log(resp.data);
        this.setState({ dataSource: resp.data, isLoading: false });
      });
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

  renderCatrgory = (value) => {
    return (
      <Balloon
        align="lt"
        trigger={<div style={{ margin: '5px' }}>{value}</div>}
        closable={false}
        style={{ lineHeight: '24px' }}
      >
        皮肤科属于外科，主要治疗各种皮肤病，常见皮肤病有牛皮癣 、 疱疹
        、酒渣鼻等
      </Balloon>
    );
  };

  renderState = (value) => {
    return (
      <div style={styles.state}>
        <span style={styles.circle} />
        <span style={styles.stateText}>{value}</span>
      </div>
    );
  };

  renderOper = () => {
    return (
      <div style={styles.oper}>
        <Icon type="edit" size="small" style={styles.editIcon} />
      </div>
    );
  };

  onRowChange = (selectedKeys) => {
    console.log(selectedKeys);
    this.setState({
      selectedKeys,
    });
  };

  render() {
    const { dataSource, isLoading } = this.state;
    return (
      <div style={styles.tableContainer}>
        <div style={styles.tableFilter}>
          <div style={styles.title}>垃圾箱</div>
          <div style={styles.filter}>
            <Button type="primary" style={styles.button}>
              刷新
            </Button>
            <Button type="primary" style={styles.button} warning>
              删除
            </Button>
            <Button type="primary" style={styles.button}>
              标为普通邮件
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
          <Table.Column width={250} title="发件人" dataIndex="from" />
          <Table.Column width={600} title="主题" dataIndex="subject" />
          <Table.Column width={200} title="接收时间" dataIndex="receiveTime" />
          <Table.Column width={200} title="阅读时间" dataIndex="readTime" />
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
