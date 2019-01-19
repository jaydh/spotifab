import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Typography,
  withStyles
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import * as React from "react";
import { initYoutube } from "../../helpers/initPlaybackAPIs";

interface IProps {
  currentTrack: any;
  classes: any;
}

interface IState {
  showYT: boolean;
  expanded: boolean;
  maximizeYT: boolean;
}
class CurrentArt extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      expanded: false,
      showYT: false,
      maximizeYT: false
    };
    this.toggleYoutube = this.toggleYoutube.bind(this);
    this.toggleMaxYT = this.toggleMaxYT.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }
  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.currentTrack && !nextProps.currentTrack.youtube) {
      this.setState({ showYT: false });
      document.getElementById("ytPlayer")!.style.display = "none";
    }
  }

  public componentDidMount() {
    initYoutube();
  }

  public render() {
    const { classes, currentTrack } = this.props;
    const { expanded } = this.state;
    let image = "";
    if (currentTrack) {
      image = this.props.currentTrack.track.album
        ? this.props.currentTrack.track.album.images[1].url
        : `http://img.youtube.com/vi/${
            this.props.currentTrack.track.id
          }/hqdefault.jpg`;
    }
    return (
      <ExpansionPanel
        className={classes.root}
        expanded={expanded}
        onChange={this.toggleExpand}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          {currentTrack && (
            <Grid container={true} alignItems="center">
              {!this.state.showYT && (
                <img
                  src={image}
                  className={classes.image}
                  style={{
                    height: expanded ? "200px" : "24px",
                    borderRadius: expanded ? "0%" : "10%"
                  }}
                />
              )}
              <Typography className={classes.title} variant="subtitle2">
                {currentTrack.track.name}{" "}
              </Typography>
              <Typography variant="body1">
                {currentTrack.track.artists &&
                  currentTrack.track.artists[0].name}
              </Typography>
            </Grid>
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container={true} alignItems="center" justify="center">
            <Grid item={true} xs={3} sm={3} md={3} lg={3}>
              <>
                <div
                  id="ytPlayer"
                  style={{
                    display: "none",
                    margin: "auto",
                    maxHeight: !this.state.maximizeYT ? "20px" : "200px",
                    height: !this.state.maximizeYT ? "auto" : "200px",
                    maxWidth: !this.state.maximizeYT ? "20px" : "200px"
                  }}
                />
              </>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  private toggleYoutube() {
    document.getElementById("ytPlayer")!.style.display = this.state.showYT
      ? "none"
      : "flex";
    this.setState({ showYT: !this.state.showYT });
  }

  private toggleMaxYT() {
    this.setState({ maximizeYT: !this.state.maximizeYT });
  }
  private toggleExpand() {
    this.setState({ expanded: !this.state.expanded });
  }
}

const styles = {
  image: { transition: "all 0.5s ease" },
  title: { padding: "0 2em" },
  root: {}
};
export default withStyles(styles)(CurrentArt);
