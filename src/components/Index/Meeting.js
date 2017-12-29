import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import {Link} from 'react-router-dom'
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
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
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
                  rules: [{validator:this.validateHtml}],
                })(
                  <Ueditor/> //<Editor style={{width:460}}/>
                )}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.props.closeModalView.bind(this,'modalVisible','close')}>取消</Button>
              </FormItem>
            </Form>
            <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
           </div>
          
        )
    }
}

class SearchForm extends Component {
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const locationId = getFieldValue('locationId')
        const regionName = locationId && locationId.label        
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="会议标题">
                {getFieldDecorator('meetingTitle')(
                    <Input placeholder="请输入标题" />
                )}
                </FormItem>
                <FormItem label="会议时间">
                {getFieldDecorator('meetingTime')(
                    <RangePicker showTime style={{width:210}} />
                )}
                </FormItem>
                <FormItem label="会议地点">
                {getFieldDecorator('locationId')(
                    <SelectCitys placeholder={regionName}/>
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit" style={{float:'right'}}>查询</Button>
            </Form>
        );
    }
}

export default class Meeting extends Component {
state = {
    loading:false,
    pagination:{
        pageSize: config.pageSize,
        current: 1,
    },
    listData:[],
    detail:'',
    addInputValue: '',
    modalVisible: false,
    selectedRows: [],
    searchFormValues: {},
    isEdit:false,
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  loadListData = (params) => {
    const {pagination}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: API_URL.index.queryMeetingList,
        data: {
            offset: 1,
            limit: pagination.pageSize,
            ...params,
            meetingTime:null
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                const listData = data.datas || data.data;
                pagination.total = data.totalCount;
                this.setState({
                    loading: false,
                    listData,
                    pagination,
                });
            } else {
                Modal.error({ title: data.error });
            }
            this.setState({loading:false})
        }
    }
    $.sendRequest(options)
  }

  componentDidMount() {
    this.loadListData()
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    this.handleSelectRows(selectedRows);
    this.setState({ selectedRowKeys, totalCallNo });    
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { searchFormValues,} = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...searchFormValues,
      ...filters,
      offset:pagination.current,
    };
    if (sorter.field) {
      params.sort = sorter.field;
      params.direction = sorter.order == "descend" ? "DESC" :  "ASC";

    }
    
    this.setState({pagination},()=>{
      this.loadListData(params)
    })
  } 

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    // dispatch({
    //   type: 'rule/fetch',
    //   payload: {},
    // });
  }


  handleMenuClick = (e) => {

    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        // dispatch({
        //   type: 'rule/remove',
        //   payload: {
        //     no: selectedRows.map(row => row.no).join(','),
        //   },
        //   callback: () => {
        //     this.setState({
        //       selectedRows: [],
        //     });
        //   },
        // });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    const arr=[]
    rows.map(d => {
      arr.push(d.id)
    })
    this.setState({
      selectedRows: arr,
    });
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.searchFormRef.validateFields((err, fieldsValue) => {
      if (err) return;
      const rangeTimeValue = fieldsValue['meetingTime'] || null;
      fieldsValue.beginTime = rangeTimeValue && Object.keys(rangeTimeValue).length>0 ? rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss') :null
      fieldsValue.endTime = rangeTimeValue && Object.keys(rangeTimeValue).length>0 ? rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss') :null
      fieldsValue.regionId = fieldsValue.locationId && fieldsValue.locationId.value
      fieldsValue.regionName= fieldsValue.locationId && fieldsValue.locationId.label
      fieldsValue.locationId = null
      const {pagination}=this.state
      pagination.current = 1 
      this.setState({
        searchFormValues: fieldsValue,
        pagination
      },()=>{this.loadListData(fieldsValue)});      
    });
  }


  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }

// ********************************
  renderSearchForm() {
    const { selectedRows, searchFormValues } = this.state;
    const mapPropsToFields = () => ({ 
        meetingTitle:{value:searchFormValues.meetingTitle},
        regionName:{value:searchFormValues.regionName},
        locationId:{value:{value:searchFormValues.regionId,label:searchFormValues.regionName}},
        // meetingTime:{value: searchFormValues.beginTime && [moment(searchFormValues.beginTime),moment(searchFormValues.endTime)]},
        meetingTime:{value: searchFormValues.meetingTime},
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)
    return (
        <Row gutter={2}>
            <Col md={22} sm={24} >
                <SearchForm handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
            <Col md={2} sm={8} style={{textAlign:'right'}}>            
            {
                selectedRows.length > 0 &&
                <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(this.state.selectedRows)}} okText="是" cancelText="否">
                    <Button type="danger" style={{marginRight:10}}> 批量删除</Button>
                </Popconfirm>
            }            
                <Link to='/index/meetsave'><Button icon="plus" type="primary" >新建</Button></Link>
            </Col>
        </Row>
    );
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
                this.changeModalView('modalVisible','close')
                this.loadListData()
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

  changeModalView = (modalName,isShow,type,callback) => {    
    this.setState({
      [modalName]: isShow==='open' ? true : isShow==='close' ? false : false,
    })
    if(type=='new'){
      this.setState({
        isEdit:false,
      })
    }
    if(type=='edit'){
      this.setState({
        isEdit:true,
      })
    }    
    callback && callback()
    }


  render() {
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '会议标题',
        dataIndex: 'meetingTitle',
      },
      {
        title: '会议时间',
        dataIndex: 'meetingTime',
        sorter: true,
      }, 
      {
        title: '会议地点',
        dataIndex: 'location',
        sorter: true,
      },      
      {
        title: '创建时间',
        dataIndex: 'createTime', 
        sorter: true,
      },      
      {
        title: '操作',
        render: (text,record,index) => (
          <div>
            <Link  to={`/index/meetsave/${record.id}`}>修改</Link>
            <span className="ant-divider" />
            <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(record.id)}} okText="是" cancelText="否">
            <a href="javascript:;" >删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const lists = []
    listData.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
            id:d.meetingId,
            ...d,
            meetingTime:`${d.beginTime} ~ ${d.endTime}`
        }
        lists.push(list)
    })

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      ...pagination,
    };

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
    return (
      <div>
            <div>
              {this.renderSearchForm()}
            </div>
            <Table
              loading={loading}
              rowKey={record => record.id}
            //   rowSelection={rowSelection}
              onSelectRow={this.handleSelectRows}
              dataSource={lists}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              scroll={{y:lists.length > config.listLength ? config.scroll.y : null}}
            />
            <Modal
                title={isEdit ? '修改会议':'新建会议'}
                visible={modalVisible}
                width={800}
                onOk={this.handleAdd}
                onCancel={this.changeModalView.bind(this,'modalVisible','close')}
                footer={null}
            >
               <FormBox ref={el=>{this.formboxref = el}} closeModalView={this.changeModalView} handleSubmit={this.handleSubmit}/>
            </Modal>
      </div>
    );
  }
}
