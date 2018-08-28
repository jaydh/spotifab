import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router';
import asyncComponent from '../AsyncComponent';
const SongMain = asyncComponent(() => import('../SongMain'));
const SongList = asyncComponent(() => import('../SongList'));
const Queue = asyncComponent(() => import('../Queue'));
const Authenticate = asyncComponent(() => import('../Authenticate'));
const SongProgress = asyncComponent(() => import('../SongProgress'));
import { connect } from 'react-redux';

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
      <a href="https://firebasestorage.googleapis.com/v0/b/spotifab-3379e.appspot.com/o/bard-1.0.0-mac.zip?alt=media&token=b2e737f2-3892-46a1-9a11-796a118f228d">
        Mac App
      </a>{' '}
    </button>
    <button className="btn">
      {' '}
      <a href="https://firebasestorage.googleapis.com/v0/b/spotifab-3379e.appspot.com/o/bard%20Setup%201.0.0.exe?alt=media&token=b5b1f858-d1aa-4b04-81d2-4c6801a05d49">
        Windows Desktop App
      </a>
    </button>
    <button className="btn">
      <a href="https://firebasestorage.googleapis.com/v0/b/spotifab-3379e.appspot.com/o/bard-1.0.0-x86_64.AppImage?alt=media&token=80ef0391-4d4b-4009-9c64-b7b330f04348">
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
        <Route path="/recent" component={SongMain} />
        <Route path="/new" component={SongMain} />
        <Route path="/playlist/:type/:owner/:id" component={SongMain} />
        <Route path="/authenticate" component={Authenticate} />
        <Route path="/authenticate/:auth" component={Authenticate} />
        <Route path="/downloads" component={Downloads} />
      </Switch>
    );
  }
}

export default MainView;
