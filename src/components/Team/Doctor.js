import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';
import {config,uploadser} from '../common/config';
import SortList from '../common/SortList';

const FormItem = Form.Item;
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
    console.log(fileList)
    if(fileList.status=="error" ){
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
    callback('请输入内容！');
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
      const { getFieldDecorator, getFieldsValue, setFieldsValue} = this.props.form;
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
          sm: { span: 10, offset: 7 },
        },
      };        
      return(
          <div>
          <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="医生姓名"
            >
              {getFieldDecorator('lastTendencyTitle', {
                rules: [{
                  required: true, message: '请输入姓名',
                }],
              })(
                <Input placeholder="请输入姓名" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="医生头像"
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
              label="医生职称"
            >
              {getFieldDecorator('po', {
                rules: [{
                  required: true, message: '请选择',
                }],
              })(
                <Select>
                  <Option value='dd'>sddd</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="擅长"
            >
              {getFieldDecorator('cs', {
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
                <Editor style={{width:460}}/>
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
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="医生姓名">
                {getFieldDecorator('name')(
                    <Input placeholder="请输入医生姓名" />
                )}
                </FormItem>
                <FormItem label="医生职称">
                {getFieldDecorator('po')(
                    <Input placeholder="请输入医生职称" />
                )}
                </FormItem>
                <FormItem label="已绑账号">
                {getFieldDecorator('bind')(
                    <Input placeholder="请输入已绑账号" />
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit" style={{float:'right'}}>查询</Button>
            </Form>
        );
    }
}

export default class Doctor extends Component {
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
    sortModalVisible:false
  };

  loadListData = (params) => {
    const {pagination}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: API_URL.education.queryPopularScienceCategoryList,
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

  }


  handleMenuClick = (e) => {

    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
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
            categoryName:{value:searchFormValues.categoryName},
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={18} sm={24} >
                <SearchForm handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
            <Col md={6} sm={8} style={{textAlign:'right'}}>            
            {
                selectedRows.length > 0 &&
                <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(this.state.selectedRows)}} okText="是" cancelText="否">
                    <Button type="danger" style={{marginRight:10}}> 批量删除</Button>
                </Popconfirm>
            }            
                <Button icon="plus" type="primary" onClick={()=>{this.changeModalView('modalVisible','open','new')}}>新建</Button>
                <Button style={{marginLeft:10}} icon="bar-chart" type="primary" onClick={this.sort}>排序</Button>
            </Col>
        </Row>
    );
  }


     /**
     * 排序调整
     */
    sort = () => {
        const {listData} = this.state;
        const sortList = [];
        listData.map(item => {
            // if (item.moduleDefineName != '录入者'){
            //     sortList.push({
            //         key: item.moduleDefineCode,
            //         name: item.moduleDefineName,
            //     });
            // }
        });
        this.sortListRef.show(sortList);
    }

  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {             
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url: isEdit ? API_URL.education.modifyPopularScienceCategory :  API_URL.education.addPopularScienceCategory,
        data: {
            ...params,
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
        url: API_URL.education.queryPopularScienceCategoryList,
        data: {
            offset: 1,
            limit: 1,
            lastTendencyId:id,
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
        url: API_URL.education.deletePopularScienceCategory,
        data: {
            offset: 1,
            limit: 1,
            popularScienceCategoryId:id,
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
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, sortModalVisible, pagination } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '医生姓名',
        dataIndex: 'Name',
      },
      {
        title: '医生职称',
        dataIndex: 'po',
      },
      {
        title: '擅长',
        dataIndex: 'sc',
      },
      {
        title: '已绑账号',
        dataIndex: 'bind',
      },
      {
        title: '操作',
        render: (text,record,index) => (
          <div>
            {record.isbind ?
            <a href="javascript:;" onClick={()=>{this.changeModalView('modalVisible','open','edit',()=>{ this.edit(record.id) })}}>绑定账号</a> :
            <a href="javascript:;" onClick={()=>{}} disabled>重新绑定</a>
            }
            <span className="ant-divider" />
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
            id:d.popularScienceCategoryId,
            ...d,
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
            categoryName:{value:detail.categoryName},
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
            <SortList ref={el => { this.sortListRef = el; }}
                            // reload={this.loadData}
                            sortUrl={API_URL.education.sortPopularScienceCategory}
                            title={"分类排序"}
                            // data={{typeName,}}
                            data={{}}
            />
      </div>
    );
  }
}
