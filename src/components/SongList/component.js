import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongList.css';
class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showYT: false
    };
  }
  componentDidMount() {
    this.props.fetchSongs();
  }

  makeNewQueue(i, song) {
    this.props.clearSongQueue();
    this.props.songs.slice(i).map(t => {
      this.props.addSongToQueue(t);
    });
    this.props.updateCurrentTrack(song.track);
    this.props.play();
  }
  render() {
    return (
      <div className="song-list-container">
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
        <div className="song-list">
          {this.props.songs.map((song, i) => {
            const buttonClass =
              song.track.id === this.props.songId && !this.props.songPaused
                ? 'fa-pause-circle-o'
                : 'fa-play-circle-o';

            return !song.youtube ? (
              <li
                className={
                  song.track.id === this.props.songId
                    ? 'active user-song-item'
                    : 'user-song-item'
                }
                key={`songListItem${song.track.id}`}
              >
                <div
                  onClick={() => this.makeNewQueue(i, song)}
                  className="play-song"
                >
                  <i
                    className={`fa ${buttonClass} play-btn`}
                    aria-hidden="true"
                  />
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
            ) : (
              <li
                className={
                  song.track.id === this.props.songId
                    ? 'active user-song-item'
                    : 'user-song-item'
                }
                key={i}
              >
                <div
                  onClick={() => this.makeNewQueue(i, song)}
                  className="play-song"
                >
                  <i
                    className={`fa ${buttonClass} play-btn`}
                    aria-hidden="true"
                  />
                </div>
                <i
                  className="fa fa-youtube-play"
                  onClick={() => this.setState({ showYT: true })}
                />
                {song.track.name}
              </li>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SongList;
