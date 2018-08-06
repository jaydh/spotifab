import * as React from 'react';
import { Icon } from 'react-fa';
import { Line } from 'rc-progress';
import './SongControls.css';
interface IProps {
  nextSong: () => void;
  prevSong: () => void;
  togglePlay: () => void;
  playing: boolean;
}

class SongControls extends React.Component<IProps> {
  render() {
    const enable = this.props.youtubeReady && this.props.spotifyReady;
    return (
      <div className="playback-controls">
        <div
          id="ytPlayer"
          style={{
            display: 'none',
            margin: '0 auto',
            maxWidth: '90%',
            maxHeight: '90%'
          }}
        />
        {this.props.currentTrack && (
          <div className="song-details">
            <p className="song-name">{this.props.currentTrack.name}</p>
            <p className="artist-name">
              {this.props.currentTrack.artists &&
                this.props.currentTrack.artists[0].name}
            </p>
            {!this.props.currentTrack.uri && (
              <i
                className="fa fa-youtube-play"
                onClick={() => {
                  document.getElementById('ytPlayer').style.display = this.state
                    .showYT
                    ? 'none'
                    : 'flex';
                  this.setState({ showYT: !this.state.showYT });
                }}
              />
            )}
          </div>
        )}
        <button
          onClick={() => {
            this.props.prevSong();
          }}
          className={
            enable ? 'playback-btn reverse' : 'playback-btn reverse fa-disabled'
          }
          disabled={!enable}
        >
          <i className="fa fa-sm fa-step-backward reverse" aria-hidden="true" />
        </button>
        {this.props.currentTrack && (
          <img
            src={
              this.props.currentTrack.album
                ? this.props.currentTrack.album.images[1].url
                : `http://img.youtube.com/vi/${
                    this.props.currentTrack.id
                  }/hqdefault.jpg`
            }
            className="current-playing-art"
          />
        )}
        <button
          onClick={() => {
            this.props.togglePlay();
          }}
          className={
            enable ? 'playback-btn play' : 'plackback-btn play fa-disabled'
          }
          disabled={!enable}
        >
          <i
            className={
              this.props.playing ? 'fa fa-2x fa-pause' : 'fa fa-2x fa-play'
            }
            aria-hidden="true"
          />
        </button>
        <button
          onClick={() => {
            this.props.nextSong();
          }}
          className={
            enable ? 'playback-btn forward' : 'playback-btn forward fa-disabled'
          }
          disabled={!enable}
        >
          <i className="fa fa-sm fa-step-forward forward" aria-hidden="true" />
        </button>
      </div>
    );
  }
}
export default SongControls;
