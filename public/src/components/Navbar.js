import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Menu, Icon, message } from 'antd';
const SubMenu = Menu.SubMenu;

class Navbar extends Component {
    state = {
        current: '',
    }

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }

    componentDidUpdate() {
        const { current } = this.state;
        if (current === 'refresh') {
            localStorage.removeItem('classes');
            sessionStorage.removeItem('classes');
            this.setState({ current: 'back' });
        } else if (current === 'trash') {
            localStorage.clear();
            message.success('Local data trashed', 3);
            this.setState({ current: 'back' });
        }
    }

    render() {
        if (this.state.current === 'back') return <Redirect to='/' />;

        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                style={{ boxShadow: '0px 10px 10px rgb(180, 180, 180)' }}
                theme="dark"
                mode="horizontal"
            >
                <Menu.Item key="back"><Icon type="left" />Return to HomePage</Menu.Item>
                <SubMenu style={{ float: 'right' }} title={<span><Icon type="setting" />Settings</span>}>
                    <Menu.Item key="refresh"><Icon type="reload" />Refresh ClassTable</Menu.Item>
                    <Menu.Item key="trash"><Icon type="delete" />Delete local data</Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

export default Navbar;