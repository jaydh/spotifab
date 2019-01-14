import { Grid, LinearProgress, Typography } from "@material-ui/core";
import * as React from "react";

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
      seekString: "0:00"
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
    const { currentTrack } = this.props;
    const { duration_ms } = currentTrack ? currentTrack.track : 0;
    return (
      <Grid container={true} alignItems="center" justify="center" spacing={16}>
        <Grid item={true}>
          <Typography>
            {this.millisToMinutesAndSeconds(this.state.position)}
          </Typography>
        </Grid>
        <Grid item={true} xs={8} sm={8} md={8} lg={8}>
          <div
            id="line-container"
            onClick={this.handleClick}
            onMouseMove={this.handleHover}
          >
            <LinearProgress
              variant="determinate"
              value={
                !isNaN(this.state.position / duration_ms)
                  ? (this.state.position / duration_ms) * 100
                  : 0
              }
            />
          </div>
        </Grid>
        <Grid item={true}>
          <Typography>{this.millisToMinutesAndSeconds(duration_ms)}</Typography>
        </Grid>
      </Grid>
    );
  }
  private handleClick(e: any) {
    console.log(this.state.seekTime);
    this.props.seek(this.state.seekTime);
  }

  private handleHover(e: any) {
    const t = document.getElementById("line-container");
    const rect = t!.getBoundingClientRect();
    const { left, width } = rect;
    const percentage = (e.screenX - left) / width;
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
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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
