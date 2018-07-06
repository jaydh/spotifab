import * as React from 'react';
import { Icon } from 'react-fa';
import { Line } from 'rc-progress';
import './SongControls.css';

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
        <div className="song-controls">
          <div
            onClick={() => {
              this.props.prevSong();
            }}
            className="reverse-song"
          >
            <i
              className="fa fa-2x fa-step-backward reverse"
              aria-hidden="true"
            />
          </div>
          <i
            className={
              this.props.playing ? 'fa fa-2x fa-pause' : 'fa fa-2x fa-play'
            }
            onClick={this.props.togglePlay}
          />
          <div
            onClick={() => {
              this.props.nextSong();
            }}
            className="next-song"
          >
            <i
              className="fa fa-2x fa-step-forward forward"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  }
}
export default SongControls;
