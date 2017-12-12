import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button,Input,Icon,DatePicker,message,InputNumber, Radio,Spin } from 'antd';
import API_URL from '../../common/url';
import moment from 'moment';
import './css/list.less';

const initState={};

class MainJdeSetting extends React.Component {

    state = {
        jdeData: {},
        loading: false,
        visible: false
    };

    show = id => {
        this.setState({
            visible: true,            
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    save = () =>{
        const {jdeData} = this.state;
        const jdeCode = jdeData.jdeCode;
        if(!jdeCode){
            message.error('请输入JDE主项目号');
            return;
        }
        if(jdeCode && jdeCode.length != 12){
            message.error('JDE主项目号格式不正确:固定为12位，可由数字字母组成');
            return;
        }
        this.setState({
            loading: true
        })
        const options = {
            method: 'POST',
            url: API_URL.investigation.setUpMainJdeCode,
            data: {
                ...jdeData
            },
            dataType: 'json',
            doneResult: data => {
                message.success('修改成功')
                this.setState({visible:false,loading:false})
                this.reload()
            },errorResult: data => {
                this.setState({loading:false})
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

    handleJdeChange = (e) => {
        const {jdeData} = this.state;
        jdeData.jdeCode = e.target.value;
        this.setState({
            jdeData
        })
    }

    componentDidMount(){
              
    }

    componentWillReceiveProps(nextProps){
        const jdeData = nextProps.jdeData;
        this.setState({
            jdeData
        })
    }

    render() {
        const { visible, jdeData, loading } = this.state;    
        const {jdeCode} = jdeData;
            return (
            <Modal
                title="设置JDE主项目号"
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
                    {/* <ul className="preview-list">
                        <li className="title"><h4>1.基本信息</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目名称</label>
                                <span className="ui-text">{}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目编号</label>
                                <span className="ui-text">{}</span>
                            </div>
                        </li>


                        <li>
                            <div className="item">
                                <label className="ui-label">计划开始时间</label>
                                <span className="ui-text"></span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划结束时间</label>
                                <span className="ui-text"></span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">合同额</label>
                                <span className="ui-text">￥元</span>
                            </div>
                        </li>
                        <li className="title"><h4>2.项目负责人</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目经理</label>
                                <span className="ui-text"></span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目管理员</label>
                                <span className="ui-text"></span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">BD</label>
                                <span className="ui-text"></span>
                            </div>
                        </li>
                    </ul> */}
                    <ul className="preview-list">
                        <li>
                            <div className="item">
                                <label className="ui-label">项目名称</label>
                                <span className="ui-text">{jdeData.investigationName}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目编号</label>
                                <span className="ui-text">{jdeData.investigationCode}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">主JDE项目号</label>
                                <span className="ui-text"><Input maxLength={12} value={jdeCode} onChange={this.handleJdeChange} /></span>
                            </div>
                        </li>
                    </ul>
                </Spin>
                </div>
            </Modal>
        )
        
    }
}

export default MainJdeSetting;
