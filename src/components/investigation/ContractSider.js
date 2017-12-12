import React, { Component } from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;

class Sider extends Component {

    constructor(props) {
        super(props);
        let current = '';
        // if (props.selectKey) {
        //     current = props.selectKey;
        // }
        this.state = {
            current,
        };
    }

    componentWillReceiveProps(){
        this.setState({
            current: location.hash.substr(1)
        })
    }

    componentWillMount(){
        this.setState({
            current: location.hash.substr(1)
        })
    }

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    render() {
        const siteId = sessionStorage.siteId;
        const curRole = sessionStorage.curRole;
        return (
            <aside className="sidebar">
                <Menu
                    onClick={this.handleClick}
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                >
                {
                    curRole == "PA" &&
                    <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>项目合同</span></span>}>
                        <Menu.Item key="/invContract">
                            <a href="#/invContract">主合同记录</a>
                        </Menu.Item>
                        <Menu.Item key="/invContractChild">
                            <a href="#/invContractChild">子合同记录</a>
                        </Menu.Item>
                    </SubMenu>
                }
                {
                    ((curRole == "PM" || curRole == "BO" || curRole == "BD" || curRole == "BDO") && siteId == 0) &&
                    <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>项目合同</span></span>}>
                        <Menu.Item key="/listContract">
                            <a href="#/listContract">合同记录</a>
                        </Menu.Item>
                    </SubMenu>
                }
                </Menu>
            </aside>
        );
    }
}

export default Sider;
