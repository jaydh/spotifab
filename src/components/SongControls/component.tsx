import * as React from 'react';
import './SongControls.css';

interface IProps {
  currentTrack: any;
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
  }
  public componentWillReceiveProps(nextProps) {
    if (nextProps.currentTrack && !nextProps.currentTrack.youtube) {
      this.setState({ showYT: false });
      document.getElementById('ytPlayer')!.style.display = 'none';
    }
  }
  public render() {
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
        style={{
          backgroundImage: this.state.showYT ? '' : `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '95%',
          height: '20vh'
        }}
      >
        {this.props.currentTrack &&
          this.props.currentTrack.youtube && (
            <button className="btn">
              <i className="fab fa-youtube" onClick={this.toggleYoutube} />
            </button>
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
              height: 'auto'
            }}
          />
        </div>
      </div>
    );
  }
  private toggleYoutube() {
    document.getElementById('ytPlayer')!.style.display = this.state.showYT
      ? 'none'
      : 'flex';
    this.setState({ showYT: !this.state.showYT });
  }
}
export default SongControls;
