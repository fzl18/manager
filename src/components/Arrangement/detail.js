import React from "react";
import moment from "moment";
import {message, Breadcrumb, Modal, Button, Table, DatePicker,Tag,Icon,Popconfirm,TimePicker,notification} from "antd";
import API_URL from "../../common/url";
import $ from "../../common/AjaxRequest";
import {config,uploadser} from '../common/config';

const { MonthPicker, RangePicker } = DatePicker;
const dayFormat = 'YYYY-MM-DD'
const TimeFormat = 'YYYY-MM-DD HH:mm:ss';

export default class ArrangeDetail extends React.Component {
    state = {
        loading: false,
        data: [],
        pagination:{
            pageSize: 15,
            current: 1,
        },
        weekNum:null,
        curweek: moment(),
        weekStart: moment().subtract(moment().day() - 1,'days'),
        weekEnd: moment().add( 7- moment().day() ,'days'),
        dataList: [],
        timeVisible:false,
        editId:null,
        dayIndex:null,
        beginTime:null,
        endTime:null,
    };

    getColumns =()=>{
        const {weekStart} = this.state;
        let begin = weekStart.format("YYYY-MM-DD")
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width:60,
            },{
                title: '医生姓名',
                dataIndex: 'doctorName',
                width:120,
            }];
        for(let i=0;i<7;i++){
                columns.push({
                    title: moment(begin).add(i,'days').format("YYYY-MM-DD") ,
                    dataIndex:`time${i}`,
                    key:`time${i}`,
                    width:100,
                    render:(text,record)=>
                      <div style={{textAlign:'center'}}>
                      {
                        record[`time${i}`].map((d,i)=><div key={i}>{d.schedulingTime} <Popconfirm title="确定要删除?" onConfirm={this.del.bind(this,d.schedulingDetailsId)} onCancel={()=>{}} okText="是" cancelText="否">
                        <a href="javascript:;"><Icon type="close" style={{color:'red'}}/></a></Popconfirm></div>)
                      }
                      <div key={i}><a href="javascript:;" onClick={()=>{this.setState({editId:record.id,dayIndex:i,timeVisible:true,t1:'',t2:''})}}><Icon type="plus-circle" /></a></div>
                      </div>
                });
            }
            
        return columns;
    };

    getDataSource =()=>{
        const {listData,pagination,weekStart}=this.state
        const sites=[]
        let begin = weekStart.format("YYYY-MM-DD")
        listData && listData.map((d,i)=>{
            let times={}
            for(let k=0;k<7;k++){
                times[`time${k}`]=[]
                d.schedulingDetailsList.map(v=>{
                    moment(begin).add(k,'days').format("YYYY-MM-DD") == moment(v.schedulingBeginTime).format("YYYY-MM-DD") ?
                    times[`time${k}`].push({schedulingTime:v.schedulingTime,schedulingDetailsId:v.schedulingDetailsId}) : null
                })
            }            
            let list = {
                index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
                id:d.doctorGroupMemberId,
                doctorName:d.ydataAccount.ydataAccountCompellation,
                ...d,
                ...times,
            }
            sites.push(list)
        })
        return sites;
    };

    loadData = (params)=>{
        const {weekStart,curweek,weekEnd,pagination} = this.state
        this.setState({loading:true})
        const options = {
            method: 'POST',
            url: API_URL.arrangement.querySchedulingDetails,
            data: {
                id:this.props.match.params.id,
                begin:weekStart.format('YYYY-MM-DD'),
                end:weekEnd.format('YYYY-MM-DD'),
                ...params
            },
            type: 'json',
            doneResult: data => {
                if (!data.error) {
                    const listData = data.doctorGroupMembers;
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
        };
        $.sendRequest(options);
    }

    
    add=()=>{
      const {editId,beginTime,endTime,dayIndex,weekStart,t1,t2}=this.state
      const startDay = weekStart.format("YYYY-MM-DD")
      if( !beginTime || !endTime){ message.warn('时间段不能为空！'); return }
      if(t1.isAfter(t2)){ message.warn('开始时间不能晚于结束时间！'); return }
      const options = {
        method: 'get',
        url: API_URL.arrangement.addScheduling,
        data: {
            doctorGroupMemberId:editId,
            schedulingBeginTime: `${moment(startDay).add(dayIndex,'days').format("YYYY-MM-DD")} ${beginTime}`,
            schedulingEndTime:`${moment(startDay).add(dayIndex,'days').format("YYYY-MM-DD")} ${endTime}`,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                notification['success']({
                    message: data.success,
                    description: '',
                  })
                this.setState({timeVisible:false})
                this.loadData()
            } else {
                Modal.error({ title: data.error });
            }            
        }
      }
    $.sendRequest(options)
    }

    del=(id)=>{
      const options = {
        method: 'POST',
        url: API_URL.arrangement.removeScheduling,
        data: {
            offset: 1,
            limit: 1,
            schedulingDetailsId:id,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                notification['success']({
                    message: data.success,
                    description: '',
                  })
                this.loadData()
            } else {
                Modal.error({ title: data.error });
            }            
        }
      }
    $.sendRequest(options)
    }

    beginTimeChange=(time, timeString)=>{
      this.setState({beginTime:timeString,t1:time})
    }
    endTimeChange=(time, timeString)=>{        
      this.setState({endTime:timeString,t2:time})
    }

    onChange = (d,dateString) => {
      console.log(d,dateString)
        let currDay = d.format('YYYY-MM-DD');
        let weekStart = moment(currDay).startOf('week');
        let weekEnd = moment(currDay).endOf('week');
        this.setState({
            curweek:moment(currDay),
            weekStart: moment(weekStart),
            weekEnd: moment(weekEnd)
        },function(){
            this.loadData(); 
        });
    }
    prevWeek =()=>{
        const {weekStart,curweek,weekEnd} = this.state;
        this.setState({
            curweek:curweek.subtract(7,'days'),
            weekStart:weekStart.subtract(7,'days'),
            weekEnd:weekEnd.subtract(7,'days'),
        });
        this.loadData(); 
    }
    nextWeek =()=>{
        const {weekStart,curweek,weekEnd} = this.state;
        this.setState({
            curweek:curweek.add(7,'days'),
            weekStart:weekStart.add(7,'days'),
            weekEnd:weekEnd.add(7,'days')
        });
        this.loadData();
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
          this.loadData(params)
        })
      }

    componentDidMount() {
        this.loadData();
    }

    render() {
        const {loading, pagination,weekStart,curweek,weekEnd,timeVisible,t1,t2} = this.state        
        return (
            <div className="content">
                <div className="txt" style={{textAlign:'center'}}>
                    <div style={{margin:'5px auto',width:"250px",height:"30px", position: "relative"}}><span style={{position:"absolute",zIndex:"999",left:"110px",top:"5px"}}>第{curweek.week()}周</span><a style={{position:"absolute",top:"5px",left:"20px"}} href="javascript:void(0)" onClick={this.prevWeek}><Icon type="left-circle-o" style={{fontSize:20}}/></a> <DatePicker onChange={this.onChange} value={curweek} format="YYYY" style={{width:150}}/> <a  style={{position:"absolute",top:0,right:20,fontSize:20}} href="javascript:void(0)" onClick={this.nextWeek}><Icon type="right-circle-o" /></a></div>
                    <div style={{color:'#999',marginBottom:20}}>{weekStart.format(dayFormat)} 至 {weekEnd.format(dayFormat)}</div>
                </div>
                <div className="content">
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        pagination= {pagination}
                        onChange={this.handleTableChange}
                        rowKey={record => record.index}
                        loading={loading}
                        scroll={{y:this.getDataSource().length > config.listLength ? config.scroll.y : null}}
                    />
                    <Modal
                      title={'选择时间段'}
                      visible={timeVisible}
                      width={300}
                      maskClosable={false}
                      onOk={this.add}
                      onCancel={()=>{this.setState({timeVisible:false})}}
                      
                    >
                      <div style={{padding:30,textAlign:'center'}}>
                        <div style={{marginBottom:20}}>开始时间：<TimePicker value={t1} onChange={this.beginTimeChange} format="HH:mm"/></div>
                        <div>结束时间：<TimePicker value={t2}  onChange={this.endTimeChange} format="HH:mm"/></div>
                      </div>
                    </Modal>
                </div>
            </div>
        );
    }
}