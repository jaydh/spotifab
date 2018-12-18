import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import * as React from 'react';
import { initYoutube } from '../../helpers/initPlaybackAPIs';
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

  public componentDidMount() {
    initYoutube();
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
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          {this.props.currentTrack && (
            <>
              <Typography variant="subtitle2">
                {this.props.currentTrack.track.name}{' '}
              </Typography>
              <Typography variant="body1">
                {this.props.currentTrack.track.artists &&
                  this.props.currentTrack.track.artists[0].name}
              </Typography>
            </>
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container={true} alignItems="center" justify="center">
            <Grid item={true} xs={3} sm={3} md={3} lg={3}>
              <>
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
                <div className="responsive">
                  {!this.state.showYT && (
                    <img src={image} className="responsive-img" />
                  )}
                </div>
              </>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
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
