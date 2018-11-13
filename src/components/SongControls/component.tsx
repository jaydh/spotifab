import * as React from 'react';
import './SongControls.css';

import Action from '@material-ui/core/ExpansionPanelActions';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
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
      <Toolbar>
        <Action>
          <IconButton
            onClick={this.prevSong}
            onMouseEnter={this.toggleLeft(true)}
            onMouseLeave={this.toggleLeft(false)}
            disabled={!ready}
          >
            {this.state.showLeft && this.props.prevTrack.track.name}
            <Rewind />
          </IconButton>
        </Action>
        <Action>
          <IconButton onClick={this.togglePlay} disabled={!ready}>
            {this.props.playing ? <Pause /> : <Play />}
          </IconButton>
        </Action>
        <Action>
          <IconButton
            onClick={this.nextSong}
            onMouseEnter={this.toggleRight(true)}
            onMouseLeave={this.toggleRight(false)}
            disabled={!ready}
          >
            <Forward />
            {this.state.showRight && this.props.nextTrack.track.name}
          </IconButton>
          {this.state.showRight && (
            <IconButton onClick={this.removeNext}>
              <Trash />
            </IconButton>
          )}
        </Action>
      </Toolbar>
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
