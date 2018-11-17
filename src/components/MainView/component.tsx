import * as React from 'react';
import { Route, Switch } from 'react-router';
import asyncComponent from '../AsyncComponent';
const Services = asyncComponent(() => import('../Services'));
const SongMain = asyncComponent(() => import('../SongMain'));
const Authenticate = asyncComponent(() => import('../Authenticate'));

class MainView extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact={true} path="/" component={Authenticate} />
        <Route path="/library" component={SongMain} />
        <Route path="/recent" component={SongMain} />
        <Route path="/new" component={SongMain} />
        <Route path="/playlist/:type/:owner/:id" component={SongMain} />
        <Route path="/authenticate" component={Authenticate} />
        <Route path="/authenticate/:auth" component={Authenticate} />
        <Route path="/services" component={Services} />
      </Switch>
    );
  }
}

export default MainView;
