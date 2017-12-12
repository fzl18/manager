import $ from '../../common/AjaxRequest';
import jquery from 'jquery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button, Input } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';



class SiteList extends React.Component {
    state = {
        data: [],
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
        searchSiteCode: '',
        searchSiteName: '',
        dataList: [],
        tableheader:[],
        investigationJdeContractCode: '',
    };

    getheader = () => {      //拿表头      
        const {selInvId} = this.props.match.params;
        const options ={
            method: 'POST',
            url: API_URL.investigation.getSiteHeader,
            data: {
                investigationId:selInvId,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const { headerList } = data.data;
                    this.setState({
                        tableheader: headerList,                        
                    });
                    this.loadInvSiteList();
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }

    loadInvSiteList = (params) => {
        const {searchSiteCode, searchSiteName, investigationJdeContractCode} = this.state;
        const { selRole, selInvId } = this.props.match.params;
        this.setState({loading: true,});
        const options = {
            url: `${API_URL.site.querySiteDetailList}`,
            data: {
                siteCode: searchSiteCode,
                siteName: searchSiteName,
                investigationId: selInvId,
                roleCode: selRole,
                ...params,
                investigationJdeContractCode: investigationJdeContractCode,
                transFlag: 1,
            },
            dataType: 'json',
            doneResult: ( data => {
                    const { invSite } = data.data;
                    const pagination = {...this.state.pagination};
                    pagination.total = invSite.totalCount;
                    this.setState({
                        loading: false,
                        dataList: invSite.datas,
                        pagination,
                    });
                }
            ),
        };
        $.sendRequest(options);
    };

    getColumns = () => {
        const {tableheader} = this.state
        const columnNames = [];
        columnNames.push({
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            fixed: 'left',
            width: 40,
        });
        columnNames.push({
            title: '中心编号',
            dataIndex: 'investigationSiteCode',
            key: 'investigationSiteCode',
            sorter: true,
            sortType: 'COMMON',
            fixed: 'left',
            width:80,
            render: (text, record) => {
                return (
                    <span>
                    {
                        record.allowedEnter && <a href="javascript:void(0)" onClick={() => this.selectSite(record.investigationSiteId, record.investigationSiteName, record.investigationSiteCode)}>{record.investigationSiteCode}</a>
                    }
                    {
                        !record.allowedEnter && record.investigationSiteCode
                    }
                    </span>
                );
            },
        });
        columnNames.push({
            title: '中心名称',
            dataIndex: 'investigationSiteName',
            key: 'investigationSiteName',
            sorter: true,
            sortType: 'COMMON',
            fixed: 'left',
            width:200,
        });

        tableheader.map((d,i)=>{
            if(i>1){
                if(d.type == 'STATISTIC' || d.type == 'PLAN'){
                    columnNames.push({
                        title: d.displayName,
                        dataIndex: d.field + d.type,
                        key: d.field + d.type,
                        sorter: d.sortable,
                        sortType: d.type,
                        sort : d.field,
                    })
                }
                else{
                    columnNames.push({
                        title: d.displayName,
                        dataIndex: d.field,
                        key: d.field,
                        sorter: d.sortable,
                        sortType: d.type,
                        sort : d.field,
                    })
                }
                
            }
            
        })



        return columnNames;
    };

    /* 废弃 */
    /*getDataSource = () => {
        const sites = [];
        const {dataList, pagination,} = this.state;
        dataList.map((site, i) => {
            let chargePerson = {
                userName: '',
                doctorPosition: '',
                mobile: '',
                telephone: '',
                email: '',
            };
            if (site.chargePerson != null) {
                chargePerson = site.chargePerson;
            }
            sites.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                investigationSiteId: site.investigationSiteId,
                investigationSiteName: site.investigationSiteName,
                investigationSiteCode: site.investigationSiteCode,
                allowedEnter: site.allowedEnter,
            });
        });
        return sites;
    };*/


    tableData = () => {
        const {dataList, pagination,tableheader} = this.state;
        let headers = tableheader; 
        let invList = dataList; 
        let dataSource = []; 
        invList.map((inv, i) =>{
            let row = {index: i+1, investigationId: inv.investigationId, investigationSiteId: inv.investigationSiteId, allowedEnter: inv.allowedEnter}; 
            headers.map((header,j) =>{
                let value; 
                let field = header.field;
                if(header.type == 'STATISTIC' || header.type == 'PLAN'){
                    field = field + header.type;
                }
                inv.fields.map((invField,k) =>{
                    if(invField.field == header.field){
                        value = invField.value;
                    }
                });
                inv.planFields.map((invField,k) =>{
                    if(invField.field == header.field 
                    && invField.type == header.type){
                        value = invField.value;
                    }
                });
                inv.roleFields.map((invField,k) =>{
                    if(invField.field == header.field){
                        value = invField.value;
                    }
                });
                inv.executeFields.map((invField,k) =>{
                    if(invField.field == header.field){
                        value = invField.value;
                    }
                });
                row[field] = value;
            });
            dataSource.push(row);
        })
        console.log(dataSource)
        return dataSource;
    }

    /**
     * 点击“中心汇总”按钮
     */
    clickSiteSummary = () => {
        const { selRole, selInvId } = this.props.match.params;
        sessionStorage.invId = selInvId;
        sessionStorage.curRole = selRole;
        sessionStorage.investigationSiteName = '中心汇总';
        location.href = `./#/summary/view/cumInfRan`;
    };

    /**
     * 点击某个项目时，获取角色列表，判断是单角色还是多角色
     */
    selectSite = (investigationSiteId, investigationSiteName, investigationSiteCode) => {
        const { selRole, selInvId } = this.props.match.params;

        sessionStorage.invId = selInvId;
        sessionStorage.siteId = investigationSiteId;
        sessionStorage.curRole = selRole;
        sessionStorage.investigationSiteCode = investigationSiteCode;
        sessionStorage.investigationSiteName = investigationSiteName;
        location.href = `./#/summary/view/cumInfRan`;
    }

    handleTableChange = (pagination, filters, sorter) => {
        let direction,sortType, sort =  sorter.field;
        if (!jquery.isEmptyObject(sorter) && sorter.column) {
            sortType = sorter.column.sortType;
            if(sorter.column.sort)
            sort = sorter.column.sort;
        }
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });

        if (sorter.order === 'descend' ) {
            direction = 'DESC';
        } else {
            direction = 'ASC';
        }

        if(sorter.column)
        this.loadInvSiteList({
            limit: pagination.pageSize,
            offset: pagination.current,
            direction,
            sort,
            sortType,
            ...filters,
        });
    };

    search = () => {
        this.loadInvSiteList();
    };

    /**
     * 输入中心编号搜索内容
     */
    onChangeSiteCode = e => {
        this.setState({searchSiteCode: e.target.value});
    };

    /**
     * 输入中心名称搜索内容
     */
    onChangeSiteName = e => {
        this.setState({searchSiteName: e.target.value});
    };

    onChangeJde = e => {
        this.setState({investigationJdeContractCode: e.target.value});
    };

    componentDidMount() {
        //const {selInvId } = this.props.match.params;
        //sessionStorage.invId = selInvId       
        this.getheader()
        
    }
  
    render() {
        const { loading, pagination, searchSiteCode, searchSiteName, investigationJdeContractCode } = this.state;
        const { selRole, selInvId } = this.props.match.params;
        const hasSiteSummary = selRole == "PM" || selRole == "CRCM" || selRole == "BO" || selRole == "BD" || selRole == "BDO";

        return (
            <div className="content-2 full">
                {/*<h1>临床项目》研究中心  进入列表角色={selRole}  进入列表项目={selInvId}</h1>*/}
                <div className='filter-bar'>
                    {
                        hasSiteSummary && <Button type="primary" onClick={this.clickSiteSummary}>中心汇总</Button>
                    }
                    <div className="form-item">
                        <label className="ui-label">中心编号</label>
                        <Input
                            value={searchSiteCode}
                            onChange={this.onChangeSiteCode}
                        />
                    </div>
                    <div className="form-item">
                        <label className="ui-label"> 中心名称</label>
                        <Input
                            value={searchSiteName}
                            onChange={this.onChangeSiteName}
                        />
                    </div>
                    <div className="form-item">
                        <label className="ui-label"> JDE项目号</label>
                        <Input
                            value={investigationJdeContractCode}
                            onChange={this.onChangeJde}
                        />
                    </div>
                    <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                </div>
                <div className="main-content">
                        <Table
                            columns={this.getColumns()}                            
                            dataSource={this.tableData()}
                            rowKey={record => record.investigationSiteId}
                            loading={loading}
                            scroll={{x:3000}}
                            onChange={this.handleTableChange}
                            pagination={ pagination }
                            bordered={true}
                        />
                    </div>
            </div>
        );
    }
}

export default SiteList;