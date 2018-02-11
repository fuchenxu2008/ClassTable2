import React, { Component } from 'react';
import './ProgressModal.css';
import { Modal, Steps, Icon } from 'antd';
const Step = Steps.Step;

class ProgressModal extends Component {
    render() {
        const { visible, currentStep } = this.props;
        
        const defaultSteps = [
            { title: 'Login', icon: 'user' }, 
            { title: 'Parse', icon: 'code' },
            { title: 'Prepare', icon: 'calendar' },
            { title: 'Done', icon: 'download' }
        ];

        const steps = defaultSteps.map((step, index) => {
            let status = 'wait',
                stepIcon = step.icon;
            if (index < currentStep) {
                status = 'finish';
                console.log('step', index, 'finished');
                
            } else if ((index >= currentStep && index === 0) || index === currentStep) {
                status = 'process';
                stepIcon = 'loading';
            }
            return (
                <Step key={step.title} status={status} title={step.title} icon={<Icon type={stepIcon} />} />
            )
        })
        
        return (
            <div>
                <Modal
                    className="progress-modal"
                    title="Processing Your Calendar"
                    visible={visible}
                    footer={null}
                    closable={false}
                >
                    <Steps size="small">
                        { steps }
                    </Steps>
                </Modal>
            </div>
        );
    }
}

export default ProgressModal;