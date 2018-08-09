import { Line } from 'rc-progress';
import * as React from 'react';
import './songProcess.css';

interface IState {
  position: number;
  duration: number;
  seekTime: number;
  seekString: string;
}
interface IProps {
  currentTrack: any;
  playing: any;
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
  }
  public componentDidMount() {
    this.calculateTime();
  }
  public componentWillUnmount() {
    clearInterval((this as any).intervalId);
  }

  public render() {
    return (
      <div id="song-progress-container">
        <div className="line-container">
          <Line
            percent={
              !isNaN(this.state.position / this.state.duration)
                ? (this.state.position / this.state.duration) * 100
                : 0
            }
            strokeWidth="0.3"
            strokeColor="#1db954"
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

  private calculateTime() {
    (this as any).intervalId = setInterval(async () => {
      if (this.props.playing) {
        const { currentTrack } = this.props;
        if (
          currentTrack &&
          (window as any).player &&
          (window as any).ytPlayer
        ) {
          if (!currentTrack.uri) {
            this.setState({
              position:
                (await (window as any).ytPlayer.getCurrentTime()) * 1000,
              duration: (await (window as any).ytPlayer.getDuration()) * 1000
            });
          } else {
            const state = await (window as any).player.getCurrentState();
            if (state) {
              this.setState({
                position: state.position,
                duration: state.duration
              });
            }
          }
        }
      }
    }, 250) as any;
  }
}
