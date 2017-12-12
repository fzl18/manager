import React from 'react';
import { Layout, Menu, Icon, Breadcrumb, Dropdown, Avatar, Col,Row } from 'antd';
//import Header from './layout/Header';
//import Footer from './layout/Footer';
import Nav from './layout/Nav';
import Jquery from '../common/XDomainJquery';
import API_URL from '../common/url';
import { Spin, Modal } from 'antd';
import ENV from '../common/env.js';
import { menuList } from './layout/Menu';


const { Header, Sider, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu;
class App extends React.Component {
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    } 

    getBreadcrumb = () => {
      const hashUrl = location.hash;
      const breadArr = [];
      const pushMap = (list,parent) => {
        list.map((levelone,index) => {
          if(!levelone.children){
            if(levelone.path == hashUrl){
              if(parent){
                breadArr.push({
                  ...parent
                })
              }
              breadArr.push({
                name: levelone.name,
                path: levelone.path,
              })
            }
          }else{
            pushMap(levelone.children,{name :levelone.name,path: levelone.path});
          }
        })
      }
      pushMap(menuList);
      // console.log(breadArr);
      if(breadArr.length == 2){
        return <span>
        {breadArr[0].path ?
        <Breadcrumb.Item><a href={breadArr[0].path}>{breadArr[0].name}</a></Breadcrumb.Item>
        :
        <Breadcrumb.Item>{breadArr[0].name}</Breadcrumb.Item>
        }
        &nbsp;/&nbsp;
        <Breadcrumb.Item>{breadArr[1].name}</Breadcrumb.Item>
        </span>
      }else if(breadArr.length == 1){
        return <Breadcrumb.Item>{breadArr[0].name}</Breadcrumb.Item>
      }else {
        return null;
      }
    }

    render() {
      // console.log(this.props.location);
        const { show } = this.state;
        const menu = (
          <Menu className="config_menu" selectedKeys={[]} onClick={this.onMenuClick}>
            <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
          </Menu>
        );
        const breadList = this.getBreadcrumb();
        return (
            <Layout>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
            >
              <div className="logo">
                <span className="min-logo"></span>
                <span className="title">微信应用管理系统</span>
              </div>
              {/* <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>Option 1</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Option 2</span>
              </Menu.Item>
              <SubMenu
                key="sub1"
                title={<span><Icon type="user" /><span>User</span></span>}
              >
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={<span><Icon type="team" /><span>Team</span></span>}
              >
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="9">
                <Icon type="file" />
                <span>File</span>
              </Menu.Item>
            </Menu> */}
            <Nav isShowTitle={this.state.collapsed}/>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
                {/* <Dropdown overlay={menu}> */}
                {/* <Dropdown> */}
                <span className="action account"><a href="javascript:;"  onClick={()=>{}}><i className="iconfont icon-quit" style={{fontSize:22}} /></a></span>
                <span className="action account"><a href="javascript:;"  onClick={()=>{}}><i className="iconfont icon-shezhi" style={{fontSize:22}} /></a></span>
                
                  <span className="action account">
                    <Avatar size="small" className="avatar" />
                    你好，管理员
                  </span>
                  
                {/* </Dropdown> */}
              </Header>
              <Breadcrumb style={{padding:16,borderTop:'2px solid #eee'}}>
                {breadList}
              </Breadcrumb>
              <Content style={{ margin: '24px 16px 0 16px', padding: 24, background: '#fff'}}>
              { this.props.children }
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                版权所有© 无锡慧方科技有限公司
              </Footer>
            </Layout>
          </Layout>
        //     show ?
        //         <div>
        //             <Header />
        //             <Nav />
        //             <Pin />
        //             <div className="container">
        //                 <div className="wrapper">
        //                     { this.props.children }
        //                 </div>
        //             </div>
        //             <Footer />
        //         </div>
        //     :
        //         <Spin tip="加载用户数据..." style={{ position: 'fixed', top: '50%', left: '50%' }} />
         );
    }
}

export { App as default };
