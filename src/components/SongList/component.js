import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongList.css';
import Draggable from 'react-draggable';
class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showYT: false,
      downSelectorPos: 0,
      upSelectorPos: 0
    };
  }
  componentDidMount() {
    this.props.fetchSongs();
  }

  makeNewQueue(i, j) {
    let end = i < j ? j : this.props.songs.size - 1;
    this.props.clearSongQueue();
    this.props.updateCurrentTrack(this.props.songs.get(i));
    this.props.songs.slice(i, end).map(t => {
      this.props.addSongToQueue(t);
    });
  }

  updateDownPos = (e: MouseEvent, data: Object) => {
    const list = document.getElementById('songList');
    const height = list.scrollHeight;
    const itemHeight = height / this.props.songs.size;
    const position = Math.round(data.lastY / itemHeight);
    this.setState({ downSelectorPos: position });
    this.makeNewQueue(this.state.downSelectorPos, this.state.upSelectorPos);
  };
  updateUpPos = (e: MouseEvent, data: Object) => {
    const list = document.getElementById('songList');
    const height = list.scrollHeight;
    const itemHeight = height / this.props.songs.size;
    const position = Math.round(data.lastY / itemHeight);
    this.setState({ upSelectorPos: position });
    this.makeNewQueue(this.state.downSelectorPos, this.state.upSelectorPos);
  };

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
        <div id="songList" className="song-list">
          <Draggable
            axis="y"
            defaultPosition={{ x: 900, y: 0 }}
            grid={[30, 30]}
            onStop={this.updateDownPos}
          >
            <button className="btn">
              <i className="fa fa-angle-down" />
            </button>
          </Draggable>
          <Draggable
            axis="y"
            defaultPosition={{ x: 900, y: 5 }}
            grid={[30, 30]}
            onStop={this.updateUpPos}
          >
            <button className="btn">
              <i className="fa fa-angle-up" />
            </button>
          </Draggable>

          {this.props.songs.map((song, i) => {
            const buttonClass =
              song.track.id === this.props.songId && !this.props.songPaused
                ? 'fa-pause-circle-o'
                : 'fa-play-circle-o';

            return !song.youtube ? (
              <li
                className="user-song-item"
                key={`songListItem${song.track.id}`}
              >
                <button
                  onClick={() => {
                    this.makeNewQueue(i, this.state.upSelectorPos);
                    this.props.play();
                  }}
                  className="play-song"
                >
                  <i
                    className={`fa ${buttonClass} play-btn`}
                    aria-hidden="true"
                  />
                </button>

                <div className="song-title">
                  <p>{song.track.name}</p>
                </div>

                <div className="song-artist">
                  <p>{song.track.artists[0].name}</p>
                </div>

                <div className="song-album">
                  <p>{song.track.album.name}</p>
                </div>
                <button
                  onClick={() => this.props.addSongToQueue(song)}
                  className="play-song"
                >
                  <i className={'fa fa-plus'} aria-hidden="true" />
                </button>
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
                <button
                  onClick={() => this.props.addSongToQueue(song)}
                  className="play-song"
                >
                  <i className={'fa fa-plus'} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SongList;
