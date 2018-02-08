import React, { Component } from 'react';
import './Description.css';
import { Row, Col, Button } from 'antd';
import HelpModal from './HelpModal';

export default class Description extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showManual: false,
            showContact: false
        }
        this.handleOpenManual = this.handleOpenManual.bind(this);
        this.handleOpenContact = this.handleOpenContact.bind(this);
        this.handleCloseManual = this.handleCloseManual.bind(this);
        this.handleCloseContact = this.handleCloseContact.bind(this);
    }

    handleOpenManual() {
        this.setState({ showManual: true });
    }

    handleOpenContact() {
        this.setState({ showContact: true });
    }

    handleCloseManual() {
        this.setState({ showManual: false });
    }

    handleCloseContact() {
        this.setState({ showContact: false });
    }

    render() {
        const { showManual, showContact } = this.state;
        return (
            <div>
                <Row className="description">
                    <Col xs={12}>
                        <Button onClick={this.handleOpenManual} type="primary" ghost className="help-button">Manual</Button>
                        <HelpModal 
                            visible={showManual} 
                            onClose={this.handleCloseManual}
                            title="User Guide"
                        >
                            让我们开始吧：

                            输入你的E-bridge用户名和密码来验证登录。
                            等待8-15秒来让后台帮您生成日历。
                            不要忘记核对一下与E-bridge上的官方课表是否一致～
                            注意事项

                            应当使用标准浏览器来访问本网页，比如Safari, Chrome, UC。不支持微信一类的应用内置浏览器!
                            整个生成过程会持续8-15秒, 请耐心等待。
                            如果你使用的是iOS设备但无法添加日历，请确保设置-iCloud-日历已经开启。
                            如果你使用的是非iOS设备，浏览器将下载一个.ics文件。打开后（安卓选择用日历📅打开）应自动提示添加至您的默认日历。
                            免责声明：您的密码将仅用于登录E-bridge验证身份，本站不会用于其他用途。
                        </HelpModal>
                    </Col>
                    <Col xs={12} style={{textAlign: 'right'}}>
                        <Button onClick={this.handleOpenContact} type="primary" ghost className="help-button">Contact</Button>
                        <HelpModal 
                            visible={showContact} 
                            onClose={this.handleCloseContact}
                            title="Contact Me"
                        >
                            灵感来源

                            在过去，新学期公布课表时，我们常常只能在E-bridge上把课表截图存在相册中, 然后不得不经常反复的去相册翻看自己的课表又或是把其设置为手机锁屏壁纸来获知接下来的课程安排。 有些同学还会手动一条一条地把课表输进日历里去，但是那真的是太麻烦了。
                            现在通过这个实用的小工具，您可以一次性把自己所有的课程添加至日历，而操作过程仅仅是登录验证，然后你就可以轻松的通过手机通知中心，智能手表等其他工具快速的查看管理自己接下来的日程！不仅更方便，而且更加简单。

                            联系方式

                            感谢您访问本网站，请在导出日历后仔细核对是否与官方课表一致。（您应额外注意课程和其对应的教学周是否匹配）

                            如果您遇到了任何问题，发现了错误或有其他需求，可以通过以下两种方式联系我~
                            如果您觉得本工具很好用，欢迎帮忙转发支持哈 :)

                            邮箱:
                            fuchenxu2008@163.com  微信:
                            fuchenxu2008
                            其他声明

                            本站可在其他第三方平台自由转发使用，但仅限用于非盈利用途，转发使用前请联系开发者，谢谢！
                        </HelpModal>
                    </Col>
                </Row>
            </div>
        );
    }
}