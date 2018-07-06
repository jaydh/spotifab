import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongList.css';
import SongControls from '../SongControls';

class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showYT: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.position !== nextProps.position) {
      const queue = document.getElementById('queue');
      const height = queue.scrollHeight;
      const position = nextProps.position;
      const offset = (height / nextProps.songs.size) * position;
      queue.scrollTop = Math.round(offset);
    }
  }

  renderSongs() {
    const position = this.props.currentTrack
      ? this.props.songs.findKey(t => t.track.id === this.props.currentTrack.id)
      : 0;
    return this.props.songs.map((song, i) => {
      const buttonClass =
        song.track.id === this.props.songId && !this.props.songPaused
          ? 'fa-pause-circle-o'
          : 'fa-play-circle-o';
      return (
        <li
          className={
            i === this.props.position
              ? 'active user-song-item'
              : 'user-song-item'
          }
          key={i}
        >
          <div className="song-buttons">
            <button
              onClick={() => this.props.updatePosition(i)}
              className="play-song"
            >
              <i className={`fa ${buttonClass} play-btn`} aria-hidden="true" />
            </button>
          </div>
          <div className="song-title">
            <p>
              {song.youtube && <i className="fa fa-youtube-play" />}
              {song.track.name}
            </p>
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <div id="queue-container">
        <div className="song-header-container song-list-header">
          <div className="song-title-header">
            <p>
              Queue{' '}
              <button className="btn" onClick={this.props.shuffleQueue}>
                <i class="fa fa-random" aria-hidden={true} />
              </button>
              <button
                onClick={this.props.toggleRepeat}
                className={'btn' + (this.props.repeat ? 'active' : '')}
              >
                <i class="fa fa-repeat" aria-hidden={true} />
              </button>
            </p>
          </div>
        </div>
        <div id="queue" className="queue song-list">
          {this.props.songs && this.renderSongs()}
        </div>
        {this.props.currentTrack && (
          <div className="album-art">
            <div
              id="ytPlayer"
              style={{
                display: 'none',
                margin: '0 auto',
                maxWidth: '90%',
                maxHeight: '90%'
              }}
            />
            {!this.state.showYT && (
              <img
                src={
                  this.props.currentTrack.album
                    ? this.props.currentTrack.album.images[1].url
                    : `http://img.youtube.com/vi/${
                        this.props.currentTrack.id
                      }/hqdefault.jpg`
                }
                className="current-playing-art"
              />
            )}
            {!this.props.currentTrack.uri && (
              <i
                className="fa fa-youtube-play"
                onClick={() => {
                  document.getElementById('ytPlayer').style.display = this.state
                    .showYT
                    ? 'none'
                    : 'flex';
                  this.setState({ showYT: !this.state.showYT });
                }}
              />
            )}
          </div>
        )}
        <SongControls />
      </div>
    );
  }
}

export default SongList;
