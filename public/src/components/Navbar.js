import React, { Component } from 'react';
import axios from 'axios';
// import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import config from '../config';
import { Redirect } from 'react-router-dom';
import { Menu, Icon, message } from 'antd';
const SubMenu = Menu.SubMenu;

class Navbar extends Component {
    state = {
        current: '',
        user: ''
    }

    handleClick = (e) => {
        this.setState({ current: e.key });
    }

    refreshClass = (e) => {
        
        const userCredential = localStorage.getItem('userCredential') || sessionStorage.getItem('userCredential');
        if (!userCredential) return message.error('No credential provided, please go back.', 3);;
        const { uname, psw } = JSON.parse(userCredential);
        message.info('Refreshing your classes ~', 8);
        // const socket = io.connect(config.domain);
        const socketId = uuidv4();
        axios.post(`${config.domain}/ebridge/class?download=yes`, { uname, psw, socketId })
            .then(res => {
                if (res.data.rawClass) {
                    const classTable = JSON.stringify(res.data.rawClass);
                    if (localStorage.getItem('userCredential')) {
                        localStorage.setItem('classes', classTable);
                    }
                    sessionStorage.setItem('classes', classTable);
                    this.props.onRefresh(classTable);
                    message.success('Refresh success!', 3);
                } else {
                    message.error('Refresh failed, maybe try login again?', 3);
                }
            })
            .catch(err => {
                console.log(err);
                message.error('Refresh failed!', 3);
            })
    }

    componentDidMount() {
        const userCredential = localStorage.getItem('userCredential') || sessionStorage.getItem('userCredential');
        if (userCredential) {
            this.setState({ 'user': JSON.parse(userCredential).uname });
        } else {
            this.setState({ 'user': 'No User' });
        }
    }

    componentDidUpdate() {
        const { current } = this.state;
        if (current === 'refresh') {
            this.refreshClass();
            this.setState({ current: '' })
        } else if (current === 'trash') {
            localStorage.clear();
            sessionStorage.removeItem('classes');
            message.success('Local data trashed', 3);
            this.setState({ current: 'back' });
        }
    }

    render() {
        const { current, user } = this.state;
        if (current === 'back') return <Redirect to='/' />;        

        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={[current]}
                style={{ boxShadow: '0px 10px 10px rgb(180, 180, 180)' }}
                theme="dark"
                mode="horizontal"
            >
                <Menu.Item key="back"><Icon type="left" />Return to HomePage</Menu.Item>
                <SubMenu key="settings" style={{ float: 'right' }} title={<span><Icon type="user" />{user}</span>}>
                    <Menu.Item key="refresh"><Icon type="reload" />Refresh ClassTable</Menu.Item>
                    <Menu.Item key="trash"><Icon type="delete" />Delete local data</Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

export default Navbar;