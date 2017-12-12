import React from 'react';
import { Modal, Row, Col, Input, Radio, Select, message, Button, Icon, InputNumber, Checkbox } from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
import UserSearchInput from './UserSearchInput';
import UserDetail from '../user/UserDetail';
import './css/list.less';

const Option = Select.Option;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;
const initState={
    visible: false,
    confirmLoading: false,
    role:'',
    experienceSymbol:'GreatThan',
    experience:null,
    fteSymbol:'GreatThan',
    fte:null,
    employeeList:[],
    addList:[],
    searchLoading: false,
    checkedValues:[]
}
class MoreConditionUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = initState;
    };


    show = role => {
        this.setState({
            role,
            visible: true,
        });
        // const options = {
        //     url: `${API_URL.user.queryUserByExpandCond}`,
        //     data: {
        //         investigationId: id,
        //     },
        //     dataType: 'json',
        //     doneResult: ( data => {
        //         const investigation = data.data.investigation;
        //         const pmList = [];
        //         const paList = [];
        //         if (investigation.pmUserList && investigation.pmUserList.length > 0){
        //             investigation.pmUserList.map(user => {
        //                 pmList.push({
        //                     value: user.userId,
        //                     text: `${user.userName}(${user.employeeCode}`,
        //                 });
        //             });
        //         }
        //         if (investigation.paUserList && investigation.paUserList.length > 0){
        //             investigation.paUserList.map(user => {
        //                 paList.push({
        //                     value: user.userId,
        //                     text: user.userName,
        //                 });
        //             });
        //         }
        //         this.setState({
        //             investigation,
        //             paList,
        //             pmList,
        //         });
        //     }),
        // };
        // AjaxRequest.sendRequest(options);
    };

    hide = () => {
        this.setState(initState);
    };

    handleChangeSelect = (key,value) =>{
        this.setState({
            [key]:value
        })
    }

    handleChangeInput = (key,value) =>{
        this.setState({
            [key]:value
        })
    }

    handleSearch = () =>{
        const {
            experienceSymbol,
            experience,
            fteSymbol,
            fte} = this.state;
        this.setState({
            searchLoading:true
        })
        const options = {
            url: `${API_URL.user.queryUserByExpandCond}`,
            data: {
                experienceSymbol,
                experience,
                fteSymbol,
                fte
            },
            method:'post',
            dataType: 'json',
            doneResult: ( data => {
                const employeeList = [];
                if(data){
                    if(data.datas){
                        data.datas.map((value,index) =>{
                            const obj ={};
                            obj.value=value.userId;
                            obj.label = `${value.userCompellation}(${value.employeeCode})`
                            employeeList.push(obj);
                        })
                    }
                }
                this.setState({
                    employeeList:[],
                    addList:[]
                },function(){
                    this.setState({employeeList,searchLoading:false})
                })
            }),
            errorResult: (() => {
                this.setState({searchLoading:false})
            }) 
        };
        AjaxRequest.sendRequest(options);

    }

    onCheckboxChange = (checkedValues,e) =>{
        const {employeeList} = this.state;
        const addList = [];
        if(checkedValues){
            checkedValues.map((value,index) => {
                const obj ={};
                // employeeList.map((v,i) => {
                //     if(v.value == value){
                //         obj.value = value;
                //         obj.text = v.label;
                //         addList.push(obj);
                //     }
                // })

                employeeList.some((v,i) => {
                    if(v.value == value){
                        obj.value = value;
                        obj.text = v.label;
                        addList.push(obj);
                        return;
                    }
                })
            })
        }
        this.setState({
            addList,
            checkedValues
        })
    }

    
    handleSubmit = () => {
        const {role,addList} = this.state;
        this.props.addFromCondition(role,addList);
        this.hide();
    }

    render() {
        const {visible,
            confirmLoading,
            role,
            experienceSymbol,
            experience,
            fteSymbol,
            fte,
            employeeList,
            searchLoading,
            checkedValues
        } = this.state;
        // const options = [
        //     { label: 'Apple', value: 'Apple' },
        //     { label: 'Pear', value: 'Pear' },
        //     { label: 'Orange', value: 'Orange1' },
        //     { label: 'Apple', value: 'Apple1' },
        //     { label: 'Pear', value: 'Pear1' },
        //     { label: 'Orange', value: 'Orange12' },
        //     { label: 'Apple', value: 'Apple2' },
        //     { label: 'Pear', value: 'Pear2' },
        //     { label: 'Orange', value: 'Orange2' },
        //   ];
        return (
            <Modal
                title="更多检索条件"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="condition-modal"
                wrapClassName="vertical-center-modal"
                width="560px"
                //confirmLoading={confirmLoading}
                footer={[
                    <Button key="submit" type="primary" size="large" loading={confirmLoading} onClick={this.handleSubmit}>
                      添加
                    </Button>,
                  ]}
            >
            <div className="condition">
                <div className="con-detail">
                    <div className="con-row">
                        <label className="row-label">临床研究经验：</label>
                        <InputGroup compact>
                            <Select value={experienceSymbol} onChange={this.handleChangeSelect.bind(this, 'experienceSymbol')}>
                                <Option value="GreatThan">&gt;</Option>
                                <Option value="NotLess">&ge;</Option>
                                <Option value="LessThan">&lt;</Option>
                                <Option value="NotGreat">&le;</Option>
                                <Option value="Equals">=</Option>
                            </Select>
                            <InputNumber value={experience} formatter={value => value !== value ? '' : value} onChange={this.handleChangeInput.bind(this, 'experience')} style={{width:'60px'}} />
                             &nbsp;月
                        </InputGroup>
                        
                    </div>
                    <div className="con-row">
                        <label className="row-label">上月工作量：</label>
                        <InputGroup compact>
                            <Select value={fteSymbol} onChange={this.handleChangeSelect.bind(this, 'fteSymbol')}>
                                <Option value="GreatThan">&gt;</Option>
                                <Option value="NotLess">&ge;</Option>
                                <Option value="LessThan">&lt;</Option>
                                <Option value="NotGreat">&le;</Option>
                                <Option value="Equals">=</Option>
                            </Select>
                            <InputNumber value={fte} formatter={value => value !== value ? '' : value} onChange={this.handleChangeInput.bind(this, 'fte')} style={{width:'60px'}} />
                            &nbsp;FTE
                        </InputGroup>
                    </div>
                </div>
                <div className="con-search">
                    <Button type="primary" loading={searchLoading} onClick={this.handleSearch}>检索</Button>
                </div>
                <div className="clear"></div>
            </div>
            <div className="con-options">
                <label className="row-label">
                    请选择：
                </label>
                <div className="clear"></div>
                <div className="option-list">
                    <CheckboxGroup options={employeeList} value={checkedValues} onChange={this.onCheckboxChange} />
                </div>
            </div>
            </Modal>
        )
    }
}

export default MoreConditionUser;
