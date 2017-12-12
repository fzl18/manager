/**
 * Created by casteloyee on 2017/7/28.
 */
import React from 'react';
import { Modal, Row, Col, Input, Radio, Select, message, Button, Icon } from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
import UserSearchInput from './UserSearchInput';
import MoreConditionUser from './MoreConditionUser';
const Option = Select.Option;
const InputGroup = Input.Group;
const initState ={
    visible: false,
    confirmLoading: false,
    investigationId: '',
    investigation: {},
    pmSearchType: 'employeeCode',
    curSelectPM: {},
    pmList: [],
    paSearchType: 'employeeCode',
    curSelectPA: {},
    paList: [],
    curSelectBD:{},
    bdList:[],
    change:false
}

class DelegateUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = initState;
    };


    show = (id,change) => {
        this.setState({
            investigationId: id,
            visible: true,
        });
        if(change){
            this.setState({change: true})
        }
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
                            text: `${user.userName}(${user.employeeCode})`,
                        });
                    });
                }
                if (investigation.paUserList && investigation.paUserList.length > 0){
                    investigation.paUserList.map(user => {
                        paList.push({
                            value: user.userId,
                            text: `${user.userName}(${user.employeeCode})`,
                        });
                    });
                }
                if (investigation.bdUserList && investigation.bdUserList.length > 0){
                    investigation.bdUserList.map(user => {
                        bdList.push({
                            value: user.userId,
                            text: `${user.userName}(${user.employeeCode})`,
                        });
                    });
                }
                this.setState({
                    investigation,
                    paList,
                    pmList,
                    bdList
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    hide = () => {
        this.setState(initState);
    };

    handleSelectPMSearchType = value => {
        this.setState({
            pmSearchType: value,
        });
    };

    handleSelectPMUser = value => {
        this.setState({
            curSelectPM: value,
        });
    };

    hasElement = (listArr, eleVal) => {
        let has = false;
        listArr.map(val => {
            if(val.value == eleVal){
                has = true;
                return;
            }
        })
        return has;
    }

    addFromCondition = (role, addList) => {
        const {pmList,paList,bdList} = this.state;
        
        if(role == "PM"){
            addList.map(val => {
                if(this.hasElement(pmList, val.value)){

                }else{
                    pmList.push(val);
                }
            })
            this.setState({pmList})
        }else if(role == "PA"){
            addList.map(val => {
                if(this.hasElement(paList, val.value)){

                }else{
                    paList.push(val);
                }
            })
            this.setState({paList})
        }else if(role == "BD"){
            addList.map(val => {
                if(this.hasElement(bdList, val.value)){

                }else{
                    bdList.push(val);
                }
            })
            this.setState({bdList})
        }
    }

    onAddPM = () => {
        const { curSelectPM, pmList } = this.state;
        if (curSelectPM != undefined && curSelectPM != null && curSelectPM.value != undefined && curSelectPM.value > 0){
            let hasContain = false;
            pmList.map(user => {
                if (user.value == curSelectPM.value){
                    hasContain = true;
                    return;
                }
            });
            if (hasContain == true){
                message.error("用户已存在");
            } else {
                pmList.push({
                    value: curSelectPM.value,
                    text: curSelectPM.text,
                });
                this.setState({
                    pmList,
                });
            }
        }
    };

    removePM = (value) => {
        const { pmList } = this.state;
        pmList.map((user, i) => {
            if (user.value == value){
                pmList.splice(i, 1);
                this.setState({
                    pmList,
                });
                return;
            }
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
                        <Col span={6}><Button type="primary" shape="circle" icon="close" size='small' onClick={this.removePM.bind(this, user.value)} /></Col>
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

    handleSelectPASearchType = value => {
        this.setState({
            paSearchType: value,
        });
    };

    handleSelectPAUser = value => {
        this.setState({
            curSelectPA: value,
        });
    };

    handleSelectBDUser = value => {
        this.setState({
            curSelectBD: value,
        });
    };

    onAddPA = () => {
        const { curSelectPA, paList } = this.state;
        if (curSelectPA != undefined && curSelectPA != null && curSelectPA.value != undefined && curSelectPA.value > 0){
            let hasContain = false;
            paList.map(user => {
                if (user.value == curSelectPA.value){
                    hasContain = true;
                    return;
                }
            });
            if (hasContain == true){
                message.error("用户已存在");
            } else {
                paList.push({
                    value: curSelectPA.value,
                    text: curSelectPA.text,
                });
                this.setState({
                    paList,
                });
            }
        }
    };

    removePA = value => {
        const { paList } = this.state;
        paList.map((user, i) => {
            if (user.value == value){
                paList.splice(i, 1);
                this.setState({
                    paList,
                });
                return;
            }
        });
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
                        <Col span={6}><Button type="primary" shape="circle" icon="close" size='small' onClick={this.removePA.bind(this, user.value)} /></Col>
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


    onAddBD = () => {
        const { curSelectBD, bdList } = this.state;
        if (curSelectBD != undefined && curSelectBD != null && curSelectBD.value != undefined && curSelectBD.value > 0){
            let hasContain = false;
            bdList.map(user => {
                if (user.value == curSelectBD.value){
                    hasContain = true;
                    return;
                }
            });
            if (hasContain == true){
                message.error("用户已存在");
            } else {
                bdList.push({
                    value: curSelectBD.value,
                    text: curSelectBD.text,
                });
                this.setState({
                    bdList,
                });
            }
        }
    };

    removeBD = value => {
        const { bdList } = this.state;
        bdList.map((user, i) => {
            if (user.value == value){
                bdList.splice(i, 1);
                this.setState({
                    bdList,
                });
                return;
            }
        });
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
                        <Col span={6}><Button type="primary" shape="circle" icon="close" size='small' onClick={this.removeBD.bind(this, user.value)} /></Col>
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

    morePM = () => {
        this.moreUserRef.show('PM');
    }

    morePA = () => {
        this.moreUserRef.show('PA');
    }

    moreBD = () => {
        this.moreUserRef.show('BD');
    }

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
                this.setState(initState);
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    viewUser = userId => {
        this.userDetailRef.show(userId);
    };

    render() {
        const { visible, confirmLoading, investigation, pmSearchType, paSearchType, change } = this.state;
        const pmSearchUrl = `${API_URL.team.userlist}`;
        let title = "";
        title = (change? "变更人员":"委派人员");
        return (
            <div>
            <Modal
                title={title}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal delegate-modal"
                wrapClassName="vertical-center-modal"
                width="500px"
                confirmLoading={confirmLoading}
            >
                <div>
                    <Row>
                        <Col span={6}>项目名称</Col>
                        <Col span={1}/>
                        <Col>{investigation.investigationName}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>项目编号：</Col>
                        <Col span={1}/>
                        <Col>{investigation.investigationCode}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>项目经理：</Col>
                        <Col span={1}/>
                        <Col span={16}>
                            <div className="select-gay">
                                
                                {
                                    this.getPMSource()
                                }
                                <InputGroup compact>
                                <UserSearchInput style={{width: 130,marginBottom:10}}
                                                handleSelectUser = {this.handleSelectPMUser}
                                                url = {`${API_URL.team.userlist}`}
                                                searchKey = 'keyword'
                                                placeholder="工号或姓名"
                                                dropdownClassName="user-auto-search"
                                />
                                <Button style={{marginBottom:10}} type="Default" onClick={this.morePM}>更多</Button>
                                </InputGroup>
                                <Button style={{display:'inline-block',marginBottom:10,marginLeft:20,marginTop:10}} type="primary" onClick={this.onAddPM}>添加</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{marginTop:10}}>项目管理员：</Col>
                        <Col span={1}/>
                        <Col span={16}>
                            <div style={{marginTop:10}} className="select-gay">
                            
                                {
                                    this.getPASource()
                                }
                                <InputGroup compact>
                                <UserSearchInput style={{width: 130,marginBottom:10}}
                                               handleSelectUser = {this.handleSelectPAUser}
                                               url = {`${API_URL.team.userlist}`}
                                               placeholder="工号或姓名"
                                               searchKey = 'keyword'
                                               dropdownClassName="user-auto-search"
                                />
                                <Button style={{marginBottom:10}} type="Default" onClick={this.morePA}>更多</Button>
                                </InputGroup>
                                <Button style={{display:'inline-block',marginBottom:10,marginLeft:20,marginTop:10}} type="primary" onClick={this.onAddPA}>添加</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                    <Col span={6} style={{marginTop:10}}>BD：</Col>
                    <Col span={1}/>
                    <Col span={16}>
                        <div style={{marginTop:10}} className="select-gay">
                        
                            {
                                this.getBDSource()
                            }
                            <InputGroup compact>
                            <UserSearchInput style={{width: 130,marginBottom:10}}
                                           handleSelectUser = {this.handleSelectBDUser}
                                           url = {`${API_URL.team.userlist}`}
                                           placeholder="工号或姓名"
                                           searchKey = 'keyword'
                                           dropdownClassName="user-auto-search"
                                           dropdownAlign={{
                                            points: ['bl', 'tl'], // align dropdown bottom-left to top-left of input element
                                            offset: [0, -4], // align offset
                                             overflow: {
                                               adjustX: 0, 
                                               adjustY: 0, // do not auto flip in y-axis
                                           },
                                         }}
                            />
                            <Button style={{marginBottom:10}} type="Default" onClick={this.moreBD}>更多</Button>
                            </InputGroup>
                            <Button style={{display:'inline-block',marginBottom:10,marginLeft:20,marginTop:10}} type="primary" onClick={this.onAddBD}>添加</Button>
                        </div>
                    </Col>
                </Row>
                </div>
            </Modal>
            <MoreConditionUser ref={el => { this.moreUserRef = el; }} addFromCondition={this.addFromCondition} />
            </div>
        )
    }
}

export default DelegateUser;
