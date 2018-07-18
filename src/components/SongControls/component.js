import * as React from 'react';
import { Icon } from 'react-fa';
import { Line } from 'rc-progress';
import './SongControls.css';
import VolumeControls from '../VolumeControls';

interface IProps {
  nextSong: () => void;
  prevSong: () => void;
  togglePlay: () => void;
  playing: boolean;
}

class SongControls extends React.Component<IProps> {
  render() {
    return (
      <div className="song-player-container">
        <VolumeControls />
        <div className="song-controls">
          <button
            onClick={() => {
              this.props.prevSong();
            }}
            className="reverse"
          >
            <i
              className="fa fa-2x fa-step-backward reverse"
              aria-hidden="true"
            />
          </button>
          <button
            onClick={this.props.togglePlay}
            className={
              !(this.props.spotifyReady && this.props.youtubeReady)
                ? 'fa-disabled play'
                : 'play'
            }
          >
            <i
              className={
                this.props.playing ? 'fa fa-2x fa-pause' : 'fa fa-2x fa-play'
              }
              aria-hidden="true"
            />
          </button>
          <button
            onClick={() => {
              this.props.nextSong();
            }}
            className="forward"
          >
            <i
              className="fa fa-2x fa-step-forward forward"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    );
  }
}
export default SongControls;
