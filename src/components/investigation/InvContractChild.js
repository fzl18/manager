import $ from '../../common/AjaxRequest';
import jquery from 'jquery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button, Input } from 'antd';
import moment from 'moment';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import ContractSider from './ContractSider';
import ChildJde from './ChildJde';
import InvContractChildRelated from './InvContractChildRelated';

const initState = {
    sortParams: {},
    searchParams: {},
    data: [],
    loading: false,
    jdeData: {},
    addStatus: false,
    pagination:{
        pageSize: 15,
        current: 1,
    },
    dateFormat: "YYYY-MM-DD",
    jdeCode: '',
    mainJdeCode: '',
    showJde: true,
    relateCode: '',
    investigationJdeContractId: '',
    investigationJdeContractCode: ''
}

class InvContract extends React.Component {
    state= initState;

    getMainJde = (params = {}) =>{
        const options = {
            url: `${API_URL.investigation.queryInvJde}`,
            data: {
                ...params
            },
            dataType: 'json',
            doneResult: ( data => {
                if(data.data.jdeCode){
                    this.setState({
                        addStatus: true,
                        mainJdeCode: data.data.jdeCode
                    });
                }
            }),
            errorResult: ( data => {
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    loadData = (params = {}) =>{
        this.setState({
            loading: true,
        });
        const {searchParams, pagination} = this.state;
        const options = {
            url: `${API_URL.investigation.listChildrenJde}`,
            data: {
                offset: pagination.current,
                ...params,
                ...searchParams,
                limit: pagination.pageSize - 1,
            },
            dataType: 'json',
            doneResult: ( data => {
                const pagination = { ...this.state.pagination };
                let ct = Number((data.totalCount / (pagination.pageSize -1)).toFixed(0)) + (data.totalCount % (pagination.pageSize -1) > 0 ? 1 : 0);
                pagination.total = data.totalCount + ct;
                this.setState({
                    loading: false,
                    data: data.datas,
                    pagination,
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
        this.getMainJde();
        this.loadData();

    }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: 'JDE项目号',
        dataIndex: 'investigationJdeContractCode',
        key: 'jdeCode',
        sorter: true,
    }, {
        title: '合同额(元)',
        dataIndex: 'jdeContractAmount',
        key: 'jdeContractAmount',
        sorter: true,
        render:(text,record) => {
            return (record.jdeContractAmount.toLocaleString())
        }
    }, {
        title: '合同开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: true,
    }, {
        title: '合同结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        sorter: true,
    }, {
        title: '合同是否签署完成',
        dataIndex: 'investigationJdeContractIsSigned',
        key: 'investigationJdeContractIsSigned',
        sorter: true,
        render:(text,record) => {
            return (record.investigationJdeContractId > 0 ? record.investigationJdeContractIsSigned == "0" ? "否" : "是" : null)
        }
    }, {
        title: '操作',
        render: (text, record) => {
            const _reocrd = {...record};
            return (
                record.investigationJdeContractId > 0 ?
                <span>
                    <a onClick={() => this.showRelate(_reocrd)}>中心关联</a>
                    <span className="ant-divider" />
                    <a onClick={() => this.editJde("edit",_reocrd)}>修改</a>
                    <span className="ant-divider" />
                    <Popconfirm title={'确定要删除吗?'} onConfirm={this.del.bind(this, record.investigationJdeContractId)} okText="确定" cancelText="取消">
                                <a >删除</a>
                    </Popconfirm>
                </span>
                :
                null
            );
        },
    }]

    getDataSource = () => {
        const dataResult = [];
        const {data, pagination, dateFormat} = this.state;
        data.map((dataItem, i) => {
            if(dataItem.investigationJdeContractId < 0){
                dataResult.push({
                    index: "合计",
                    jdeContractAmount: dataItem.jdeContractAmount,
                });
            }else{
                dataResult.push({
                    index: i + 1,
                    ...dataItem,
                    startTime: moment(dataItem.startTime).format(dateFormat),
                    endTime: moment(dataItem.endTime).format(dateFormat),
                });
            }
            
        });
        return dataResult;
    };


    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ "jdeCode" : value });
      }
    
    handleTableChange = (pagination, filters, sorter) => {
        let sortType,
        direction,
        sort = sort = sorter.field;
        const pager = { ...this.state.pagination };
        if (pager.current == pagination.current){
        pager.current = 1;
            //排序则页码为1
        } else {
        pager.current = pagination.current;
            //获取当前页
        }
        if (!jquery.isEmptyObject(sorter) && sorter.column) {
            sortType = sorter.column.sortType;
        }
        if (sorter.order === 'descend') {
            direction = 'DESC';
        } else {
            direction = 'ASC';
        }
        this.setState({
            pagination: pager,//设置新的分页信息
            sortParams: {//设置排序信息
                direction,
                sort,
                sortType
            }
        });
        
        this.loadData({
            limit: pager.pageSize,
            offset: pager.current,
            direction,
            sort,
            sortType,
            ...this.state.searchParams,
            ...filters,
        });
    }
    
    reset = () =>{
        const pagination = { ...this.state.pagination, current: 1 };
        this.setState({
            pagination,
            searchParams: {}
            },function(){
            this.loadData();
        });
    }

    reload = (params = {}, type) => {
        const newParams = {};
        if(type == "search"){
            newParams.searchParams = params;
            newParams.pagination = { ...this.state.pagination, current: 1 };
        }
        this.setState({
            ...newParams
        },function(){
            const { pagination,searchParams,sortParams } = this.state;
            this.loadData({
                offset: pagination.current,
                ...sortParams,
                ...searchParams,
            });
        }) 
    }
    
    search = () => {
        const {searchParams, jdeCode} = this.state;
        const newSearch = {
            ...searchParams,
            jdeCode
        };
        this.setState({
            searchParams: newSearch
        },function(){
            this.reload(newSearch,"search");
        });
    }

    addJde = () => {
        this.ChildJde.show("add");
    }

    editJde = (type,record) => {
        this.ChildJde.show(type,record);
    }

    del = (jdeCodeId) => {
        this.setState({
            loading: true
        })
        const options = {
            url: `${API_URL.investigation.deleteChildrenJde}`,
            data: {
                jdeCodeId
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false
                })
                message.success("删除成功");
                this.reload();
            }),
            errorResult: d => {
                this.setState({
                    loading: false
                })
            }
        };
        AjaxRequest.sendRequest(options);
    };


    showRelate = (record = {}) => {
        const {investigationJdeContractId, investigationJdeContractCode} = record;
        console.log(record)
        this.setState({
            showJde: false,
            investigationJdeContractId,
            investigationJdeContractCode: investigationJdeContractCode
        })

    }

    returnRelate = () => {
        this.setState({
            showJde: true
        })
    }

    render() {
        const {loading, pagination, jdeData, data, addStatus, mainJdeCode, showJde, investigationJdeContractId, investigationJdeContractCode} = this.state;
        return (
            <div className="content">
                <ContractSider/>
                <div className="main" style={{minHeight:"400px",display: showJde ? "block" : "none"}}>
                    <div className="filter-bar bar2">
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">JDE项目号</label>
                            <Input
                                onChange={this.handleChange}
                                onKeyPress={this.enterSearch}
                            />
                        </div>
                        <div className="btn" style={{float: 'right'}}>
                            
                            
                            <Button type="primary" onClick={this.addJde} disabled={!addStatus}>添加JDE项目号</Button>
                            <Button type="primary" onClick={this.search}>搜索</Button>
                        </div>
                    </div>
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.investigationSiteCode}
                        loading={loading}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                    />
                </div>
                
                <div className="main" style={{minHeight:"400px",display: !showJde ? "block" : "none"}}>
                    <InvContractChildRelated 
                        returnRelate={this.returnRelate}
                        jdeCodeId={investigationJdeContractId}
                        investigationJdeContractCode={investigationJdeContractCode}
                    />
                    {/* <div style={{textAlign:"center"}}>
                        中心关联记录（244444444）
                    </div>
                    <div className="filter-bar bar2">
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">中心编号\中心名称</label>
                            <Input
                                onChange={this.handleChangeSite}
                                //onKeyPress={this.enterSearch}
                            />
                        </div>
                        <div className="btn" style={{float: 'right'}}>
                            
                            <Button type="primary" onClick={this.searchSite}>搜索</Button>
                            <Button type="primary" onClick={this.addRelate}>添加关联记录</Button>
                            <Button type="primary" onClick={this.returnRelate}>返回</Button>
                        </div>
                    </div> */}
                    {/* <Table
                        columns={this.getSiteColumns()}
                        dataSource={this.getSiteDataSource()}
                        rowKey={record => record.investigationSiteCode}
                        loading={loading}
                        pagination={pagination}
                        onChange={this.handleSiteTableChange}
                    /> */}
                </div>
                <ChildJde ref={el => { this.ChildJde = el; }}
                                reload={this.reload}
                                mainJdeCode={mainJdeCode}
                />
            </div>
        );
    }
}

export default InvContract;

