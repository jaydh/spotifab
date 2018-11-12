import { Line } from 'rc-progress';
import * as React from 'react';
import SongControls from '../SongControls';
import VolumeControls from '../VolumeControls';
import './songProcess.css';

import AppBar from '@material-ui/core/AppBar';

interface IState {
  position: number;
  seekTime: number;
  seekString: string;
}
interface IProps {
  nextSong: () => void;
  prevSong: () => void;
  togglePlay: () => void;
  seek: (t: number) => void;
  removeSongFromQueue: (position: number) => void;
  playing: boolean;
  currentTrack: any;
  ready: boolean;
  classes: any;
}

export default class SongProgress extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      seekTime: 0,
      seekString: '0:00'
    };
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  public async componentDidMount() {
    this.calculateTime();
  }

  public componentWillUnmount() {
    clearInterval((this as any).intervalId);
  }

  public render() {
    const { currentTrack, classes } = this.props;
    const { duration_ms } = currentTrack ? currentTrack.track : 0;
    return (
      <div id="song-progress-container">
        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <div className="song-controls-container">
            <div className="progress-left">
              <p>{this.millisToMinutesAndSeconds(this.state.position)}</p>
            </div>
            <SongControls />
            <div className="progress-right">
              <p>{this.millisToMinutesAndSeconds(duration_ms)}</p>
              <VolumeControls />
            </div>{' '}
          </div>
        </AppBar>

        <div id="line-container">
          <Line
            percent={
              !isNaN(this.state.position / duration_ms)
                ? (this.state.position / duration_ms) * 100
                : 0
            }
            strokeWidth="0.6"
            trailWidth="0.3"
            strokeColor="#252627"
            onClick={this.handleClick}
            onMouseMove={this.handleHover}
          />
        </div>
      </div>
    );
  }

  private handleClick(e: any) {
    this.props.seek(this.state.seekTime);
  }

  private handleHover(e: any) {
    const t = document.getElementById('line-container');
    const percentage = e.clientX / t!.scrollWidth;
    const { currentTrack } = this.props;

    if (currentTrack) {
      const { duration_ms } = currentTrack.track;
      this.setState({
        seekTime: duration_ms * percentage,
        seekString: this.millisToMinutesAndSeconds(duration_ms * percentage)
      });
    }
  }

  private millisToMinutesAndSeconds(millis: number) {
    const minutes = Math.round(millis / 60000);
    const seconds = Math.round((millis % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  private calculateTime() {
    (this as any).intervalId = setInterval(async () => {
      const { currentTrack, ready } = this.props;

      if (currentTrack && ready) {
        const { duration_ms } = currentTrack.track;
        const position = currentTrack.youtube
          ? (await (window as any).ytPlayer.getCurrentTime()) * 1000
          : (await (window as any).player.getCurrentState())
            ? (await (window as any).player.getCurrentState()).position
            : 0;
        if (position && duration_ms - position < 1000) {
          this.props.nextSong();
        }
        this.setState({
          position
        });
      }
    }, 50) as any;
  }
}
