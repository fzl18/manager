/**
 * Created by casteloyee on 2017/7/28.
 */
import React from 'react';
import { Modal, Row, Col, Input, Radio, Select, message, Button, Icon } from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
import UserSelectModal from './UserSelectModal';

const Option = Select.Option;

class ChangeUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            investigationId: '',
            investigation: {},
            pmList: [],
            paList: [],
            bdList: [],
        };
    };


    show = id => {
        this.setState({
            investigationId: id,
            visible: true,
        });
        const options = {
            url: `${API_URL.execute.view}`,
            data: {
                investigationId: id,
            },
            dataType: 'json',
            doneResult: ( data => {
                const investigation = data.data.investigation;
                const pmList = [];
                const paList = [];
                const bdList = [];
                if (investigation.pmUserList && investigation.pmUserList.length > 0){
                    investigation.pmUserList.map(user => {
                        pmList.push({
                            value: user.userId,
                            text: user.userName,
                        });
                    });
                }
                if (investigation.bdUserList && investigation.bdUserList.length > 0){
                    investigation.bdUserList.map(user => {
                        bdList.push({
                            value: user.userId,
                            text: user.userName,
                        });
                    });
                }
                if (investigation.paUserList && investigation.paUserList.length > 0){
                    investigation.paUserList.map(user => {
                        paList.push({
                            value: user.userId,
                            text: user.userName,
                        });
                    });
                }
                this.setState({
                    investigation,
                    paList,
                    pmList,
                    bdList,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    getPMSource = () => {
        const { pmList } = this.state;
        if (pmList.length > 0){
            let labels = [];
            pmList.map(user => {
                labels.push(
                    <Row key={user.value}>
                        <Col span={18}>
                            <span>
                                <a href="javascript:void(0)" onClick={() => this.viewUser(user.value)}>{user.text}</a>
                            </span>
                        </Col>
                        <Col span={6}><Button type="primary" onClick={this.changePM.bind(this, user.value)} >变更</Button></Col>
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


    getPASource = () => {
        const { paList } = this.state;
        if (paList.length > 0){
            let labels = [];
            paList.map(user => {
                labels.push(
                    <Row key={user.value}>
                        <Col span={18}>
                            <span>
                                <a href="javascript:void(0)" onClick={() => this.viewUser(user.value)}>{user.text}</a>
                            </span>
                        </Col>
                        <Col span={6}><Button type="primary" onClick={this.changePA.bind(this, user.value)} >变更</Button></Col>
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

    getBDSource = () => {
        const { bdList } = this.state;
        if (bdList.length > 0){
            let labels = [];
            bdList.map(user => {
                labels.push(
                    <Row key={user.value}>
                        <Col span={18}>
                            <span>
                                <a href="javascript:void(0)" onClick={() => this.viewUser(user.value)}>{user.text}</a>
                            </span>
                        </Col>
                        <Col span={6}><Button type="primary" onClick={this.changeBD.bind(this, user.value)} >变更</Button></Col>
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

    changePM = value => {
        this.userSelectModalRef.show(this.callbackChangePM, value, '变更项目经理');
    };

    changePA = value => {
        this.userSelectModalRef.show(this.callbackChangePA, value, '变更项目管理员');
    };
    
    changeBD = value => {
        this.userSelectModalRef.show(this.callbackChangeBD, value, '变更BD');
    };

    callbackChangePM = (user, value) => {
        const { pmList } = this.state;
        pmList.map(tmp => {
            if(tmp.value == value){
                tmp.value = user.value;
                tmp.text = user.text;
                this.setState({
                    pmList,
                });
                return;
            }
        });
    };
    
    callbackChangePA = (user, value) => {
        const { paList } = this.state;
        paList.map(tmp => {
            if(tmp.value == value){
                tmp.value = user.value;
                tmp.text = user.text;
                this.setState({
                    paList,
                });
                return;
            }
        });
    };

    callbackChangeBD = (user, value) => {
        const { bdList } = this.state;
        bdList.map(tmp => {
            if(tmp.value == value){
                tmp.value = user.value;
                tmp.text = user.text;
                this.setState({
                    bdList,
                });
                return;
            }
        });
    };

    handleSubmit = () => {
        const { pmList, paList, bdList, investigationId } = this.state;
        let idx = 0;
        let userParams = '';
        pmList.map(user => {
            if(userParams.length > 0){
                userParams += '&';
            }
            userParams += 'users['+idx+'].userId=' + user.value;
            userParams += '&users['+idx+'].roleCode=PM';
            idx++;
        });
        paList.map(user => {
            if(userParams.length > 0){
                userParams += '&';
            }
            userParams += 'users['+idx+'].userId=' + user.value;
            userParams += '&users['+idx+'].roleCode=PA';
            idx++;
        });
        bdList.map(user => {
            if(userParams.length > 0){
                userParams += '&';
            }
            userParams += 'users['+idx+'].userId=' + user.value;
            userParams += '&users['+idx+'].roleCode=BD';
            idx++;
        });
        const options = {
            url: `${API_URL.investigation.appointMember}` + '?' + userParams,
            data: {
                investigationId,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    visible: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    viewUser = userId => {
        this.userDetailRef.show(userId);
    };
    
    render() {
        const { visible, confirmLoading, investigation } = this.state;
        const pmSearchUrl = `${API_URL.team.userlist}`;
        return (
            <Modal
                title="变更人员"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="500px"
                confirmLoading={confirmLoading}
            >

            <div className="cont-cont">
                <ul className="preview-list">
                    <li className="title"><h4>1.基本信息</h4></li>
                    <li>
                        <div className="item">
                            <label className="ui-label">项目名称</label>
                            <span className="ui-text">{investigation.investigationName}</span>
                        </div>
                        <div className="item">
                            <label className="ui-label">项目编号</label>
                            <span className="ui-text">{investigation.investigationCode}</span>
                        </div> 
                    </li>
                    <li className="title"><h4>*项目经理</h4></li>
                    <li>
                        <span className="ui-text">{this.getPMSource()}</span>
                    </li>
                    <li className="title"><h4>*项目管理员</h4></li>
                    <li>
                        <span className="ui-text">{this.getPASource()}</span>
                    </li>
                    <li className="title"><h4>*BD</h4></li>
                    <li>
                        <span className="ui-text">{this.getBDSource()}</span>
                    </li>
                </ul>
            </div>


                {/* <div>
                    <Row>
                        <Col span={9}>项目名称</Col>
                        <Col span={1}/>
                        <Col>{investigation.investigationName}</Col>
                    </Row>
                    <Row>
                        <Col span={9}>项目编号：</Col>
                        <Col span={1}/>
                        <Col>{investigation.investigationCode}</Col>
                    </Row>
                    <Row>
                        <Col span={9}>*项目经理：</Col>
                        <Col span={1}/>
                        <Col span={13}>
                            <div>
                                {
                                    this.getPMSource()
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={9}>*项目管理员：</Col>
                        <Col span={1}/>
                        <Col span={13}>
                            <div>
                                {
                                    this.getPASource()
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={9}>*BD：</Col>
                        <Col span={1}/>
                        <Col span={13}>
                            <div>
                                {
                                    this.getBDSource()
                                }
                            </div>
                        </Col>
                    </Row>
                </div> */}
                <UserSelectModal ref={el => { this.userSelectModalRef = el; }} />
            </Modal>
        )
    }
}

export default ChangeUser;
