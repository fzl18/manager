import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';
import SortList from '../common/SortList';
import SearchSelect from '../common/SearchSelect'

const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'

class FormBox extends React.Component {
    state={        
        submitting:false,
        previewVisible: false,
        previewImage:'',
        fileList:[],
        sourceData:[],
        doctorList:[],
        doctorName:'',
    }
  
    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,      
        });
      }
    
    handleChange = ({ fileList }) => {
      console.log(fileList)
      if(fileList.response){
        if(fileList.response.error){
          console.log(fileList.response.error)
          message.warn("图片上传出错了，请重试！")
          fileList = []
        }        
      }
      this.setState({fileList})
    }
  
    delHtmlTag = (str)=>{
      return str.replace(/<[^>]+>/g,"");
    }
  
    validateHtml=(rule, value, callback)=>{      
      if(value){
        let html = this.delHtmlTag(value)
        if (html) {
          callback();
          return;
        }
      }      
      callback('请输入内容！');
    }
    
    componentDidMount(){
      const  { getFieldValue} = this.props.form;
      const userCompellation = getFieldValue('userCompellation')
      this.setState({
        doctorName:userCompellation || this.state.userCompellation
      })
      const imgUrl= getFieldValue('doctorImgUrl')
      const fileList = getFieldValue('doctorImgUrl') ? [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: imgUrl
      }]: []
      this.setState({
        fileList
      })
    }
  
    normFile = (rule, value, callback) => {
      console.log(value)
      if(typeof value =='string'){
          callback();
          return;
      }else if( value && value.fileList.length){
        callback();
        return;
      }
      callback('请添加图片');
    }
  
    handleSelect=(v)=>{    
      this.state.sourceData.map(data => {
        if(data.userId == v.key){
          this.setState({
            doctorName:data.userCompellation
          })
        }
      })    
    }
  
    parserDataDoctor = dt => {
      if ((dt.data || dt.datas) ) {
          const sourceData = dt.data ? dt.data : dt.datas
          // console.log(sourceData)
          const data = sourceData.map(r => ({
              text: r.userName+"["+r.userCompellation+"]",
              value: r.userId,
          }));
          this.setState({
            doctorList:data,
            sourceData
          });
      } else {
          this.setState({
            doctorList: [],
          });
      }
    };
  
  
    render(){
        const { getFieldDecorator, getFieldValue, setFieldsValue,getFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList,doctorList,doctorName} = this.state;
        const userName = getFieldValue('userName') 
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
          </div>
        );
        const {formItemLayout,submitFormLayout} = config 
        return(
            <div>
            <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="医生账号"
              >
                {getFieldDecorator('userId', {
                  rules: [{
                    required: true, message: '请选择',
                  }],
                })(
                  <SearchSelect url={API_URL.usermanager.queryDoctorByHospitalDepartmentId} sourceData={doctorList}
                    searchParam={{departmentStatus:'INACTIVE'}}
                    searchKey = 'userMobile'
                    parserData={this.parserDataDoctor}
                    handleSelect={this.handleSelect}
                    disabled = {this.props.disabled}
                    placeholder={ userName || " 输入手机号码" }/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="医生姓名"
              >
                {doctorName}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="医生头像"
              >
                {getFieldDecorator('doctorImgName', {
                  rules: [{
                    required: true, message: '请添加图片',
                    validator: this.normFile,
                  }],
                })(
                  <Upload
                    action={uploadser}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>              
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="医生职称"
              >
                {getFieldDecorator('doctorPosition', {
                  rules: [{
                    required: true, message: '请选择',
                  }],
                })(
                  <Select placeholder="请选择" allowClear>
                    <Option value = "主任医师">主任医师</Option>
                    <Option value = "副主任医师">副主任医师</Option>
                    <Option value = "主治医师">主治医师</Option>
                    <Option value = "住院医师">住院医师</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="擅长"
              >
                {getFieldDecorator('doctorAdept', {
                  rules: [{
                    required: true, message: '请输入擅长',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="内容"
              >
                {getFieldDecorator('htmlText', {
                  rules: [{
                    required: true,
                    validator: this.validateHtml,
                  }],
                })(
                  <Ueditor/> //<Editor style={{width:460}}/>
                )}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.props.goback}>返回</Button>
              </FormItem>
            </Form>
            <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
           </div>
          
        )
    }
  }

export default class DoctorSave extends React.Component {
    state={
        isEdit:false,
        editId:'',
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.formboxref.validateFieldsAndScroll((err, values) => {      
          if (!err) {
             
            // values.doctorImgName = values.doctorImgName.file ? values.doctorImgName.file.response.data[0].fileName : values.doctorImgName
            values.doctorImgName = "ddds.png"
            values.userId = values.userId.key || values.userId
            console.log(values)
            this.save(values)
          }
        });
      }
    
      save = (params) => {
        const {isEdit,editId}=this.state
        const options ={
            method: 'POST',
            url: isEdit ? API_URL.index.modifyDepartmentDoctor :  API_URL.index.addDepartmentDoctor,
            data: {
                ...params,
                ydataUuid: isEdit ? editId : null
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    notification['success']({
                        message: data.success,
                        description: '',
                      })                    
                    this.props.history.goBack()
                } else {
                    Modal.error({ title: data.error});
                }            
            }
        }
        $.sendRequest(options)
      }
    
      edit=(id)=>{
        const options ={
            method: 'POST',
            url: API_URL.index.queryDepartmentDoctor,
            data: {
                offset: 1,
                limit: 1,
                userId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const detail = data.datas[0] || data.data[0];
                    this.setState({
                        isEdit:true,
                        detail,
                        editId:id,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
      }
    
    
      del = (id) => {
        const options ={
            method: 'POST',
            url: API_URL.index.removeDepartmentDoctor,
            data: {
                offset: 1,
                limit: 1,
                userId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    notification['success']({
                        message: data.success,
                        description: '',
                      })
                    this.loadListData()
                } else {
                    Modal.error({ title: data.error });
                }            
            }
        }
        $.sendRequest(options)
      }

    componentDidMount(){        
        const { id } = this.props.match ? this.props.match.params : ''
        if(id){
          this.edit(id)
        }
    }

    render(){
        const {isEdit, detail}=this.state
        const mapPropsToFields = () => (        
            isEdit ?        
              { 
                  userCompellation:{value:detail.userCompellation},
                  userId:{value:detail.userId},
                  userName:{value:detail.userName},
                  doctorImgName:{value:detail.doctorImgName},
                  doctorImgUrl:{value:detail.doctorImgUrl},
                  doctorPosition:{value:detail.doctorPosition},
                  doctorAdept:{value:detail.doctorAdept},
                   htmlText:{value:detail.htmlText},
              } : null
            ) 
          FormBox=Form.create({mapPropsToFields})(FormBox)
        return( <FormBox disabled={isEdit} ref={el=>{this.formboxref = el}} goback={this.props.history.goBack} handleSubmit={this.handleSubmit}/> )
    }
}