import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './SongControls.css';
import { Icon } from 'react-fa';

class SongControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      duration: 0,
      songs: null
    };
  }
  componentDidMount() {
    this.calculateTime();
  }
  calculateTime() {
    setInterval(async () => {
      if (window.player) {
        const state = await window.player.getCurrentState();
        if (state) {
          const ratio = state.position / state.duration;
          const minutes = Math.floor(state.position / 60000);
          const seconds = ((state.position % 60000) / 1000).toFixed(0);
          this.setState({
            position: state.position,
            duration: state.duration
          });
        }
      }
    }, 200);
  }

  render() {
    const showPlay = this.props.songPaused
      ? 'fa fa-play-circle-o play-btn'
      : 'fa fa-pause-circle-o pause-btn';
    return (
      <div className="song-player-container">
        <div className="song-details">
          <p className="song-name">{this.props.songName}</p>
          <p className="artist-name">{this.props.artistName}</p>
        </div>

        <div className="song-controls">
          <div
            onClick={() => {
              this.props.prevSong();
            }}
            className="reverse-song"
          >
            <i className="fa fa-step-backward reverse" aria-hidden="true" />
          </div>
          <Icon
            name={this.props.songPaused ? 'play' : 'pause'}
            onClick={
              !this.props.songPaused
                ? this.props.pauseSong
                : this.props.resumeSong
            }
          />
          <div
            onClick={() => {
              this.props.nextSong();
            }}
            className="next-song"
          >
            <i className="fa fa-step-forward forward" aria-hidden="true" />
          </div>
        </div>
        <div className="song-progress">
          {this.state.position && (
            <div
              style={{
                width:
                  (this.state.position / this.state.duration) *
                  0.8 *
                  window.innerWidth
              }}
              className="song-expired"
            />
          )}
        </div>
      </div>
    );
  }
}

SongControls.propTypes = {
  songPlaying: PropTypes.bool,
  songPaused: PropTypes.bool,
  songName: PropTypes.string,
  artistName: PropTypes.string,
  stopSong: PropTypes.func,
  resumeSong: PropTypes.func,
  increaseSongTime: PropTypes.func,
  pauseSong: PropTypes.func,
  songs: PropTypes.array,
  songDetails: PropTypes.object,
  audioControl: PropTypes.func
};

export default SongControls;
