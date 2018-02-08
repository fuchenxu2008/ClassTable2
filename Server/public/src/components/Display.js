import React, { Component } from 'react';
import './Display.css';
import { Carousel } from 'antd';

export default class Display extends Component {

    render() {    
        const divHeight = this.props.height;
        console.log('Rendered:', divHeight);
        
        const imgs = [
            'https://images.unsplash.com/photo-1505759115705-e48bf15b15b6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=36c8d4b6e72bc8efb665956c314e5b89&auto=format&fit=crop&w=1652&q=80',
        ]
        return (
            <div>
                <div className="display-img"
                    style={{
                        backgroundImage: `url(${imgs})`,
                        paddingBottom: `${divHeight}px`
                    }} />
                    
                <div className="overlay-text">
                    <h1>Schedule Your Classes</h1>
                </div>
            </div>
        );
    }
}
