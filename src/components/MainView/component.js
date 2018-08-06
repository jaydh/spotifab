import React from 'react';
import PropTypes from 'prop-types';
import SongList from '../SongList';
import AlbumList from '../AlbumList';
import ArtistList from '../ArtistList';
import BrowseView from '../BrowseView';
import Queue from '../Queue';
import Header from '../Header';
import SongProgress from '../SongProgress';
import Authenticate from '../Authenticate';
import { Route, Switch } from 'react-router';
import initAPIs from '../../initSpotifySDK';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSongs } from '../../actions/songActions';

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchSongs
    },
    dispatch
  );
};
const SongMainConnect = connect(
  null,
  mapDispatchToProps
)(
  class SongMain extends React.Component {
    constructor() {
      super();
      initAPIs();
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.location.pathname.startsWith('/library')) {
        this.props.fetchSongs();
      }
    }
    render() {
      return (
        <div className="main-view">
          <SongList />
          <Queue />
          <SongProgress />
        </div>
      );
    }
  }
);
const Downloads = () => (
  <div>
    <a href="https://firebasestorage.googleapis.com/v0/b/spotifab-3379e.appspot.com/o/spotilyrics%200.1.0.exe?alt=media&token=6db41137-2479-4eec-9a0f-fd3766c56545">
      Windows Desktop App
    </a>
  </div>
);

class MainView extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={SongMainConnect} />
        <Route path="/library" component={SongMainConnect} />
        <Route path="/playlist/" component={SongMainConnect} />
        <Route path="/authenticate" component={Authenticate} />
        <Route path="/downloads" component={Downloads} />
      </Switch>
    );
  }
}

export default MainView;
