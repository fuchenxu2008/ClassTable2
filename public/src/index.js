import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import './index.css';
import HomePage from './HomePage';
import ClassPanel from './ClassPanel';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/myclass" component={ClassPanel} />
        </div>
    </BrowserRouter>, 
    document.getElementById('root')
);
// registerServiceWorker();

if (module.hot) {
    module.hot.accept();
}