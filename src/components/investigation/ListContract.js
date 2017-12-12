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
import ExportUtil from '../../common/ExportUtil';

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
    investigationJdeContractCode: '',
    keyword:''
}

class InvContract extends React.Component {
    state= initState;

    loadData = (params = {}) =>{
        this.setState({
            loading: true,
        });
        const {searchParams, pagination} = this.state;
        const options = {
            url: `${API_URL.investigation.listJdeContractSite}`,
            data: {
                offset: pagination.current,
                ...params,
                ...searchParams,
                limit: pagination.pageSize,
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
        this.loadData();

    }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: 'JDE主项目号',
        dataIndex: 'mainInvestigationJdeContractCode',
        key: 'mainInvestigationJdeContractCode',
    }, {
        title: 'JDE项目号',
        dataIndex: 'childInvestigationJdeContractCode',
        key: 'childInvestigationJdeContractCode',
    }, {
        title: '合同额(元)',
        dataIndex: 'jdeContractAmount',
        key: 'jdeContractAmount',
        render: (value, row, index) => {
            const obj = {
              children: (row.jdeContractAmount && row.jdeContractAmount.toLocaleString()),
              props: {},
            };
            if(row.mergeFlag > 1){
                obj.props.rowSpan = row.mergeFlag;
            }
            if(row.mergeFlag == 0){
                obj.props.rowSpan = 0;
            }
            return obj;
        },
    }, {
        title: '合同开始时间',
        dataIndex: 'jdeContractStartTime',
        key: 'jdeContractStartTime',
        render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if(row.mergeFlag > 1){
                obj.props.rowSpan = row.mergeFlag;
            }
            if(row.mergeFlag == 0){
                obj.props.rowSpan = 0;
            }
            return obj;
        },
    }, {
        title: '合同结束时间',
        dataIndex: 'jdeContractEndTime',
        key: 'jdeContractEndTime',
        render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if(row.mergeFlag > 1){
                obj.props.rowSpan = row.mergeFlag;
            }
            if(row.mergeFlag == 0){
                obj.props.rowSpan = 0;
            }
            return obj;
        },
    }, {
        title: '合同是否签署完成',
        dataIndex: 'investigationJdeContractIsSigned',
        key: 'investigationJdeContractIsSigned',
        render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if(row.mergeFlag > 1){
                obj.props.rowSpan = row.mergeFlag;
            }
            if(row.mergeFlag == 0){
                obj.props.rowSpan = 0;
            }
            return obj;
        },
    }, {
        title: '中心编号',
        dataIndex: 'investigationSiteCode',
        key: 'investigationSiteCode',
    }, {
        title: '中心名称',
        dataIndex: 'investigationSiteName',
        key: 'investigationSiteName',
    }, ]

    getDataSource = () => {
        const dataResult = [];
        const {data, pagination, dateFormat} = this.state;
        data.map((dataItem, i) => {
                dataResult.push({
                    index: i + 1,
                    key: i,
                    ...dataItem,
                    jdeContractStartTime: dataItem.jdeContractStartTimeShow,
                    jdeContractEndTime: dataItem.jdeContractEndTimeShow,
                    investigationJdeContractIsSigned: dataItem.investigationJdeContractIsSignedShow
                });
        });
        return dataResult;
    };


    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ "jdeCode" : value });
      }
    
      handleKeyChange= (e) => {
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
        const {searchParams, jdeCode, keyword} = this.state;
        const newSearch = {
            ...searchParams,
            jdeCode: jdeCode,
            keyword
        };
        this.setState({
            searchParams: newSearch
        },function(){
            this.reload(newSearch,"search");
        });
    }

    export = () => {
        const { searchParams, pagination, sort, direction } = this.state;
        let url = `${API_URL.investigation.exportJdeContractSite}`;
        if(sort && direction){
            searchParams.sort = sort;
            searchParams.direction = direction;
        }
        ExportUtil.export(searchParams, pagination, url);
    }

    render() {
        const {loading, pagination, jdeData, data, addStatus, mainJdeCode} = this.state;
        return (
            <div className="content">
                <ContractSider/>
                <div className="main">
                    <div className="filter-bar bar2">
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">JDE项目号</label>
                            <Input
                                onChange={this.handleChange}
                                //onKeyPress={this.enterSearch}
                            />
                        </div>
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">中心编号\中心名称</label>
                            <Input
                                onChange={this.handleKeyChange}
                                //onKeyPress={this.enterSearch}
                            />
                        </div>
                        <div className="btn" style={{float: 'right'}}>
                            <Button type="primary" onClick={this.export}>导出</Button>
                            <Button type="primary" onClick={this.search}>搜索</Button>
                        </div>
                    </div>
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        loading={loading}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        scroll = {{x: "1100px"}}
                    />
                </div>
            </div>
        );
    }
}

export default InvContract;

