import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './SongList.css';
import Queue from '../Queue';
class SongList extends Component {
  componentDidMount() {
    this.props.fetchSongs();
  }
  renderSongs() {
    return this.props.songs.map((song, i) => {
      const buttonClass =
        song.track.id === this.props.songId && !this.props.songPaused
          ? 'fa-pause-circle-o'
          : 'fa-play-circle-o';

      return (
        <li
          className={
            song.track.id === this.props.songId
              ? 'active user-song-item'
              : 'user-song-item'
          }
          key={i}
        >
          <div
            onClick={() => {
              this.props.clearSongQueue();
              this.props.songs.delete(i).map(t => {
                this.props.addSongToQueue(t);
              });
              this.props.shuffleQueue();
              this.props.addSongToFront(song);
              this.props.play();
            }}
            className="play-song"
          >
            <i className={`fa ${buttonClass} play-btn`} aria-hidden="true" />
          </div>
          <div className="song-title">
            <p>{song.track.name}</p>
          </div>

          <div className="song-artist">
            <p>{song.track.artists[0].name}</p>
          </div>

          <div className="song-album">
            <p>{song.track.album.name}</p>
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="grid-container">
        <div className="song-list">
          <div className="song-header-container">
            <div className="song-title-header">
              <p>Title</p>
            </div>
            <div className="song-artist-header">
              <p>Artist</p>
            </div>
            <div className="song-album-header">
              <p>Album</p>
            </div>
          </div>
          {this.renderSongs()}
        </div>
        <div className="queue">
          <Queue />
        </div>
      </div>
    );
  }
}

export default SongList;
