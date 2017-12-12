import $ from '../../common/AjaxRequest';
import jquery from 'jquery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button, Input } from 'antd';
import moment from 'moment';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import AddSiteRelate from './AddSiteRelate';

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
    jdeCodeId: '',
    investigationJdeContractCode: '',
    mainJdeCode: '',
    showJde: true,
    relateCode: '',
    keyword: ''
}

class InvContractRelated extends React.Component {
    state= initState;
    loadData = (params = {}) =>{
        this.setState({
            loading: true,
        });
        const {searchParams, pagination, jdeCodeId} = this.state;
        const options = {
            url: `${API_URL.investigation.listJdeInvestigationSite}`,
            data: {
                offset: pagination.current,
                ...params,
                ...searchParams,
                limit: pagination.pageSize,
                jdeCodeId
            },
            dataType: 'json',
            doneResult: ( data => {
                const pagination = { ...this.state.pagination };
                pagination.total = data.totalCount;
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
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.jdeCodeId){
            console.log(nextProps.investigationJdeContractCode);
            this.setState({
                jdeCodeId: nextProps.jdeCodeId,
                investigationJdeContractCode: nextProps.investigationJdeContractCode
            },function(){
                this.loadData();
            })
        }
    }
    
    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: 'JDE项目号',
        dataIndex: 'investigationJdeContractCode',
        key: 'investigationJdeContractCode',
        sorter: true,
    }, {
        title: '中心编号',
        dataIndex: 'investigationSiteCode',
        key: 'investigationSiteCode',
        sorter: true,
    }, {
        title: '中心名称',
        dataIndex: 'investigationSiteName',
        key: 'investigationSiteName',
        sorter: true,
    }, {
        title: '操作',
        render: (text, record) => {
            return (
                <Popconfirm title={'确定要解除关联吗?'} onConfirm={this.del.bind(this, record.investigationJdeContractSiteId)} okText="确定" cancelText="取消">
                                <a >解除关联</a>
                </Popconfirm>
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
        this.setState({ "keyword" : value });
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
        const {searchParams, keyword} = this.state;
        const newSearch = {
            ...searchParams,
            keyword
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

    del = (jdeSiteId) => {
        this.setState({
            loading: true
        })
        const options = {
            url: `${API_URL.investigation.relieveJdeInvestigationSite}`,
            data: {
                jdeSiteId
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false
                })
                message.success("解除关联成功");
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


    returnRelate = () => {
        this.setState(initState)
      this.props.returnRelate();
    }

    addRelate = () => {
        const {jdeCodeId,investigationJdeContractCode} = this.state;
        this.AddSiteRelate.show(jdeCodeId,investigationJdeContractCode);
    }

    render() {
        const {loading, pagination, jdeData, data, addStatus, mainJdeCode, jdeCodeId, investigationJdeContractCode, keyword} = this.state;
        return (
            <div>
                    <div style={{textAlign:"center",padding:"10px",fontSize:"16px"}}>
                        中心关联记录({investigationJdeContractCode})
                    </div>
                    <div className="filter-bar bar2">
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">中心编号\中心名称</label>
                            <Input
                                onChange={this.handleChange}
                                value = {keyword}
                                //onKeyPress={this.enterSearch}
                            />
                        </div>
                        <div className="btn" style={{float: 'right'}}>
                            <Button type="primary" style={{float:'right'}} onClick={this.returnRelate}>返回</Button>
                            <Button type="primary" onClick={this.addRelate}>添加关联记录</Button>
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
                    <AddSiteRelate ref={el => { this.AddSiteRelate = el; }}
                                reload={this.reload}
                                mainJdeCode={mainJdeCode}
                    />
                </div>
        );
    }
}

export default InvContractRelated;

