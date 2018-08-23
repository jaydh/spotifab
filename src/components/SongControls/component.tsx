import * as React from 'react';
import './SongControls.css';

interface IProps {
  nextSong: () => void;
  prevSong: () => void;
  togglePlay: () => void;
  playing: boolean;
  currentTrack: any;
  ready: boolean;
}
interface IState {
  showYT: boolean;
}
class SongControls extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showYT: false
    };
    this.toggleYoutube = this.toggleYoutube.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.prevSong = this.prevSong.bind(this);
  }
  public componentWillReceiveProps(nextProps) {
    if (nextProps.currentTrack && !nextProps.currentTrack.youtube) {
      this.setState({ showYT: false });
      document.getElementById('ytPlayer')!.style.display = 'none';
    }
  }
  public render() {
    const enable = this.props.ready;
    let image = '';
    if (this.props.currentTrack) {
      image = this.props.currentTrack.track.album
        ? this.props.currentTrack.track.album.images[1].url
        : `http://img.youtube.com/vi/${
            this.props.currentTrack.track.id
          }/hqdefault.jpg`;
    }
    return (
      <div
        className="playback-controls"
        style={{
          backgroundImage: this.state.showYT ? '' : `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center'
        }}
      >
        {this.props.currentTrack && (
          <div className="song-details">
            <p className="song-name">{this.props.currentTrack.track.name}</p>
            <p className="artist-name">
              {this.props.currentTrack.track.artists &&
                this.props.currentTrack.track.artists[0].name}
            </p>
            {this.props.currentTrack.youtube && (
              <button className="btn">
                <i className="fab fa-youtube" onClick={this.toggleYoutube} />
              </button>
            )}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            id="ytPlayer"
            style={{
              display: 'none',
              padding: '20px',
              margin: 'auto',
              maxWidth: '80%',
              maxHeight: '75%',
              height: 'auto',
            }}
          />
        </div>
        <button
          onClick={this.prevSong}
          className={
            enable ? 'playback-btn reverse' : 'playback-btn reverse fa-disabled'
          }
          disabled={!enable}
        >
          <i className="fa fa-sm fa-step-backward reverse" aria-hidden="true" />
        </button>
        <button
          onClick={this.togglePlay}
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
          className={
            enable ? 'playback-btn forward' : 'playback-btn forward fa-disabled'
          }
          onClick={this.nextSong}
          disabled={!enable}
        >
          <i className="fa fa-sm fa-step-forward forward" aria-hidden="true" />
        </button>
      </div>
    );
  }
  private toggleYoutube() {
    document.getElementById('ytPlayer')!.style.display = this.state.showYT
      ? 'none'
      : 'flex';
    this.setState({ showYT: !this.state.showYT });
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
}
export default SongControls;
