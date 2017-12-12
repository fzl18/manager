import React from 'react';
import { Button, Input, Select } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


const initState = {
    investigationCode : '',
    investigationName : '',
    investigationJdeContractCode: '',
    area : '',
    sponsor : '',
    fteProportion : null,
    fteProportionSymbol : 'NotLess',
    conAmountSymbol : 'NotLess',
    conAmount : null,
    bd : '',
    status : '',
    sitePlan : null,
    sitePlanSymbol : 'NotLess',
    pm: '',
    
}

class Filter extends React.Component {

    state = {...initState,isStarted: this.props.isStarted};

    showCreateModal = () => {
        this.props.showCreateModal();
    }

    handleChange = (field, e) => {
        this.setState({
            [field]: e.target.value,
        });
    }

    handleChangeSelect = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    search = () => {
        const { sortParams } = this.props;
        this.props.reload({ ...this.state, ...sortParams },"search");
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    viewPercent=()=>{
        location.href = `./#/proPercent`;        
    }

    clearState = () => {
        this.setState(initState);
    }

    reset = () => {
        this.setState(initState);
        this.props.reset();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isStarted !== this.state.isStarted){
            this.clearState();
            this.setState({
                isStarted: nextProps.isStarted
            })
        }
    }

    render() {
        const {
            investigationCode,
            investigationName,
            area,
            sponsor,
            fteProportion,
            fteProportionSymbol,
            conAmountSymbol,
            conAmount,
            bd,
            pm,
            status,
            sitePlan,
            sitePlanSymbol,
            investigationJdeContractCode,
        } = this.state;
        const isBO = sessionStorage.curRole == "BO";
        return (
            <div className="filter-bar">
                <div style={{float:'left',width:'100%'}}>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目编号</label>
                        <Input
                            value={investigationCode}
                            onChange={this.handleChange.bind(this, 'investigationCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目名称</label>
                        <Input
                            value={investigationName}
                            onChange={this.handleChange.bind(this, 'investigationName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">JDE主项目号</label>
                        <Input
                            value={investigationJdeContractCode}
                            onChange={this.handleChange.bind(this, 'investigationJdeContractCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    { this.props.isStarted == 1 ? 
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目状态</label>
                        <Select allowClear={true} value={status} onChange={this.handleChangeSelect.bind(this, 'status')} style={{width:90}}>
                            <Option value="PREPARING">准备中</Option>
                            <Option value="UNDERWAY">进行中</Option>
                            <Option value="COMPLETED">已完成</Option>
                        </Select>
                    </div> :
                    ('')
                    }
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目领域</label>
                        <Input
                            value={area}
                            onChange={this.handleChange.bind(this, 'area')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">申办方</label>
                        <Input
                            value={sponsor}
                            onChange={this.handleChange.bind(this, 'sponsor')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    { this.props.isStarted == 1 ? 
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">累计FTE消耗比</label>
                            <InputGroup compact>
                                <Select defaultValue={fteProportionSymbol} onChange={this.handleChangeSelect.bind(this, 'fteProportionSymbol')}>
                                    <Option value="GreatThan">&gt;</Option>
                                    <Option value="NotLess">&ge;</Option>
                                    <Option value="LessThan">&lt;</Option>
                                    <Option value="NotGreat">&le;</Option>
                                    <Option value="Equals">=</Option>
                                </Select>
                                <Input
                                    value={fteProportion}
                                    onChange={this.handleChange.bind(this, 'fteProportion')}
                                    onKeyPress={this.enterSearch}
                                />      %                      
                            </InputGroup>
                        </div>
                        : ('')
                    }
                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">合同额（元）</label>
                        <InputGroup compact>
                            <Select defaultValue={conAmountSymbol} onChange={this.handleChangeSelect.bind(this, 'conAmountSymbol')}>
                                <Option value="GreatThan">&gt;</Option>
                                <Option value="NotLess">&ge;</Option>
                                <Option value="LessThan">&lt;</Option>
                                <Option value="NotGreat">&le;</Option>
                                <Option value="Equals">=</Option>
                            </Select>
                            <Input
                                value={conAmount}
                                onChange={this.handleChange.bind(this, 'conAmount')}
                                onKeyPress={this.enterSearch}
                            />                            
                        </InputGroup>
                    </div>
                    {
                        this.props.isStarted == 1 ? 
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">PM</label>
                            <Input
                                value={pm}
                                onChange={this.handleChange.bind(this, 'pm')}
                                onKeyPress={this.enterSearch}
                            />
                        </div>
                        :
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">BD</label>
                            <Input
                                value={bd}
                                onChange={this.handleChange.bind(this, 'bd')}
                                onKeyPress={this.enterSearch}
                            />
                        </div>
                    }
                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">计划中心数</label>
                        
                        <InputGroup compact>
                            <Select defaultValue={sitePlanSymbol} onChange={this.handleChangeSelect.bind(this, 'sitePlanSymbol')}>
                                <Option value="GreatThan">&gt;</Option>
                                <Option value="NotLess">&ge;</Option>
                                <Option value="LessThan">&lt;</Option>
                                <Option value="NotGreat">&le;</Option>
                                <Option value="Equals">=</Option>
                            </Select>
                            <Input
                                value={sitePlan}
                                onChange={this.handleChange.bind(this, 'sitePlan')}
                                onKeyPress={this.enterSearch}
                            />
                        </InputGroup>
                        
                    </div>
                    <div className="form-item" style={{float:"right"}}>
                    {isBO &&
                        this.props.isStarted == 1 ? <Button type="primary" onClick={this.viewPercent} style={{background:'#62cf96',border:'1px solid #00a854'}}>项目完工百分比汇总</Button> : null
                    }
                    
                    <Button type="primary" onClick={this.reset}>重置</Button>
                    <Button type="primary" onClick={this.search}>搜索</Button>
                    
                    </div>
                </div>
                        
                        
                    
                    {/*<Button className="add-btn" size="large" type="ghost" onClick={this.showCreateModal}>添加</Button>*/}
                
            </div>
        );
    }
}

export default Filter;
