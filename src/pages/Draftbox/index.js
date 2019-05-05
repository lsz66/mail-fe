import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dialog, Message, Table } from '@alifd/next';
import DraftApi from '../../api/draft';

export default class DraftBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      dataSource: [],
      selectedKeys: [],
      isLoading: true,
    };
  }

  getData = () => {
    DraftApi.getList()
      .then((resp) => {
        console.log(resp.data);
        this.setState({ dataSource: resp.data, isLoading: false });
      });
  };

  componentWillMount() {
    this.getData();
  }

  onRowChange = (selectedKeys) => {
    console.log(selectedKeys);
    this.setState({
      selectedKeys,
    });
  };

  renderOpenMail = (id, index, draft) => {
    return <Link to={`/edit/${draft.id}`}>{draft.subject}</Link>;
  };

  handleDelete = () => {
    if (this.state.selectedKeys.length === 0) {
      Message.error('请选择邮件');
      return;
    }
    Dialog.confirm({
      title: '确定',
      content: '您确定要将所选稿件彻底删除吗？这一操作不可恢复',
      onOk: () => {
        return new Promise((resolve) => {
          DraftApi.delByList(this.state.selectedKeys)
            .then(() => {
              Message.success('所选稿件已删除');
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
    const { dataSource, isLoading } = this.state;
    return (
      <div style={styles.tableContainer}>
        <div style={styles.tableFilter}>
          <div style={styles.title}>草稿箱</div>
          <div style={styles.filter}>
            <Button type="primary" style={styles.button}>
              刷新
            </Button>
            <Button type="primary" style={styles.button} warning onClick={this.handleDelete}>
              删除
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
          <Table.Column width={250} title="发送给" dataIndex="to" />
          <Table.Column width={600} title="主题" dataIndex="subject" cell={this.renderOpenMail} />
          <Table.Column width={200} title="保存时间" dataIndex="lastModifyTime" />
        </Table>
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
