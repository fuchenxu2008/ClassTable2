import React, { Component } from 'react';

class Register extends Component {
    // constructor(props) {
    //     super(props);
    //     // this. = this. .bind(this);
    // }

    render() {
        return (
            <form>
                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label>Re-Enter Password</label>
                    <input type="password" className="form-control" placeholder="Re-Enter Password" />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        );
    }
}

export default Register;