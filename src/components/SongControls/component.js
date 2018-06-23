import React, { Component } from 'react';
import VolumeControls from '../VolumeControls';
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
      const { currentTrack } = this.props;
      if (currentTrack && window.player && window.ytPlayer) {
        if (!currentTrack.uri) {
          this.setState({
            position: window.ytPlayer.getCurrentTime(),
            duration: window.ytPlayer.getDuration()
          });
        } else {
          const state = await window.player.getCurrentState();
          if (state) {
            this.setState({
              position: state.position,
              duration: state.duration
            });
          }
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
            name={this.props.playing ? 'pause' : 'play'}
            onClick={this.props.togglePlay}
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
        <VolumeControls />
        {this.state.position && (
          <div
            className="song-progress"
            style={{
              width:
                (this.state.position / this.state.duration) * window.innerWidth
            }}
            className="song-expired"
          />
        )}
      </div>
    );
  }
}
export default SongControls;
