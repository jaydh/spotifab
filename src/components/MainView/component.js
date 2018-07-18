import React from 'react';
import PropTypes from 'prop-types';
import SongList from '../SongList';
import AlbumList from '../AlbumList';
import ArtistList from '../ArtistList';
import BrowseView from '../BrowseView';
import Queue from '../Queue';
import Header from '../Header';
import SongProgress from '../SongProgress';
import initAPIs from '../../initSpotifySDK';

class MainView extends React.Component {
  componentDidMount() {
    initAPIs();
  }
  render() {
    const { headerTitle } = this.props;
    return (
      <div className="main-view">
        <Header />
        {headerTitle === 'Albums' && <AlbumList audioControl={audioControl} />}
        {headerTitle === 'Artists' && <ArtistList />}
        {headerTitle === 'Browse' && <BrowseView />}
        {(headerTitle !== 'Albums' ||
          headerTitle !== 'Articles' ||
          headerTitle !== 'Browse') && <SongList />}
        <Queue />
        <SongProgress />
      </div>
    );
  }
}

export default MainView;
