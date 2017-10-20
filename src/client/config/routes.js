import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Main from '../components/Main';
import Login from '../components/Login';
import Logout from '../components/Logout';
import Register from '../components/Register';
import Dashboard from '../containers/DashboardContainer';
import PayOffDetailsContainer from '../containers/PayOffDetailsContainer';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Main} >
      <IndexRoute component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="register" component={Register} />
      <Route path="payoff/:card" component={PayOffDetailsContainer} />
    </Route>
  </Router>
);

export default routes;
