import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';
import {config, uploadser} from '../common/config';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'
let uuid=0

class AddInput extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    console.log(value)    
    this.state = {
      hospital: value.hospital || '',
      department:value.department || '',
      reseacher:value.reseacher || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    // }
  }

  handleChange = (name,e) => {
    this.setState({
      [name]:e.target.value,
    },()=>{this.triggerChange()})

  }

  triggerChange = () => {
    const onChange = this.props.onChange;
    console.log(onChange)
    if (onChange) {
      onChange(Object.assign({}, this.state));
      console.log(this.state)
    }
  }
  render(){
    return(      
      <InputGroup style={this.props.style} size='large'>
        <Col span={7}>
          <Input placeholder="请输入医院" onChange={this.handleChange.bind(this,'hospital')}/>
        </Col>
        <Col span={7}>
          <Input placeholder="请输入科室" onChange={this.handleChange.bind(this,'department')} />
        </Col>
        <Col span={7}>
          <Input placeholder="请输入主要研究者" onChange={this.handleChange.bind(this,'reseacher')} />
        </Col>
      </InputGroup>
    )
  }
}

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
    
    handleChange = ({fileList}) => {
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
            let html = this.delHtmlTag(value.editorContent)
            if (html) {
                callback();
            return;
            }
        }      
        callback()
        return
    }

    remove = (k) => {
      const { form } = this.props;
      const centers = form.getFieldValue('centers');
      if (centers.length === 1) {
        return;
      }  
      // can use data-binding to set
      form.setFieldsValue({
        centers: centers.filter(key => key !== k),
      });
    }

    add = () => {
      uuid++;
      const { form } = this.props;
      const centers = form.getFieldValue('centers');
      const nextKeys = centers.concat(uuid);
      form.setFieldsValue({
        centers: nextKeys,
      });
    }
    
    componentDidMount(){
      const  { getFieldValue} = this.props.form;
      const imgUrl= getFieldValue('mainImgUrl')
      const fileList = getFieldValue('mainImgUrl') ? [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: `http://${imgUrl}`
      }]: []
      this.setState({
        fileList
      })
    }

    normFile = (rule, value, callback) => {
      console.log(typeof value)
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
        const { getFieldDecorator, getFieldsValue, setFieldsValue, getFieldValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList} = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
          </div>
        );
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            md: { span: 10 },
          },
        };
    
        const submitFormLayout = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 12, offset: 7 },
            md: { span: 10, offset: 7 },
          },
        };

        getFieldDecorator('centers', {initialValue: [0]})
        const centers = getFieldValue('centers');
        const formItems = centers.map((k, index) => {
          return (
            <FormItem
              {...(index === 0 ? formItemLayout : submitFormLayout)}
              label={index === 0 ? '研究中心' : ''}
              required={false}
              key={k}
            >
              {getFieldDecorator(`item-${k}`, {initialValue: [{hospital:'',department:'',reseacher:''}]
                // validateTrigger: ['onChange', 'onBlur'],
                // rules: [{
                //   required: true,
                //   whitespace: true,
                //   message: "Please input passenger's name or delete this field.",
                // }],
              })(
                <div style={{width:'130%'}}>
                  <AddInput style={{ width: '90%',display:'inline' ,marginRight: 8 }} />
                  {centers.length > 1 ? (
                    <Icon
                      className="dynamic-delete-button"
                      type="close-square"
                      style={{color:'red',fontSize:20}}
                      disabled={centers.length === 1}
                      onClick={() => this.remove(k)}
                    />
                  ) : null}
                </div>
              )}
              
            </FormItem>
          );
        });

        return(
            <div>
            <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="研究课题题目"
              >
                {getFieldDecorator('researchSubjectTitle', {
                  rules: [{
                    required: true, message: '请输入标题',
                  }],
                })(
                  <Input placeholder="请输入标题" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="课题主图"
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
                label="适应症"
              >
                {getFieldDecorator('malady', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="研究类型"
              >
                {getFieldDecorator('researchType', {
                  rules: [{
                    
                  }],
                })(
                    <Select allowClear >
                        <Option value='INTERVENTION'>干预</Option>
                        <Option value='NON-INTERVENTION'>非干预</Option>
                    </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="干预手段"
              >
                {getFieldDecorator('interveneMethod', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="临床试验分期"
              >
                {getFieldDecorator('clinicalTrailStaging', {
                  rules: [{
                    
                  }],
                })(
                    <Select allowClear>
                        <Option value='1'>I期</Option>
                        <Option value='2'>II期</Option>
                        <Option value='3'>III期</Option>
                        <Option value='4'>IV期</Option>
                        <Option value='999'>不适用</Option>
                    </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="申办者"
              >
                {getFieldDecorator('sponsor', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="CRO"
              >
                {getFieldDecorator('cro', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="主要研究者"
              >
                {getFieldDecorator('reseacher', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="研究状态"
              >
                {getFieldDecorator('researchStatus', {
                  rules: [{
                    
                  }],
                })(
                    <Select allowClear>
                        <Option value='PREPARING '>准备中</Option>
                        <Option value='INTO'>入组中</Option>
                        <Option value='IN'>入组完成</Option>
                        <Option value='COMPLETED'>已完成</Option>
                    </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="研究时间"
              >
                {getFieldDecorator('subjecgtTime', {
                  
                })(
                  <RangePicker/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="研究方案"
              >
                {getFieldDecorator('htmlText', {
                  rules: [{validator:this.validateHtml}],
                })(
                  <Editor style={{width:460}}/>
                )}
              </FormItem>
              {formItems}
              <FormItem {...submitFormLayout}>
                <Button type="primary" onClick={this.add} style={{ width: '60%'}}>
                  <Icon type="plus" /> 添加研究中心
                </Button>
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
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="研究课题题目">
                {getFieldDecorator('researchSubjectTitle')(
                    <Input placeholder="请输入标题" />
                )}
                </FormItem>
                <FormItem label="研究类型">
                {getFieldDecorator('researchType')(
                    <Select allowClear style={{width:100}}>
                        <Option value='INTERVENTION'>干预</Option>
                        <Option value='NON-INTERVENTION'>非干预</Option>
                    </Select>
                )}
                </FormItem>
                <FormItem label="研究时间">
                {getFieldDecorator('subjecgtTime')(
                    <RangePicker style={{width:210}} />
                )}
                </FormItem>
                <FormItem label="研究状态">
                {getFieldDecorator('researchStatus')(
                    <Select allowClear style={{width:100}}>
                        <Option value='PREPARING '>准备中</Option>
                        <Option value='INTO'>入组中</Option>
                        <Option value='IN'>入组完成</Option>
                        <Option value='COMPLETED'>已完成</Option>
                    </Select>
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit" style={{float:'right'}}>查询</Button>
            </Form>
        );
    }
}


export default class Subject extends Component {
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
        url: API_URL.index.queryResearchSubjectList,
        data: {
            offset: 1,
            limit: pagination.pageSize,
            ...params,
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
    const { searchFormValues } = this.state;
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
    };
    if (sorter.field) {
      params.sort = sorter.field;
      params.direction = sorter.order == "descend" ? "DESC" :  "ASC";

    }
    this.loadListData(params)
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
      console.log(fieldsValue)
      const rangeTimeValue = fieldsValue['subjecgtTime'] || null;
      fieldsValue.beginTime = rangeTimeValue && Object.keys(rangeTimeValue).length>0 ? rangeTimeValue[0].format('YYYY-MM-DD') :null
      fieldsValue.endTime = rangeTimeValue && Object.keys(rangeTimeValue).length>0 ? rangeTimeValue[1].format('YYYY-MM-DD') :null
      fieldsValue.subjecgtTime=''
      this.loadListData(fieldsValue)
      this.setState({
        searchFormValues: fieldsValue,
      });
    });
  }


  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }


  renderSearchForm() {
    const { selectedRows, searchFormValues } = this.state;
    const mapPropsToFields = () => ({ 
        researchSubjectTitle:{value:searchFormValues.researchSubjectTitle},
        researchType:{value:searchFormValues.researchType},
        researchStatus:{value:searchFormValues.researchStatus},
        subjecgtTime:{value:searchFormValues.beginTime && [moment(searchFormValues.beginTime),moment(searchFormValues.endTime)]},
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
                <Button icon="plus" type="primary" onClick={()=>{this.changeModalView('modalVisible','open','new')}}>新建</Button>
            </Col>
        </Row>
    );
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {
        console.log(values)
        values.beginTime =values.subjecgtTime && values.subjecgtTime[0].format(dayFormat)
        values.endime = values.subjecgtTime && values.subjecgtTime[1].format(dayFormat)
        values.mainImgName = values.mainImgName && values.mainImgName.file.response.data[0].fileName
        values.htmlText = values.htmlText && values.htmlText.editorContent 
        values.subjecgtTime = null
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url: isEdit ? API_URL.index.modifyResearchSubject :  API_URL.index.addResearchSubject,
        data: {
            ...params,
            researchSubjectId:isEdit ? editId : null,
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
        url: API_URL.index.queryResearchSubjectList,
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
        url: API_URL.index.deleteResearchSubjectId,
        data: {
            offset: 1,
            limit: 1,
            researchSubjectId:id,
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
        title: '研究课题题目',
        dataIndex: 'researchSubjectTitle',
      },
      {
        title: '研究类型',
        dataIndex: 'researchType',
        sorter: true,
        render: (text,record,index) => (
            record.researchType ==='INTERVENTION' ?
                <div>干预</div> : 
            record.researchType ==='NON-INTERVENTION' ?  
                <div>非干预</div> : null                        
        )
      }, 
      {
        title: '研究开始时间',
        dataIndex: 'beginTime',
        sorter: true,
      },      
      {
        title: '研究结束时间',
        dataIndex: 'endTime', 
        sorter: true,
      },      
      {
        title: '研究状态',
        dataIndex: 'researchStatus', 
        sorter: true,
        render: (text,record,index) => {
            let con
            switch(record.researchStatus){
                case "PREPARING" :
                con = "准备中"
                break;
                case "INTO" :
                con= "入组中"
                break;
                case "IN" :
                con = "入组完成"
                break;
                case "COMPLETED" :
                con= "已完成"
                break;
            }
            return (<div>{con}</div>)
        }
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
            <a href="javascript:;" onClick={()=>{this.changeModalView('modalVisible','open','edit',()=>{ this.edit(record.id) })}}>修改</a>
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
            id:d.researchSubjectId,
            ...d,
            subjectTime:`${d.beginTime} ~ ${d.endTime}`,
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
            researchSubjectTitle:{value:detail.researchSubjectTitle},
            researchType:{value:`${detail.researchType}`},
            researchSubjectId:{value:detail.researchSubjectId},
            subjectTime:{value:[moment(detail.beginTime),moment(detail.endTime)]},
            clinicalTrailStaging:{value:`${detail.clinicalTrailStaging}`},
            cro:{value:detail.cro},
            htmlText:{value:{editorContent:detail.htmlText}},
            interveneMethod:{value:detail.interveneMethod},
            mainImgName:{value:detail.mainImgName},
            malady:{value:detail.malady},
            reseacher:{value:detail.reseacher},
            researchStatus:{value:`${detail.researchStatus}`},
            researchSubjectId:{value:detail.researchSubjectId},
            sponsor:{value:detail.sponsor},
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
            />
            <Modal
                title={isEdit ? '修改动态':'新建动态'}
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
