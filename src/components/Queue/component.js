import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './SongList.css';

class SongList extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      this.props.currentTrack &&
      this.props.currentTrack.id !== nextProps.currentTrack.id
    ) {
      const el = document.getElementById(`queue-${nextProps.currentTrack.id}`);
      el.scrollIntoView();
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
            this.props.currentTrack &&
            song.track.id === this.props.currentTrack.id
              ? 'active'
              : ''
          }
          key={i}
          id={`queue-${song.track.id}`}
        >
          <div
            onClick={() => {
              this.props.seekForward(song.track.id);
            }}
            className="play-song"
          >
            <i className={`fa ${buttonClass} play-btn`} aria-hidden="true" />
          </div>
          <div>
            <p>{song.track.name}</p>
          </div>
        </li>
      );
    });
  }

  render() {
    return <div id="queue">{this.props.songs && this.renderSongs()}</div>;
  }
}

export default SongList;
