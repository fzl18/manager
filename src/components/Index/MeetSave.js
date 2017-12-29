import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';
import Ueditor from '../../common/Ueditor/Ueditor';
import SelectCitys from '../common/SelectCitys';
import {config,uploadser} from '../common/config';

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
    }

    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,      
        });
      }
    
    handleChange = ({ fileList }) => {
      if(fileList.status=="error"){
        message.warn("图片上传出错了，请重试！")
        fileList = []
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
      const imgUrl= getFieldValue('mainImgUrl')
      const fileList = getFieldValue('mainImgUrl') ? [{
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
      if(typeof value =='string'){
          callback();
          return;
      }else if( value && value.fileList.length){
        callback();
        return;
      }
      callback('请添加图片');
    }

    render(){
        const { getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList} = this.state;
        const locationId = getFieldValue("locationId")
        const location = locationId && locationId.label
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
                label="会议标题"
              >
                {getFieldDecorator('meetingTitle', {
                  rules: [{
                    required: true, message: '请输入标题',
                  }],
                })(
                  <Input placeholder="请输入标题" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="会议主图"
              >
                {getFieldDecorator('mainImgName', {
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
                label="会议时间"
              >
                {getFieldDecorator('meetingTime', {
                  rules: [{
                    required: true, message: '请选择时间',
                  }],
                })(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['开始时间','结束时间']}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="会议地点"
              >
                {getFieldDecorator('locationId', {
                  rules: [{
                    required: true, message: '请选择地点',
                  }],
                })(
                    <SelectCitys style={{width:150}} placeholder={location} 
                    // defaultValue={locationId}
                    // ChangeSelectprovinces ={this.ChangeSelectprovinces}
                    // ChangeSelect = {this.handleChangeSelect.bind(this, 'workCityId')}
                    />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="内容"
              >
                {getFieldDecorator('htmlText', {
                  rules: [{required: true,validator:this.validateHtml}],
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

export default class MeetSave extends React.Component {
    state={
        isEdit:false,
        editId:'',
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.formboxref.validateFieldsAndScroll((err, values) => { 
            const rangeTimeValue = values['meetingTime'];
          if (!err) {
            values.regionId = values.locationId ? values.locationId.value : null
            values.mainImgName = values.mainImgName.file ? values.mainImgName.file.response.data[0].fileName : values.mainImgName
            values.beginTime = rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss')
            values.endTime = rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss')
             
            values.locationId=null
            values.meetingTime=null
            this.save(values)
          }
        });
      }
    
      save = (params) => {
        const {isEdit,editId}=this.state
        const options ={
            method: 'POST',
            url: isEdit ? API_URL.index.modifyMeeting :  API_URL.index.addMeeting,
            data: {
                ...params,
                meetingId:isEdit ? editId : null,
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
            url: API_URL.index.queryMeetingList,
            data: {
                offset: 1,
                limit: 1,
                meetingId:id,
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
            url: API_URL.index.deleteMeeting,
            data: {
                meetingId:id,
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
                  meetingId:{value:detail.meetingId},
                  meetingTitle:{value:detail.meetingTitle},
                  mainImgName:{value:detail.mainImgName},
                  mainImgUrl:{value:detail.mainImgUrl},
                  locationId:{value:{value:detail.locationId,label:detail.location}},
                  meetingTime:{value:[moment(detail.beginTime),moment(detail.endTime)]},
                   htmlText:{value:detail.htmlText},
              } : null
            )
          FormBox=Form.create({mapPropsToFields})(FormBox)
        return( <FormBox ref={el=>{this.formboxref = el}} goback={this.props.history.goBack} handleSubmit={this.handleSubmit}/> )
    }
}