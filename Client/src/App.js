import React, { Component } from 'react';
import LoginPanel from './components/LoginPanel/LoginPanel';

class App extends Component {
    // constructor(props) {
    //     super(props);
    //     // this. = this. .bind(this);
    // }

    render() {
        return (
            <div className="container">
                <LoginPanel />
            </div>
        );
    }
}

export default App;