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
  private intervalId = undefined;
  constructor(props: IProps) {
    super(props);
    this.state = {
      position: 0,
      seekTime: 0,
      seekString: "0:00"
    };
  }

  componentDidMount() {}

  public componentDidUpdate(prev: IProps) {
    const { playing } = this.props;
    // Reset proress watcher for each new song to block next song requests
    // firing too soon
    if (playing) {
      this.calculateTime();
      this.checkForNextSong();
    }
  }

  public componentWillUnmount() {
    clearInterval(this.intervalId);
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

  private handleClick = (e: any) => {
    this.props.seek(this.state.seekTime);
  };

  private handleHover = (e: any) => {
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
  };

  private millisToMinutesAndSeconds(millis: number) {
    const minutes = Math.round(millis / 60000);
    const seconds = Math.round((millis % 60000) / 1000);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  private calculateTime = () => {
    this.intervalId = setInterval(() => {
      this.updatePosition();
    }, 250) as any;
  };

  private updatePosition = async () => {
    const position = await this.getPlayerPosition();
    this.setState({ position });
  };

  private checkForNextSong = () => {
    const { currentTrack, nextSong } = this.props;
    const { position } = this.state;
    const { duration_ms } = currentTrack.track;

    const youtubeState = window.ytPlayer.getPlayerState();
    const youtubeDone = currentTrack.youtube && youtubeState === 0;
    const spotifyDone = currentTrack.spotify && duration_ms - position < 500;

    if (youtubeDone || spotifyDone) {
      nextSong();
      this.restartTimer();
    }
  };

  private restartTimer = () => {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
    this.calculateTime();
  };

  private getPlayerPosition = async (): Promise<number> => {
    const { currentTrack } = this.props;
    if (currentTrack.youtube) {
      const youtubeTime = window.ytPlayer.getCurrentTime();
      return isNaN(youtubeTime) ? 0 : youtubeTime * 1000;
    } else if (currentTrack.spotify) {
      const spotifyState = await window.player.getCurrentState();
      return spotifyState ? spotifyState.position : 0;
    }
    return -1;
  };
}
