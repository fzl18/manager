import React from "react";
import moment from "moment";
import {message, Breadcrumb, Modal, Button, Table, DatePicker,Tag,Icon} from "antd";
import API_URL from "../../common/url";
import AjaxRequest from "../../common/AjaxRequest";
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
    };

    getColumns =()=>{
        const { curManhour,curSite,curPro } = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
            },{
                title: '医生姓名',
                dataIndex: 'doctorName',
            }];

            columns.push({
                title: '项目名称',
                dataIndex: 'investigationName',
            });
        return columns;
    };

    getDataSource =()=>{
        const sites=[]
        // listData.map((d,i)=>{
        //     let list = {
        //         index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
        //         id:d.Id,
        //         ...d,
        //     }
        //     sites.push(list)
        // })
        return sites;
    };

    loadData = (params)=>{
        const {weekStart,curweek,weekEnd,pagination} = this.state
        this.setState({loading:true})
        const options = {
            method: 'get',
            url: API_URL.index.queryLastTendencyList,
            data: {
                ...params
            },
            type: 'json',
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
        };
        AjaxRequest.sendRequest(options);
    }

    onChange = (d,dateString) => {
        if(!d){
            this.setState({
                curweek: moment(),
                weekStart: moment().subtract(moment().day() - 1,'days'),
                weekEnd: moment().add( 7- moment().day() ,'days'),
            },function(){
                this.loadData(); 
            })
            return;
        }
        let currDay = d;
        let dTemp=moment(dateString),dTemp1 = moment(dateString);
        let weekStart = dTemp1.startOf('week');
        let weekEnd = dTemp.endOf('week');
        this.setState({
            curweek:currDay,
            weekStart: weekStart,
            weekEnd: weekEnd
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
          this.loadListData(params)
        })
      }

    componentDidMount() {        
        this.loadData();
    }

    render() {
        const {loading, pagination,weekStart,curweek,weekEnd,curManhour,curSite,curPro,userName,userCode} = this.state        
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
                        rowKey={record => record.id}
                        loading={loading}
                        scroll={{y:300}}
                    />
                </div>
            </div>
        );
    }
}