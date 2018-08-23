import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import asyncComponent from '../AsyncComponent';
const SongMain = asyncComponent(() => import('../SongMain'));
const SongList = asyncComponent(() => import('../SongList'));
const Queue = asyncComponent(() => import('../Queue'));
const Authenticate = asyncComponent(() => import('../Authenticate'));
const SongProgress = asyncComponent(() => import('../SongProgress'));

const Downloads = () => (
  <div
    style={{
      display: 'flex',
      margin: '0 auto',
      alignContent: 'center',
      justifyContent: 'center'
    }}
  >
    <button className="btn">
      <a href="https://firebasestorage.googleapis.com/v0/b/spotifab-3379e.appspot.com/o/bard-1.0.0-mac.zip?alt=media&token=b8c20b23-94d6-4ab0-bf5e-7a129c4ed123">
        Mac App
      </a>{' '}
    </button>
    <button className="btn">
      {' '}
      <a href="https://firebasestorage.googleapis.com/v0/b/spotifab-3379e.appspot.com/o/bard%20Setup%201.0.0.exe?alt=media&token=0abd1149-47f3-494c-ab16-71b135aada96">
        Windows Desktop App
      </a>
    </button>
    <button className="btn">
      <a href="https://firebasestorage.googleapis.com/v0/b/spotifab-3379e.appspot.com/o/bard-1.0.0-x86_64.AppImage?alt=media&token=2106fa05-a39e-47e1-a3b0-914131c616ed">
        Linux AppImage{' '}
      </a>{' '}
    </button>
  </div>
);

class MainView extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Authenticate} />
        <Route path="/library" component={SongMain} />
        <Route path="/playlist/" component={SongMain} />
        <Route path="/authenticate" component={Authenticate} />
        <Route path="/authenticate/:auth" component={Authenticate} />
        <Route path="/downloads" component={Downloads} />
      </Switch>
    );
  }
}

export default MainView;
