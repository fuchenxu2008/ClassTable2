import React, { Component } from 'react';

class Register extends Component {
    // constructor(props) {
    //     super(props);
    //     // this. = this. .bind(this);
    // }

    render() {
        return (
            <form onSubmit={this.props.onLogin}>
                <div className="form-group">
                    <label>Email address</label>
                    <input type="text" onChange={(e) => this.props.onUnameChange(e.target.value)} className="form-control" aria-describedby="emailHelp" placeholder="Enter email" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" onChange={(e) => this.props.onPswChange(e.target.value)} className="form-control" placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        );
    }
}

export default Register;