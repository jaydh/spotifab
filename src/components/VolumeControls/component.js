import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './VolumeControls.css';

class VolumeControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: props.volume
    };
  }

  updateVolume = e => {
    this.setState({
      volume: e.target.value
    });

    this.props.updateVolume(Number(e.target.value));
  };

  render() {
    return (
      <div className="volume-container">
        <button className="mute" onClick={this.props.toggleMute}>
          <i
            className={
              this.props.muted
                ? 'fa fa-lg fa-volume-off'
                : 'fa fa-lg fa-volume-up'
            }
            aria-hidden="true"
          />
        </button>
        <input
          className="volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={this.state.volume.toString()}
          onChange={this.updateVolume}
        />
      </div>
    );
  }
}

export default VolumeControls;
