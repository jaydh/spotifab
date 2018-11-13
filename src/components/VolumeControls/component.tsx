import * as React from 'react';

import './VolumeControls.css';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
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
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Button
          variant="fab"
          mini={true}
          onClick={this.props.toggleMute}
        >
          <i
            className={
              this.props.muted ? 'fa fa-volume-off' : 'fa fa-volume-up'
            }
            aria-hidden="true"
          />
        </Button>
        <Slider
          className={classes.slider}
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
  root: { alignItems: 'center', display: 'flex', width: 160 },
  slider: {
    padding: '22px 0px'
  }
};

export default withStyles(styles)(VolumeControls);
