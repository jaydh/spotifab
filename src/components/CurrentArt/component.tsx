import * as React from 'react';
import './SongControls.css';

interface IProps {
  currentTrack: any;
}

interface IState {
  showYT: boolean;
  maximizeYT: boolean;
}
class CurrentArt extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showYT: false,
      maximizeYT: false
    };
    this.toggleYoutube = this.toggleYoutube.bind(this);
    this.toggleMaxYT = this.toggleMaxYT.bind(this);
  }
  public componentWillReceiveProps(nextProps) {
    if (nextProps.currentTrack && !nextProps.currentTrack.youtube) {
      this.setState({ showYT: false });
      document.getElementById('ytPlayer')!.style.display = 'none';
    }
  }

  public render() {
    console.log(this.props);
    let image = '';
    if (this.props.currentTrack) {
      image = this.props.currentTrack.track.album
        ? this.props.currentTrack.track.album.images[1].url
        : `http://img.youtube.com/vi/${
            this.props.currentTrack.track.id
          }/hqdefault.jpg`;
    }
    console.log(image);
    return (
      <React.Fragment>
        <div className="responsive">
          {!this.state.showYT && <img src={image} className="responsive-img" />}
          <div className="responsive-yt">
            <div
              id="ytPlayer"
              style={{
                display: 'none',
                margin: 'auto',
                maxHeight: !this.state.maximizeYT ? '20px' : '200px',
                height: !this.state.maximizeYT ? 'auto' : '200px',
                maxWidth: !this.state.maximizeYT ? '20px' : '200px'
              }}
            />
          </div>
        </div>
        {this.props.currentTrack &&
          this.props.currentTrack.youtube && (
            <button className="btn">
              <i className="fab fa-youtube" onClick={this.toggleYoutube} />
            </button>
          )}
      </React.Fragment>
    );
  }
  private toggleYoutube() {
    document.getElementById('ytPlayer')!.style.display = this.state.showYT
      ? 'none'
      : 'flex';
    this.setState({ showYT: !this.state.showYT });
  }

  private toggleMaxYT() {
    this.setState({ maximizeYT: !this.state.maximizeYT });
  }
}
export default CurrentArt;
