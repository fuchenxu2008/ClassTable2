import React, { Component } from 'react';
import './Display.css';

export default class Display extends Component {

    render() {    
        let divHeight = '70%';
        // alert(window.innerWidth)
        if (window.innerWidth > 768) {
            divHeight = this.props.height + 'px';
        }
        
        const imgs = [
            'https://images.unsplash.com/photo-1505759115705-e48bf15b15b6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=36c8d4b6e72bc8efb665956c314e5b89&auto=format&fit=crop&w=1652&q=80',
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-0.3.5&s=c0ac25c3cd56ced9821b924fed4c3c43&auto=format&fit=crop&w=1650&q=80'
        ]
        return (
            <div>
                <div className="display-img"
                    style={{
                        backgroundImage: `url(${imgs[1]})`,
                        paddingBottom: `${divHeight}`
                    }} />
                    
                <div className="overlay-text">
                    <h1>Schedule Your Classes</h1>
                </div>
            </div>
        );
    }
}
