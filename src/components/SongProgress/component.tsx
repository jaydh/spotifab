import { Line } from 'rc-progress';
import * as React from 'react';
import VolumeControls from '../VolumeControls';
import './songProcess.css';

interface IState {
  position: number;
  duration: number;
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
      duration: 0,
      seekTime: 0,
      seekString: '0:00'
    };
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.prevSong = this.prevSong.bind(this);
  }
  public componentDidMount() {
    this.calculateTime();
  }
  public componentWillUnmount() {
    clearInterval((this as any).intervalId);
  }

  public render() {
    const enable = this.props.ready;

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
          <VolumeControls />
        </div>
        <div className="line-container">
          <Line
            percent={
              !isNaN(this.state.position / this.state.duration)
                ? (this.state.position / this.state.duration) * 100
                : 0
            }
            strokeWidth="0.8"
            trailWidth="0.5"
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
    const t = document.getElementById('song-progress-container');
    const percentage = e.clientX / t!.clientWidth;
    this.setState({
      seekTime: this.state.duration * percentage,
      seekString: this.millisToMinutesAndSeconds(
        this.state.duration * percentage
      )
    });
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
      if (this.props.playing) {
        const { currentTrack, ready } = this.props;
        if (currentTrack && ready) {
          if (currentTrack.youtube) {
            this.setState({
              position:
                (await (window as any).ytPlayer.getCurrentTime()) * 1000,
              duration: (await (window as any).ytPlayer.getDuration()) * 1000
            });
          } else {
            const state = await (window as any).player.getCurrentState();
            if (state) {
              if (state.duration - state.position < 300) {
                this.props.nextSong();
              }
              this.setState({
                position: state.position,
                duration: state.duration
              });
            }
          }
        }
      }
    }, 100) as any;
  }
}
