import React from 'react';
import PropTypes from 'prop-types';
import SongList from '../SongList';
import AlbumList from '../AlbumList';
import ArtistList from '../ArtistList';
import BrowseView from '../BrowseView';
import Queue from '../Queue';

const MainView = ({ headerTitle, audioControl, resumeSong, pauseSong }) => {
  return (
    <div className="main-view">
      {headerTitle === 'Albums' && <AlbumList audioControl={audioControl} />}
      {headerTitle === 'Artists' && <ArtistList />}
      {headerTitle === 'Browse' && <BrowseView />}
      {(headerTitle !== 'Albums' ||
        headerTitle !== 'Articles' ||
        headerTitle !== 'Browse') && (
        <div
          style={{
            display: 'flex',
            height: '100%'
          }}
        >
          <SongList
            resumeSong={resumeSong}
            pauseSong={pauseSong}
            audioControl={audioControl}
          />
          <Queue />
        </div>
      )}
    </div>
  );
};

export default MainView;
