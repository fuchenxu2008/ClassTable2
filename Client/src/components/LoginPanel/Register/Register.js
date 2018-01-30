import React, { Component } from 'react';

class Register extends Component {
    // constructor(props) {
    //     super(props);
    //     // this. = this. .bind(this);
    // }

    render() {
        return (
            <form>
                <div class="form-group">
                    <label>Email address</label>
                    <input type="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" placeholder="Password" />
                </div>
                <div class="form-group">
                    <label>Re-Enter Password</label>
                    <input type="password" class="form-control" placeholder="Re-Enter Password" />
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
            </form>
        );
    }
}

export default Register;