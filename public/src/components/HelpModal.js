import React, { Component } from 'react';
import { Modal } from 'antd';

class HelpModal extends Component {

    render() {
        return (
            <Modal
                style={{ top: 20 }}
                title={this.props.title}
                visible={this.props.visible}
                onOk={this.props.onClose}
                onCancel={this.props.onClose}
            >
                {this.props.children}
            </Modal>
        );
    }
}

export default HelpModal;