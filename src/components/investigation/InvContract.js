import $ from '../../common/AjaxRequest';
import jquery from 'jquery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import ContractSider from './ContractSider';
import MainJdeSetting from './MainJdeSetting';

const initState = {
    sortParams: {},
    searchParams: {},
    data: [],
    loading: false,
    jdeData: {},
}

class InvContract extends React.Component {
    state= initState;

    loadData = (params = {}) =>{
        this.setState({
            loading: true,
        });
        const options = {
            url: `${API_URL.investigation.queryInvJde}`,
            data: {
                ...params
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    data: data.data,
                });
            }),
            errorResult: ( data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    componentDidMount(){
        this.loadData()
    }

    getColumns = () => [{
        title: '项目名称',
        dataIndex: 'investigationName',
        key: 'investigationName',
    }, {
        title: '项目编号',
        dataIndex: 'investigationCode',
        key: 'investigationCode',
    }, {
        title: 'JDE主项目号',
        dataIndex: 'jdeCode',
        key: 'jdeCode',
    }, {
        title: '操作',
        render: (text, record) => {
            const _reocrd = {...record};
            return (
                <span>
                    <a href="javascript:void(0)" onClick={() => this.setJdeCode(_reocrd)}>设置JDE主项目号</a>
                    {/*<span className="ant-divider" />*/}
                </span>
            );
        },
    }]

    getDataSource = () => {
        const resList = [];
        const { data } = this.state;
        data.key = "1";
        resList.push(data);
        return resList;
    };

    setJdeCode = (record) => {
        this.setState({
            jdeData: record
        })
        this.mainJdeSetting.show();
    }

    render() {
        const {loading, pagination, jdeData, data} = this.state;
        return (
            <div className="content">
                <ContractSider/>
                <div className="main" style={{height:"400px",paddingTop:"50px"}}>
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.investigationId}
                        loading={loading}
                        pagination={false}
                    />
                </div>
                <MainJdeSetting ref={el => { this.mainJdeSetting = el; }}
                                reload={this.loadData}
                                jdeData={jdeData}
                />
            </div>
        );
    }
}

export default InvContract;

