import React, { Component } from 'react';
import './Description.css';
import { Row, Col, Button, Icon } from 'antd';
import HelpModal from './HelpModal';
import wechatQR from '../assets/images/wechatQR.JPG';

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
                            <h2>让我们开始吧：</h2>
                            <p>
                                1. 输入你的E-bridge用户名和密码来验证登录。<br/>
                                2. 等待8-15秒来让后台帮您生成日历。<br />
                                3. 不要忘记核对一下与<span className="emphasis-text">E-bridge</span>上的官方课表是否一致～
                            </p>
                            
                            <h2>注意事项</h2>
                            <p>
                                1. 下载日历文件应当使用<span className="emphasis-text">标准</span>浏览器来访问本网页，比如Safari, Chrome, UC。<span className="emphasis-text">不支持微信一类的应用内置浏览器!</span><br />
                                2. 整个生成过程会持续8-15秒, 请耐心等待。<br />
                                3. 如果你使用的是iOS设备但无法添加日历，请确保设置-iCloud-日历已经开启。<br />
                                4. 如果你使用的是非iOS设备，浏览器将下载一个.ics文件。打开后（安卓选择用日历📅打开）应自动提示添加至您的默认日历。
                            </p>

                            <h2>免责声明：</h2>
                            <p>您的密码将仅用于登录E-bridge验证身份，本站不会收集或用于其他用途。</p>
                        </HelpModal>
                    </Col>
                    <Col xs={12} style={{textAlign: 'right'}}>
                        <Button onClick={this.handleOpenContact} type="primary" ghost className="help-button">Contact</Button>
                        <HelpModal 
                            visible={showContact} 
                            onClose={this.handleCloseContact}
                            title="Contact Me"
                        >
                            <div>
                                <h2>微信小程序上线 <span className="new">NEW</span></h2>

                                <p style={{ marginBottom: '5px' }}>
                                    新推出微信小程序版本，您可以直接在微信下拉调出<span className="emphasis-text">XJTLU课表助手</span>
                                    来查看您当或其他日期的课程。Here's the QR Code, check it out !<br/>
                                </p>
                                <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                                    <img src={wechatQR} alt="WechatQR" style={{ height: '80px' }} />
                                </div>

                                <h2>灵感来源</h2>

                                <p>在过去，新学期公布课表时，我们常常只能在E-bridge上把课表截图存在相册中, 然后不得不经常反复的去相册翻看自己的课表又或是把其设置为手机锁屏壁纸来获知接下来的课程安排。
                                现在通过这个实用的小工具，<span className="emphasis-text">您可以一次性把自己所有的课程添加至日历，然后通过手机通知中心，智能手表等其他工具快速的查看管理自己接下来的日程！</span></p>

                                <h2>联系方式</h2>

                                <p>
                                    嗨！我是<span style={{fontWeight: 'bold'}}>西浦大三软工的傅晨旭</span>，感谢您访问本网站，<span className="emphasis-text">请在导出日历后仔细核对是否与官方课表一致。（您应额外注意课程和其对应的教学周是否匹配）</span><br/>
                                如果您遇到了任何问题，发现了错误或有其他需求，可以通过以下两种方式联系我~<br/>
                                如果您觉得本工具很好用，欢迎帮忙转发支持哈 :)
                                </p>

                                <Row gutter={24} className="modal-button-row">
                                    <Col xs={24} sm={12} md={15} className="modal-button-col">
                                        <Button ghost size="large" className="help-modal-button-email" type="primary" href="mailto:fuchenxu2008@163.com"><Icon type="mail" /> fuchenxu2008@163.com</Button>
                                    </Col>
                                    <Col xs={24} sm={12} md={9} style={{ textAlign: 'right' }} className="modal-button-col">
                                        <Button ghost size="large" className="help-modal-button-wechat" type="primary" href='wechat://'><Icon type="wechat" /> fuchenxu2008</Button>
                                    </Col>
                                </Row>

                            </div>
                        </HelpModal>
                    </Col>
                </Row>
            </div>
        );
    }
}