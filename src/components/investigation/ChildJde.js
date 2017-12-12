import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button,Input,Icon,DatePicker,message,InputNumber, Radio,Spin, Select } from 'antd';
import API_URL from '../../common/url';
import moment from 'moment';
import './css/list.less';

const initState={};
const Option = Select.Option;
class ChildJde extends React.Component {

    state = {
        jdeData: {},
        loading: false,
        visible: false,
        type: "add",
        mainJdeCode: '',
        dateFormat: "YYYY-MM-DD",
    };

    show = (type,jdeData) => {
        if(type == "add"){
            this.setState({
                visible: true,
                jdeData:[],
                type
            });
        }else if(type == "edit"){
            this.setState({
                visible: true,
                jdeData,
                type
            });
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    save = () =>{
        const {jdeData,mainJdeCode, type} = this.state;
        console.log(jdeData);
        const {investigationJdeContractCode, jdeContractAmount, startTime, endTime, investigationJdeContractIsSigned, investigationJdeContractId} = jdeData;
        if(!investigationJdeContractCode){
            message.error('请输入JDE项目号');
            return;
        }
        if(!jdeContractAmount && jdeContractAmount !== 0){
            message.error('请输入合同额');
            return;
        }
        if(!startTime){
            message.error('请输入合同开始时间');
            return;
        }
        if(!endTime){
            message.error('请输入合同结束时间');
            return;
        }
        if(!investigationJdeContractIsSigned){
            message.error('请选择合同是否签署完成');
            return;
        }
        if(investigationJdeContractCode && investigationJdeContractCode.length != 12){
            message.error('JDE项目号格式不正确:固定为12位，可由数字字母组成');
            return;
        }
        this.setState({
            loading: true
        })
        let url = "";
        let message = "";
        const data = {
            ...jdeData,
            jdeCode: investigationJdeContractCode,
            jdeContractIsSigned: investigationJdeContractIsSigned
        };
        if(type == "add"){
            url = API_URL.investigation.addChildrenJde;
            message = "新增成功";
        }else if (type == "edit"){
            url = API_URL.investigation.modifyChildrenJde;
            message = "编辑成功";
            data.jdeCodeId = investigationJdeContractId;
        }
        
        const options = {
            method: 'POST',
            url: url,
            data: data,
            dataType: 'json',
            doneResult: data => {
                message.success(message);
                this.setState({visible:false,loading:false});
                this.reload();
            },errorResult: data => {
                this.setState({loading:false});
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

    reload = () => {
        this.props.reload()
    }

    

    componentDidMount(){
              
    }

    componentWillReceiveProps(nextProps){
        const mainJdeCode = nextProps.mainJdeCode;
        this.setState({
            mainJdeCode
        })
    }

    handleDateChange =(value, key) =>{
        const {dateFormat} = this.state;
        let time = "";
        if(value){
            time = value.format(dateFormat);
        }
        const jdeData = {
            ...this.state.jdeData,
            [key]: time
        }
        this.setState({
            jdeData
        });
    }

    handleJdeChange = (e) => {
        const {jdeData} = this.state;
        jdeData.investigationJdeContractCode = e.target.value;
        this.setState({
            jdeData
        })
    }

    handleMountChange = (value) => {
        const {jdeData} = this.state;
        jdeData.jdeContractAmount = value;
        this.setState({
            jdeData
        })
    }

    statusChanged = (value) => {
        const {jdeData} = this.state;
        jdeData.investigationJdeContractIsSigned = value;
        this.setState({
            jdeData
        })
    }

    render() {
        const { visible, jdeData, loading, mainJdeCode, dateFormat  } = this.state;    
        const {investigationJdeContractCode,startTime, endTime,jdeContractAmount,investigationJdeContractIsSigned } = jdeData;
        const dateStartTime = startTime ? moment(startTime) : null;
        const dateEndTime = endTime ? moment(endTime) : null;
            return (
            <Modal
                title="添加JDE项目号"
                visible={visible}
                onCancel={this.hide}
                onOk={this.save}
                className="setjde-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                //footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont-cont">
                <Spin spinning={loading}>
                    <ul className="preview-list">
                        <li>
                            <div className="item">
                                <label className="ui-label">JDE主项目号</label>
                                <span className="ui-text">{mainJdeCode}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">JDE项目号</label>
                                <span className="ui-text"><Input style={{width:"130px"}} maxLength={12} value={investigationJdeContractCode} onChange={this.handleJdeChange} /></span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">合同额</label>
                                <span className="ui-text">
                                    {/* <InputNumber style={{width:"130px"}} maxLength={16} value={jdeContractAmount} onChange={this.handleMountChange}
                                        //formatter={value => `${value}%`}
                                     />  */}
                                     <InputNumber maxLength="13" style={{width:"130px"}} min={0} value={jdeContractAmount} onChange={this.handleMountChange} formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} precision={0} parser={value => value.replace(/\￥\s?|(,*)/g, '')}/>

                                    元</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">合同开始时间</label>
                                <span className="ui-text">
                                    <DatePicker style={{width: 130}} format={dateFormat} onChange={(e) => this.handleDateChange(e, "startTime")} value={dateStartTime}  />
                                </span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">合同结束时间</label>
                                <span className="ui-text">
                                <DatePicker style={{width: 130}} format={dateFormat} onChange={(e) => this.handleDateChange(e, "endTime")} value={dateEndTime}  />
                                </span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">合同是否签署完成</label>
                                <span className="ui-text">
                                <Select style={{width:80}}
                                    className='placeholder_black'
                                    onChange = {this.statusChanged}
                                    value = {investigationJdeContractIsSigned}
                                    allowClear = {true}
                                >
                                    <Option value='1'>是</Option>
                                    <Option value='0'>否</Option>
                                </Select>  
                                </span>
                            </div>
                        </li>
                    </ul>
                </Spin>
                </div>
            </Modal>
        )
        
    }
}

export default ChildJde;
