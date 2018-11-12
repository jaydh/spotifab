import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './VolumeControls.css';
import Slider from 'react-rangeslider';

class VolumeControls extends Component {
  updateVolume = e => {
    const newV = e.target.value > 80 ? e.target.value : e.target.value + 20;
    this.props.updateVolume(Number(newV));
  };

  render() {
    return (
      <div className="volume-container">
        <Slider value={this.props.volume} onChange={this.updateVolume} />
        <button className="mute" onClick={this.props.toggleMute}>
          <i
            className={
              this.props.muted ? 'fa fa-volume-off' : 'fa fa-volume-up'
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
          value={this.props.volume.toString()}
          onChange={this.updateVolume}
        />
      </div>
    );
  }
}

export default VolumeControls;
