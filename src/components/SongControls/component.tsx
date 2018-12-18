import * as React from 'react';
import './SongControls.css';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Trash from '@material-ui/icons/Delete';
import Forward from '@material-ui/icons/FastForward';
import Rewind from '@material-ui/icons/FastRewind';
import Pause from '@material-ui/icons/Pause';
import Play from '@material-ui/icons/PlayArrow';

interface IProps {
  nextSong: () => void;
  prevSong: () => void;
  togglePlay: () => void;
  playing: boolean;
  currentTrack: any;
  nextTrack: any;
  prevTrack: any;
  ready: boolean;
  removeNext: () => void;
  removeSongFromQueue: (index) => void;
  nextTrackPosition: number;
  seek: (t: number) => void;
}

interface IState {
  showLeft: boolean;
  showRight: boolean;
}

class SongControls extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { showLeft: false, showRight: false };

    this.togglePlay = this.togglePlay.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.prevSong = this.prevSong.bind(this);
    this.removeNext = this.removeNext.bind(this);
    this.toggleLeft = this.toggleLeft.bind(this);
    this.toggleRight = this.toggleRight.bind(this);
  }

  public render() {
    const { ready } = this.props;
    return (
      <Grid container={true} justify="center" alignItems="center">
        <IconButton
          onClick={this.prevSong}
          onMouseEnter={this.toggleLeft(true)}
          onMouseLeave={this.toggleLeft(false)}
          disabled={!ready}
        >
          {false && this.props.prevTrack.track.name}
          <Rewind />
        </IconButton>
        <IconButton onClick={this.togglePlay} disabled={!ready}>
          {this.props.playing ? <Pause /> : <Play />}
        </IconButton>
        <IconButton
          onClick={this.nextSong}
          onMouseEnter={this.toggleRight(true)}
          onMouseLeave={this.toggleRight(false)}
          disabled={!ready}
        >
          <Forward />
          {false && this.props.nextTrack.track.name}
        </IconButton>
        {false && (
          <IconButton onClick={this.removeNext}>
            <Trash />
          </IconButton>
        )}
      </Grid>
    );
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

  private removeNext() {
    this.props.removeSongFromQueue(this.props.nextTrackPosition);
  }

  private toggleLeft = value => () => {
    this.setState({ showLeft: this.props.prevTrack && value });
  };

  private toggleRight = value => () => {
    this.setState({ showRight: this.props.nextTrack && value });
  };
}
export default SongControls;
