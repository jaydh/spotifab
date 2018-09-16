import { Line } from 'rc-progress';
import * as React from 'react';
import VolumeControls from '../VolumeControls';
import './songProcess.css';

interface IState {
  position: number;
  seekTime: number;
  seekString: string;
}
interface IProps {
  nextSong: () => void;
  prevSong: () => void;
  togglePlay: () => void;
  playing: boolean;
  currentTrack: any;
  ready: boolean;
  seek: (t: number) => void;
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
    this.togglePlay = this.togglePlay.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.prevSong = this.prevSong.bind(this);
  }
  public async componentDidMount() {
    this.calculateTime();
  }

  public componentWillUnmount() {
    clearInterval((this as any).intervalId);
  }

  public render() {
    const enable = this.props.ready;
    const { currentTrack } = this.props;
    const { duration_ms } = currentTrack ? currentTrack.track : 0
    return (
      <div id="song-progress-container">
        {this.props.currentTrack && (
          <div className="song-details">
            <p className="song-name">{this.props.currentTrack.track.name}</p>
            <p className="artist-name">
              {this.props.currentTrack.track.artists &&
                this.props.currentTrack.track.artists[0].name}
            </p>
          </div>
        )}
        <div className="song-controls-container">
          <p>
            {this.millisToMinutesAndSeconds(this.state.position)}
          </p>
          <button
            onClick={this.prevSong}
            className={
              enable
                ? 'playback-btn reverse btn'
                : 'playback-btn reverse fa-disabled btn'
            }
            disabled={!enable}
          >
            <i
              className="fa fa-sm fa-step-backward reverse"
              aria-hidden="true"
            />
          </button>
          <button
            onClick={this.togglePlay}
            className={
              enable
                ? 'playback-btn play btn'
                : 'plackback-btn play fa-disabled btn'
            }
            disabled={!enable}
          >
            <i
              className={
                this.props.playing ? 'fa fa-2x fa-pause' : 'fa fa-2x fa-play'
              }
              aria-hidden="true"
            />
          </button>
          <button
            className={
              enable
                ? 'playback-btn forward btn'
                : 'playback-btn forward fa-disabled btn'
            }
            onClick={this.nextSong}
            disabled={!enable}
          >
            <i
              className="fa fa-sm fa-step-forward forward"
              aria-hidden="true"
            />
          </button>
          <p>{this.millisToMinutesAndSeconds(duration_ms)}</p>
          <VolumeControls />
        </div>
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
    const percentage = e.clientX / t!.scrollWidth
    const { currentTrack } = this.props;

    if (currentTrack) {
      const { duration_ms } = currentTrack.track
      this.setState({
        seekTime: duration_ms * percentage,
        seekString: this.millisToMinutesAndSeconds(
          duration_ms * percentage
        )
      });
    }
  }

  private millisToMinutesAndSeconds(millis: number) {
    const minutes = Math.round(millis / 60000);
    const seconds = Math.round((millis % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  private nextSong() {
    this.props.nextSong();
  }
  private prevSong() {
    this.props.prevSong();
  }

  private togglePlay() {
    this.props.togglePlay();
  }

  private calculateTime() {
    (this as any).intervalId = setInterval(async () => {
      const { currentTrack, ready } = this.props;

      if (currentTrack && ready) {
        const { duration_ms } = currentTrack.track
        const position = currentTrack.youtube
          ? (await (window as any).ytPlayer.getCurrentTime()) * 1000
          : await (window as any).player.getCurrentState() ? (await (window as any).player.getCurrentState()).position : 0
        if ((position) && duration_ms - position < 300) {
          this.props.nextSong();
        }
        this.setState({
          position
        });
      }
    }, 50) as any;
  }
}
