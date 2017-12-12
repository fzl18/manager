/**
 * Created by casteloyee on 2017/7/20.
 */
import React from 'react';
import { Modal, Row, Col, message, Select } from 'antd';
const Option = Select.Option;

/**
 * 角色选取列表，选择某个角色，然后返回
 */
class RoleSelectionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            func: '',
            value: '',
            investigationId: '',
            roles: [],
        };
        
    };

    show = (func, roles, investigationId) => {
        this.setState({
            func,
            roles,
            investigationId,
            visible: true,
        });
    };

    hide =() => {
        this.setState({visible: false});
    }

    handleSelectRole = value => {
        this.setState({
            value,
        });
    };

    handleSubmit = () => {
        if(this.state.value == ""){
            Modal.error({title:'请选择角色'});
            return;
        }
        this.state.func(this.state.value, this.state.investigationId, this.state.roles);
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible, confirmLoading, roles, value } = this.state;
        return (
            <Modal
                title='选择角色'
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <div>
                    <Row>
                        <Col span={10}>角色：</Col>
                        <Col span={14}>
                            <Select value={ value } style={{width: 120}} onChange={this.handleSelectRole}>
                                {roles.map(d => <Option key={d}>{d}</Option>)}
                            </Select>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    };
}

export default RoleSelectionModal;
