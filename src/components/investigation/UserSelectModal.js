/**
 * Created by casteloyee on 2017/7/20.
 */
import React from 'react';
import { Modal, Row, Col, message } from 'antd';
import API_URL from '../../common/url';
import UserSearchInput from './UserSearchInput';

class UserSelectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            func: '',
            user: {},
        };
        
    };

    show = (func, value) => {
        this.setState({
            func,
            value,
            visible: true,
        });
    };


    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleSelectUser = user => {
        this.setState({
            user,
        });
    };

    handleSubmit = () => {
        this.state.func(this.state.user, this.state.value);
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible, confirmLoading, title } = this.state;
        return (
            <Modal
                title={title}
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
                        <Col span={10}>变更为</Col>
                        <Col span={14}>
                            <UserSearchInput style={{width: 100}}
                                            placeholder = '工号\姓名'
                                            handleSelectUser = {this.handleSelectUser}
                                            url = {`${API_URL.team.userlist}`}
                                            searchKey = 'keyword'
                            />
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    };
}

export default UserSelectModal;
