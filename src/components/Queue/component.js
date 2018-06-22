import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongList.css';

class SongList extends Component {
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
          <div
            onClick={() => this.props.updatePosition(i)}
            className="play-song"
          >
            <i className={`fa ${buttonClass} play-btn`} aria-hidden="true" />
          </div>
          {song.youtube && (
            <i
              className="fa fa-youtube-play"
              onClick={() => this.setState({ showYT: true })}
            />
          )}
          {song.track.name}
        </li>
      );
    });
  }

  render() {
    return (
      <div className="queue-container">
        <div className="song-header-container song-list-header">
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

        <div id="queue" className="song-list">
          {this.props.songs && this.renderSongs()}
        </div>
      </div>
    );
  }
}

export default SongList;
