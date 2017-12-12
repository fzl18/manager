import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button,Input,Icon,DatePicker,message,InputNumber, Radio,Spin, Select, Row, Col } from 'antd';
import API_URL from '../../common/url';
import moment from 'moment';
import './css/list.less';
//import SiteSearchInput from "../site/SiteSearchInput";

const initState={
    jdeData: {},
    loading: false,
    visible: false,
    jdeCodeId: '',
    investigationJdeContractCode: '',
    investigationSiteId: '',
    investigationSiteCode: '',
    sites: [],
    sitesId: [],
    reRender: false,
};
const Option = Select.Option;
class ChildJde extends React.Component {

    state = {...initState};

    show = (jdeCodeId,investigationJdeContractCode) => {
        this.setState({
            visible: true,
            jdeCodeId,investigationJdeContractCode
        })
    };

    hide = () => {
        this.setState({
            visible: false,
            reRender: true,
        },function(){
            this.setState({...initState,sites:[]})
        });
    };

    save = () =>{
        const {sites, jdeCodeId} = this.state;
        if(sites.length == 0){
            message.error('请先添加中心');
            return;
        }
        let idx = 0;
        let addParams = '';
        sites.map(user => {
            if(addParams.length > 0){
                addParams += '&';
            }
            addParams += 'ids['+idx+']=' + user.value;
            idx++;
        });
        this.setState({
            loading: true
        })
        const options = {
            method: 'POST',
            url: `${API_URL.investigation.addJdeCodeSite}?${addParams}`,
            data: {
                jdeCodeId
            },
            dataType: 'json',
            doneResult: data => {
                message.success("添加关联记录成功");
                this.setState({
                    visible: false,
                    reRender: true,
                },function(){
                    this.setState({...initState,sites:[]})
                });
                this.reload();
            },errorResult: data => {
                this.setState({loading:false});
            }
        }
        $.sendRequest(options)
    }

    cancel =() =>{
        this.setState(initState)
    }

    reload = () => {
        this.props.reload()
    }

    

    componentDidMount(){
              
    }

    componentWillReceiveProps(nextProps){
        const JdeCode = nextProps.JdeCode;
        this.setState({
            JdeCode
        })
    }

    handleSelectSite = value => {
        this.setState({
            investigationSiteId: value.value,
            investigationSiteCode: value.text,
        });
    };

    addSite = () =>{
        const {sites, investigationSiteId, investigationSiteCode} = this.state;
        if (investigationSiteId){
            let hasContain = false;
            sites.map(user => {
                if (user.value == investigationSiteId){
                    hasContain = true;
                    return;
                }
            });
            if (hasContain == true){
                message.error("当前中心已添加");
            } else {
                sites.push({
                    value: investigationSiteId,
                    text: investigationSiteCode,
                });
                this.setState({
                    sites,
                });
            }
        }
    }

    getSiteList = () => {
        const { sites } = this.state;
        if (sites.length > 0){
            let labels = [];
            sites.map(user => {
                labels.push(
                    <Row key={user.value}>
                        <Col span={4}>
                        </Col>
                        <Col span={16}>
                            <span>
                                <a href="javascript:void(0)" onClick={() => this.viewUser(user.value)}>{user.text}</a>
                            </span>
                        </Col>
                        <Col span={4}><Button type="primary" shape="circle" icon="close" size='small' onClick={this.remove.bind(this, user.value)} /></Col>
                    </Row>
                );
            });
            return (
                <div>
                    {labels}
                </div>
            );
        } else {
            return null;
        }
    };

    remove = (value) => {
        const { sites } = this.state;
        sites.map((user, i) => {
            if (user.value == value){
                sites.splice(i, 1);
                this.setState({
                    sites,
                });
                return;
            }
        });
    };

    render() {
        const { visible, jdeCodeId, loading, investigationJdeContractCode, reRender } = this.state;    
            return (
            <Modal
                title="添加关联记录"
                visible={visible}
                onCancel={this.hide}
                onOk={this.save}
                className="addRelate-modal"
                wrapClassName="vertical-center-modal"
                width="500px"
                //footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont-cont">
                <Spin spinning={loading}>
                    <ul className="preview-list">
                        <li>
                            <div className="item">
                                <label className="ui-label">JDE项目号</label>
                                <span className="ui-text">{investigationJdeContractCode}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">关联中心</label>
                                <span className="ui-text" style={{width:"300px"}}>
                                {/* {!reRender ?
                                    <SiteSearchInput placeholder="输入中心编号\中心名称" style={{width: 200}}
                                             handleSelectSite = {this.handleSelectSite}
                                    />
                                    : null
                                } */}
                                    <Button type="primary" onClick={this.addSite} style={{marginLeft:"10px"}}>添加</Button>
                                </span>
                            </div>
                        </li>
                    </ul>
                    <div className="select-gay">
                        {
                            this.getSiteList()
                        }
                    </div>
                </Spin>
                </div>
            </Modal>
        )
        
    }
}

export default ChildJde;
