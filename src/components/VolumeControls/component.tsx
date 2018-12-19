import * as React from 'react';

import './VolumeControls.css';

import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Mute from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Slider from '@material-ui/lab/Slider';

interface IProps {
  classes: any;
  muted: boolean;
  volume: number;
  toggleMute: () => void;
  updateVolume: (t: number) => void;
}

class VolumeControls extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.updateVolume = this.updateVolume.bind(this);
  }

  public render() {
    const { classes, muted } = this.props;
    return (
      <div className={classes.root}>
        <IconButton
          children={muted ? <Mute /> : <VolumeUp />}
          onClick={this.props.toggleMute}
        />
        <Slider
          color="secondary"
          className={classes.slider}
          step={1}
          value={this.props.volume}
          aria-labelledby="volume"
          onChange={this.updateVolume}
        />
      </div>
    );
  }
  private updateVolume = (e, value) => {
    this.props.updateVolume(value);
  };
}

const styles = {
  root: { alignItems: 'center', display: 'flex', width: 80 },
  slider: { padding: '20px 0px' }
};

export default withStyles(styles)(VolumeControls);
