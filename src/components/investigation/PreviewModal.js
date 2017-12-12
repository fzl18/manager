import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button,Input,Icon,DatePicker,message,InputNumber, Radio,Spin } from 'antd';
import API_URL from '../../common/url';
import moment from 'moment';
import './css/list.less';
const RadioGroup = Radio.Group
const dayformat = "YYYY-MM-DD"
class   PreviewModal extends React.Component {

    state = {
        visible: false,
        investigation: {},
        isEdit:false,
        params:{},
        bdUserList:[],
        planList:[],
        paUserList:[],
        pmUserList:[],
        planList:[],
        loading:true,
        investigationContractAmountStr:"",
    };

    loadData = (id) => {
        const options ={
            method: 'POST',
            url: API_URL.investigation.view,
            data: {
                investigationId:id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    investigationContractAmountStr : data.data.investigationContractAmountStr,
                    investigation: data.data.investigation,
                    bdUserList:data.data.investigation.bdUserList ? data.data.investigation.bdUserList :[],
                    planList:data.data.investigation.planList?data.data.investigation.planList:[],
                    paUserList:data.data.investigation.paUserList?data.data.investigation.paUserList:[],
                    pmUserList:data.data.investigation.pmUserList?data.data.investigation.pmUserList:[],
                    planList:data.data.investigation.planList?data.data.investigation.planList:[],
                    loading:false,
                });
            }
        }
        $.sendRequest(options)
    };

    show = id => {
        this.setState({
            visible: true,            
        });
        if (id) {
            this.setState({
                loading:true,
            })
            this.loadData(id);
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handle = () =>{
        const isEdit = !this.state.isEdit
        this.setState({
            isEdit,
        })
    }

    save = () =>{
        const {investigationName,bdUserList} =this.state.investigation
        const {params} = this.state

        const investigationParams = {};

        this.state.planList.map((d,i) =>
            investigationParams[`params[${d.investigationPlanType}]`] = d.planAmount
        )
        const options = {
            method: 'POST',
            url: API_URL.investigation.updateInvestigation,
            data: {
                investigationId:sessionStorage.invId,
                investigationName,
                bdUserId:bdUserList[0].userId,                
                ...investigationParams,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                message.success('修改成功')
                this.setState({loading:true})
                this.reload()
            }
        }
        $.sendRequest(options)
        
    }

    cancel =() =>{
        const isEdit = !this.state.isEdit
        this.setState({
            isEdit,
        })
    }

    // inputChange = () =>{
    //     this.setState({
    //     investigationRandom : e.target.value,
    //   })
    // }

    inputNumChange= (files,value) =>{
        const {params} = this.state        
        params[files] = value        
        this.setState({
            params,
        })      
    }

    inputNumChange2= (files,value) =>{
        const {params} = this.state        
        params[`params[${files}]`] = value        
        this.setState({
            params,
        })      
    }

    inputChange = (files,e) =>{
        const {params} = this.state 
        params[files] = e.target.value,
        this.setState(
            params,
        )      
    }


    datePickerChange = (files,date,dateString) =>{
        const {params} = this.state 
        params[files] = date.format('YYYY-MM-DD'),
        this.setState(
            params,
        )      
    }

    reload = () => {
        this.setState({
            isEdit:false,
        }) 
        this.loadData(sessionStorage.invId)
    }

    componentDidMount(){
        if(!this.props.isModal){
            this.loadData(sessionStorage.invId)
        }        
    }

    render() {
        
        const { visible, isEdit,planList,bdUserList,paUserList,pmUserList} = this.state;        
        const {
            investigationName,
            investigationCode,
            investigationArea,
            investigationSponsor,
            investigationMedicine,
            investigationMalady,
            investigationPlanBeginTime,
            investigationPlanEndTime,
            investigationSitePlan,
            planAmountFilter,
            planAmountInform,
            planAmountRandom,
            planAmountVisit,
            planAmountFTE,
            investigationRandom,            
        } = this.state.investigation;
        const investigationContractAmountStr = this.state.investigationContractAmountStr;
        const bdUsers = bdUserList.length>0 ? bdUserList.map(d => d.userName) : []
        const pmUsers = pmUserList.length>0 ? pmUserList.map(d => d.userName) : []
        const paUsers = paUserList.length>0 ? paUserList.map(d => d.userName) : []
        let planList1 = [];
        planList.map((d,i) =>{
            let c = [];
            if(planList1.length <= Math.floor(i /2))
                planList1[i/2] = c;
            else 
                c = planList1[Math.floor(i /2)];
            c[0 + i % 2] = d;
        })

        const options = planList1.map((dd,i) =>{
            
            return(
                <li key={i}>
                    {
                        dd.map((d,j) =>{
                            if(!isEdit ) {
                                return (
                                    <div className="item">
                                        {d.investigationPlanType != "Type_FTE" ?
                                            <label className="ui-label">计划{d.investigationPlanName=='随机'?'随机(入组)':d.investigationPlanName}数</label>
                                            :
                                            <label className="ui-label">合同{d.investigationPlanName}数</label>
                                        }
                                    <span className="ui-text">{d.planAmount}</span>
                                </div>    
                                )
                            }
                            else{
                                return (
                                    <div className="item">
                                    {d.investigationPlanType != "Type_FTE" ?
                                        <label className="ui-label">计划{d.investigationPlanName}数</label>
                                        :
                                        <label className="ui-label">合同{d.investigationPlanName}数</label>
                                    }
                                    <span className="ui-text"><InputNumber onChange={this.inputNumChange2.bind(this,d.investigationPlanType)} defaultValue={d.planAmount} /></span>
                                    </div>
                                )    
                            }
                        })
                    }
                </li>
            )
        })
        /*const options = planList.map((d,i) =>{
            if(i % 2 != 0) return ({});
            return(
                <li key={i}>
                    {
                        !isEdit ?                 
                            (
                                <div className="item">
                                    <label className="ui-label">计划{d.investigationPlanName}数</label>
                                    <span className="ui-text">{d.planAmount}</span>
                                </div>         
                            )
                            :
                            (
                                <div className="item">
                                    <label className="ui-label">计划{d.investigationPlanName}数</label>
                                    <span className="ui-text"><InputNumber onChange={this.inputNumChange2.bind(this,d.investigationPlanType)} defaultValue={d.planAmount} /></span>
                                </div>
                            )            
                    } 
                    {   
                        planList.map((d2,j) =>{
                            if(j != i+1) return ({});

                            if(!isEdit ) {
                                return (
                                    <div className="item">
                                    <label className="ui-label">计划{d2.investigationPlanName}数</label>
                                    <span className="ui-text">{d2.planAmount}</span>
                                </div>    
                                )
                            }
                            else{
                                return (
                                    <div className="item">
                                    <label className="ui-label">计划{d2.investigationPlanName}数</label>
                                    <span className="ui-text"><InputNumber onChange={this.inputNumChange2.bind(this,d2.investigationPlanType)} defaultValue={d2.planAmount} /></span>
                                    </div>
                                )    
                            }
                        })
                    }
                 </li>
            )          
        })*/

        if(this.props.isModal){            
            return (            
            <Modal
                title="查看项目信息"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >            
                <div className="cont-cont">
                <Spin spinning={this.state.loading}>
                    <ul className="preview-list">
                        <li className="title"><h4>1.基本信息</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目名称</label>
                                <span className="ui-text">{investigationName}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目编号</label>
                                <span className="ui-text">{investigationCode}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目领域</label>
                                <span className="ui-text">{investigationArea}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">申办方</label>
                                <span className="ui-text">{investigationSponsor}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">研究药物</label>
                                <span className="ui-text">{investigationMedicine}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">适应症</label>
                                <span className="ui-text">{investigationMalady}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划开始时间</label>
                                <span className="ui-text">{
                                    investigationPlanBeginTime ?
                                        moment(investigationPlanBeginTime).format('YYYY-MM-DD')
                                        : ''}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划结束时间</label>
                                <span className="ui-text">{
                                    investigationPlanEndTime ?
                                    moment(investigationPlanEndTime).format('YYYY-MM-DD')
                                    :''}</span>
                            </div>
                        </li>
                        {options}
                     
                        {/* <li>
                            <div className="item">
                                <label className="ui-label">计划中心数</label>
                                <span className="ui-text">{investigationSitePlan}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划筛选数</label>
                                <span className="ui-text">{planAmountFilter}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划知情数</label>
                                <span className="ui-text">{planAmountInform}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划随机(入组)数</label>
                                <span className="ui-text">{planAmountRandom}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划访视数</label>
                                <span className="ui-text">{planAmountVisit}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划FTE数</label>
                                <span className="ui-text">{planAmountFTE}</span>
                            </div>
                        </li> */}
                        <li>
                            <div className="item">
                                <label className="ui-label">合同额</label>
                                <span className="ui-text">￥{investigationContractAmountStr ? `${investigationContractAmountStr}` : 0} 元</span>
                            </div>
                        </li>
                        <li className="title"><h4>2.项目负责人</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目经理</label>
                                <span className="ui-text">{pmUsers.join(' ; ')}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目管理员</label>
                                <span className="ui-text">{paUsers.join(' ; ')}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">BD</label>
                                <span className="ui-text">{bdUsers.join(' ; ')}</span>
                            </div>
                        </li>
                    </ul>
                </Spin>
                </div>
            </Modal>
        );}else{            
            const disabled = sessionStorage.invStatus == 'COMPLETED';            
            return(
        <Spin spinning={this.state.loading}>
            <div className="cont-cont">
                <div className='btn' style={{marginBottom:'20px',textAlign:'right'}}><Button disabled={disabled} type="primary" onClick={this.handle}> <Icon type="edit" /> 编辑</Button></div>
                    <ul className="preview-list">
                        <li className="title"><h4>1.基本信息</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目名称</label>
                                <span className="ui-text">{investigationName}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目编号</label>
                                <span className="ui-text">{
                                    isEdit ? <Input defaultValue={investigationCode} onChange={this.inputChange.bind(this,'investigationCode')}/>
                                    : investigationCode
                                    }</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目领域</label>
                                <span className="ui-text">{
                                    isEdit ? <Input onChange={this.inputChange.bind(this,'investigationArea')} defaultValue={investigationArea} />
                                    : investigationArea
                                    }</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">申办方</label>
                                <span className="ui-text">{
                                    isEdit ? <Input onChange={this.inputChange.bind(this,'investigationSponsor')} defaultValue={investigationSponsor} />
                                    : investigationSponsor
                                    }</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">研究药物</label>
                                <span className="ui-text">{
                                    isEdit ? <Input onChange={this.inputChange.bind(this,'investigationMedicine')} defaultValue={investigationMedicine} />
                                    : investigationMedicine
                                    }</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">适应症</label>
                                <span className="ui-text">{
                                    isEdit ? <Input onChange={this.inputChange.bind(this,'investigationMalady')} defaultValue={investigationMalady} />
                                    : investigationMalady                                    
                                    }</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划开始时间</label>
                                <span className="ui-text">{
                                    isEdit ? <DatePicker onChange={this.datePickerChange.bind(this,'investigationPlanBeginTime')} defaultValue={ investigationPlanBeginTime ? moment(investigationPlanBeginTime,dayformat) : ''} format={dayformat} />
                                    : investigationPlanBeginTime ? moment(investigationPlanBeginTime).format('YYYY-MM-DD') : ''
                                    }</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划结束时间</label>
                                <span className="ui-text">{
                                    isEdit ? <DatePicker onChange={this.datePickerChange.bind(this,'investigationPlanEndTime')} defaultValue={ investigationPlanEndTime ? moment(investigationPlanEndTime,dayformat) : ''} format={dayformat} />
                                    : investigationPlanEndTime ? moment(investigationPlanEndTime).format('YYYY-MM-DD') : ''
                                    }</span>
                            </div>
                        </li>
                        {options}
                        {/* <li>
                            <div className="item">
                                <label className="ui-label">计划中心数</label>
                                <span className="ui-text">{
                                    isEdit ? <InputNumber onChange={this.inputNumChange.bind(this,'investigationSitePlan')} defaultValue={investigationSitePlan} />
                                    : investigationSitePlan  
                                    }</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划筛选数</label>
                                <span className="ui-text">{
                                    isEdit ? <InputNumber onChange={this.inputNumChange.bind(this,'planAmountFilter')} defaultValue={planAmountFilter} />
                                    : planAmountFilter 
                                    }</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划知情数</label>
                                <span className="ui-text">{
                                    isEdit ? <InputNumber onChange={this.inputNumChange.bind(this,'planAmountInform')} defaultValue={planAmountInform} />
                                    : planAmountInform 
                                    }</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划随机(入组)数</label>
                                <span className="ui-text">{
                                    isEdit ? <InputNumber onChange={this.inputNumChange.bind(this,'planAmountRandom')} defaultValue={planAmountRandom} />
                                    : planAmountRandom 
                                    }</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划访视数</label>
                                <span className="ui-text">{
                                    isEdit ? <InputNumber onChange={this.inputNumChange.bind(this,'planAmountVisit')} defaultValue={planAmountVisit} />
                                    : planAmountVisit 
                                    }</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划FTE数</label>
                                <span className="ui-text">{
                                    isEdit ? <InputNumber onChange={this.inputNumChange.bind(this,'planAmountFTE')} defaultValue={planAmountFTE} />
                                    : planAmountFTE 
                                    }</span>
                            </div>
                        </li> */}
                        <li>
                            <div className="item">
                                <label className="ui-label">合同额</label>
                                <span className="ui-text">{
                                    isEdit ? <InputNumber disabled={true} defaultValue={investigationContractAmountStr} />
                                    : investigationContractAmountStr
                                    } 元</span>
                            </div>
                        </li>
                        <li className="title"><h4>2.项目负责人</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目经理</label>
                                <span className="ui-text">{pmUsers.join(" ; ")}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目管理员</label>
                                <span className="ui-text">{paUsers.join(" ; ")}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">BD</label>
                                <span className="ui-text">{bdUsers.join(" ; ")}</span>
                            </div>
                        </li>
                        { isEdit &&
                        <li style={{textAlign:'center'}}> <Button type='primary' onClick={this.save}>保存 </Button>  <Button type='primary' onClick={this.cancel}>取消 </Button>  </li>
                        }
                    </ul>
                </div>
                </Spin>)
            }
        
    }
}

export default PreviewModal;
