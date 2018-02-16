import React, { Component } from 'react';
import './Display.css';
import cover_img from '../assets/images/page_cover.jpeg';

export default class Display extends Component {

    render() {    
        let divHeight = '70%';
        // alert(window.innerWidth)
        if (window.innerWidth > 768) {
            divHeight = this.props.height + 'px';
        }
        
        return (
            <div>
                <div className="display-img"
                    style={{
                        backgroundImage: `url(${cover_img})`,
                        paddingBottom: `${divHeight}`
                    }} />
                    
                <div className="overlay-text">
                    <h1>Schedule Your Classes</h1>
                </div>
            </div>
        );
    }
}
