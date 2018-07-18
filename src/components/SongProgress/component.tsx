import { Line } from 'rc-progress';
import * as React from 'react';
import './songProcess.css';

interface IState {
  position: number;
  duration: number;
}
interface IProps {
  currentTrack: any;
  playing: any;
}

class SongControls extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      duration: 0
    };
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
        {this.props.currentTrack && (
          <div className="song-details">
            <p className="song-name">{this.props.currentTrack.name}</p>
            <p className="artist-name">
              {this.props.currentTrack.artists &&
                this.props.currentTrack.artists[0].name}
            </p>
          </div>
        )}
        <div className="line-container">
          <Line
            percent={(this.state.position / this.state.duration) * 100}
            strokeWidth="0.5"
            strokeColor="#1db954"
          />
        </div>
      </div>
    );
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
              position: await (window as any).ytPlayer.getCurrentTime(),
              duration: await (window as any).ytPlayer.getDuration()
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
export default SongControls;
