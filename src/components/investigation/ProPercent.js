import $ from '../../common/AjaxRequest';
import jquery from 'jquery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import Filter from './Filter';
import PreviewModal from './PreviewModal';
import DelegateUser from './DelegateUser';
import ChangeUser from './ChangeUser';
import RoleSelectionModal from './RoleSelectionModal';
import ProjectPercent from '../sumTotal/ProjectPercent';
// import './style/list.less';


class ProPercent extends React.Component {
    state = {
        sortParams: {},
        searchParams: {},
        data: [],
        planList: [],
        tableheader:[],
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
        isStarted: 1,    // 当用户角色是总监时，用来处理已启动和未启动，默认应该为已启动
        // invId:'',
        investigationCode:'',
        investigationName:'',
        visible:false,
    };

    getheader = (isStartedParam) => {
        //const {isStarted} = this.state;
        const options ={
            method: 'POST',
            url: API_URL.investigation.getheader,
            data: {
                startedInvestigation : isStartedParam,
                // statusSymbol: 'NotEquals',
                // status: 'DELETED',
                // offset: 1,
                // limit: 15,
                // ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    let { headers } = data.data;                    
                    this.setState({
                        isStarted : isStartedParam,
                        tableheader: headers,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }

    loadData = (params = {}) => {
        this.setState({
            loading: true,
        });
        //this.loadDataParam(params);
        const { isStarted } = params.isStarted == null || params.isStarted == undefined ? this.state : params;
        let { status } = params;
        const isBO = sessionStorage.curRole == "BO";
        if(status == null || status == '' || status == undefined) status = 'DISCUSSING';
        const statusSymbol = isBO && isStarted == 0 ? 'Equals' : (
            status == 'DISCUSSING' ? 'NotEquals' : 'Equals'
        ) ;
        const options ={
            method: 'POST',
            url: API_URL.investigation.list,
            data: {
                statusSymbol,
                offset: 1,
                limit: 15,
                startedInvestigation : isStarted,
                ...params,
                status: status,
                manageFlag: 0,
                searchInvId:this.state.invId,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const { investigations } = data.data;
                    const pagination = { ...this.state.pagination };
                    pagination.total = investigations.totalCount;
                    this.setState({
                        loading: false,
                        data: investigations.datas,
                        pagination,
                        invId:'',
                        isStarted:investigations.datas.length>0 ? investigations.datas[0].status =='DISCUSSING' ? 0 : 1 : this.state.isStarted
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }

    loadDataParam = params => {
        let sortParams;
        let searchParams;
        const {
            direction,
            sort,
            sortType,
            investigationCode,
            investigationName,
            area,
            sponsor,
            conAmount,
            conAmountSymbol,
        } = params;

        sortParams = {
            direction,
            sort,
            sortType,
        };

        searchParams = {
            investigationCode,
            investigationName,
            area,
            sponsor,
            conAmount,
            conAmountSymbol,
        };

        this.setState({
            sortParams,
            searchParams,
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
    

    reset = () => {
        const pagination = { ...this.state.pagination, current: 1 };
        this.setState({
            pagination,//
            searchParams: {}
        },function(){
            this.loadData();
        });
    }

    del = investigationId => {
        const options ={
            method: 'POST',
            url: API_URL.investigation.del,
            data: {
                investigationId,
            },
            dataType: 'json',
            doneResult: () => {
                message.success('删除成功');
                this.reload();
            }
        }
        $.sendRequest(options)

    }

    /**
     * 修改项目时，获取项目详细信息
     * @param investigationId
     */
    edit = investigationId => {
        this.showCreateModal(investigationId);
    }

    /**
     * 标记完成与取消完成
     * @param investigationId
     * @param status COMPLETED OR UNDERWAY
     */
    updateStatus = (investigationId, status) => {
        const options ={
            method: 'POST',
            url: API_URL.investigation.updateStatus,
            data: {
                investigationId,
                status: status,
            },
            dataType: 'json',
            doneResult: data => {
                message.success('标记完成');
                this.reload();
            }
        }
        $.sendRequest(options)
    }

    handleTableChange = (pagination, filters, sorter) => {
        let sortType,
            direction,
            sort;
        if(sorter.column){
            sort = sorter.column.key;
        }
        const pager = { ...this.state.pagination };
        if (pager.current == pagination.current){
            pager.current = 1;
        } else {
            pager.current = pagination.current;
        }

        if (!jquery.isEmptyObject(sorter) && sorter.column) {
            sortType = sorter.column.sortType;
            if(sorter.column.sort != undefined && sorter.column.sort)
                sort = sorter.column.sort;
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
        /*if (sorter.field === 'planAmountFilter') {
            sort = 'Type_Filter';
        } else if (sorter.field === 'planAmountInform') {
            sort = 'Type_Informed';
        } else if (sorter.field === 'planAmountRandom') {
            sort = 'Type_Random';
        }*/

        this.loadData({
            limit: pagination.pageSize,
            offset: pager.current,
            direction,
            sort,
            sortType,
            ...this.state.searchParams,
            ...filters,
        });
    }



    getColumns = () => {
        const columns=[]
        const isBO = sessionStorage.curRole == "BO";
        const { isStarted } = this.state;
        columns.push({
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            fixed: 'left',
            width:50,
        })
        columns.push({
            title: '项目名称',
            key: 'investigationName',
            fixed: 'left',
            width: 100,
            sorter: true,
            sortType: 'COMMON',
            render: (text, record) => {
                return (
                    <span>
                        {record.allowEnter ? 
                         isStarted == 1 ? 
                        <a href="javascript:void(0)" onClick={() => this.selectInvestigation(record.investigationId, record.investigationName)}>{record.investigationName}</a> : record.investigationName :
                        record.investigationName }
                        
                        {/*<span className="ant-divider" />*/}
                    </span>
                );
            },
        })
        this.state.tableheader.map( d => {
            if (d.field != 'investigationName'){
                if(d.type == 'STATISTIC' || d.type == 'PLAN'){
                    columns.push({
                        title: d.displayName,
                        dataIndex: d.field + d.type,
                        key: d.field + d.type,
                        sorter: true,
                        sortType: d.type,
                        sort : d.field,
                    })
                }
                else{
                    columns.push({
                        title: d.displayName,
                        dataIndex: d.field,
                        key: d.field,
                        sorter: d.type == 'ROLE' ? false : true,
                        sortType: d.type,
                    })
                }
                
            }

            
        })


        if (isBO == true){
            if (isStarted == 1){
                columns.push({
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 140,
                    render: (text, record) => {
                        return (
                            <span>
                                <a href="javascript:void(0)" onClick={() => this.showPreviewModal(record.investigationId)}>项目信息</a>
                                {<span className="ant-divider" />}
                                <a href="javascript:void(0)" onClick={() => this.changeUser(record.investigationId)}>变更人员</a>
                            </span>
                        );
                    },
                });
            } else {
                columns.push({
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 140,
                    render: (text, record) => {
                        return (
                            <span>
                                <a href="javascript:void(0)" onClick={() => this.delegateUser(record.investigationId)}>委派人员</a>
                                {<span className="ant-divider" />}
                                <Popconfirm title={'确定启动该项目?'} onConfirm={() => this.startInvestigation(record.investigationId)} okText="确定" cancelText="取消">
                                    <a href="javascript:void(0)">启动项目</a>
                                </Popconfirm>
                            </span>
                        );
                    },
                });
            }
        } else {
            columns.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 80,
                render: (text, record) => {
                    return (
                        <span>
                            <a href="javascript:void(0)" onClick={() => this.showPreviewModal(record.investigationId)}>项目信息</a>
                        </span>
                    );
                },
            });
        }
        
        return columns
    }

    getDataSource = () => {
        // const investigations = [];
        const { data, pagination, planList,tableheader } = this.state;

        let headers = tableheader; //从获取表头接口获取到的表头列表
        let invList = data; //从数据接口获取到的项目列表
        let dataSource = []; //数据源


        invList.map((inv, i) =>{
            //遍历项目列表inv为项目
            let row = {index: i+1, 
                investigationId: inv.investigationId,
                allowEnter : inv.allowEnter,}; //数据源的一行

            headers.map((header,j) =>{
                //遍历表头列表， header为某一表头
                let field = header.field;
                if(header.type == 'STATISTIC' || header.type == 'PLAN'){
                    field = field + header.type;
                }

                let value; //对应值
                inv.fields.map((invField,k) =>{
                    //遍历项目中的字段列表
                    
                    if(invField.field == header.field 
                        && invField.type == header.type){
                        //字段列表中的field和表头中的field一致就把字段值取出来
                        value = invField.value;
                    }
                });
                // 把字段值添加到数据源行
                row[field] = value;
            });

            //把数据源行添加到数据源
            dataSource.push(row);
        });


        return dataSource;
    }

    /* getStatus (investigationStatus){
     return 'DISCUSSING' != investigationStatus ? 'PREPARING' != investigationStatus ? 'UNDERWAY' != investigationStatus ?
     'COMPLETED' != investigationStatus ? 'DELETED' != investigationStatus ? "未知" : "已删除" : "已完成" : "进行中" : "准备中" : "洽谈中";
     }*/

     /**
      * 点击某个项目时，获取角色列表，判断是单角色还是多角色
      */
    selectInvestigation = (investigationId,investigationName) => {
        const options = {
            url: `${API_URL.user.getRoleListForInvestigation}`,
            data: {
                investigationId,
            },
            dataType: 'json',
            doneResult: ( data => {
                const { roles } = data.data;
                if (roles.length > 1){
                    this.selectUserRoleOption (roles, investigationId);
                } else {
                    this.selectRole(roles[0], investigationId, roles, investigationName);
                }
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    selectUserRoleOption = (roles, investigationId) => {
        this.roleSelectionModelRef.show(this.selectRole, roles, investigationId);
    }

    updateInvestigationState = investigationId => {
        this.state.data.map((inv, i) =>{
            if(inv.investigationId == investigationId){
                sessionStorage.invStatus = inv.status;
                sessionStorage.completeTime = inv.completeTime;
                return;
            }
        });
    }

    selectRole = (role, investigationId, roles, investigationName) => {
        sessionStorage.roles = roles;
        this.updateInvestigationState(investigationId);
        if (role == "PA"){
            // TODO: 待完善进入项目管理员的项目信息详情页面
            sessionStorage.invId = investigationId;
            sessionStorage.curRole = role;
            location.href = `./#/invDetails`;
        } else {
            // 进入项目信息列表页面
            //sessionStorage.invId = investigationId;
            //sessionStorage.invName = investigationName;
            location.href = `./#/siteList/` + role + '/' + investigationId;
        }
        this.state.data.map( investigation => {
            if (investigation.investigationId == investigationId){
                investigation.fields.map( field => {
                    if (field.field == 'investigationName'){
                        sessionStorage.invName = field.value;
                        return;
                    }
                });
                return;
            }
        });
    }

    showPreviewModal = investigationId => {
        this.previewModalRef.show(investigationId);
    }

    showCreateModal = investigationId => {
        this.createModalRef.show(investigationId);
    }

    delegateUser = investigationId => {
        this.delegateUserRef.show(investigationId);
    }

    changeUser = investigationId => {
        this.delegateUserRef.show(investigationId,true);
    }

    startInvestigation = investigationId => {
        const options = {
            url: `${API_URL.investigation.updateStatus}`,
            data: {
                investigationId,
                status: 'PREPARING',
            },
            dataType: 'json',
            doneResult: ( data => {
                message.success("项目启动成功");
                this.reload();
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    setStarted = value => {
        /*this.setState({
            isStarted: value,
        });*/
        this.getheader(value);
        this.loadData({isStarted:value});
    };

    hide=()=>{
        this.setState({
            visible:false,
        })
    }

    showView=(row)=>{        
        this.setState({
            visible:true,
            investigationName:row.investigationName,
            investigationCode:row.investigationCode,
            invId:row.investigationId
        },()=>{
            this.ProjectPercentViewRef.loadData({investigationId:row.investigationId})
        })
        
    }

    componentDidMount() {
        //this.getheader(false)
        //this.loadData();     
        
        this.setStarted(1);
    }

    render() {
        const { loading, pagination, sortParams,isStarted, tableheader ,visible,invId,investigationCode,investigationName} = this.state;
        const isBO = sessionStorage.curRole == "BO";
        return (
            <div className="full home">
                
                <div className="content-2">
                    <ProjectPercent type={'pro'} invId={invId} showView={this.showView}/>
                </div>
                <PreviewModal isModal={true} ref={el => { this.previewModalRef = el; }} />
                <Modal
                    title="查看项目信息"
                    visible={visible}
                    onCancel={this.hide}
                    className="preview-modal"
                    wrapClassName="vertical-center-modal"
                    width="1200px"
                    footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
                > 
                    <div style={{padding:20,textAlign:'center'}}>
                        <h1>项目完工百分比</h1>
                        <h3 style={{marginBottom:20}}>{investigationName} ({investigationCode})</h3>
                        <ProjectPercent jde={true} invId={invId} ref={el => { this.ProjectPercentViewRef = el; }}/>
                    </div>
                    
                </Modal>

            </div>
        );
    }
}

export default ProPercent;

