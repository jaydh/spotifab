import {
  Collapse,
  Fade,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import * as React from "react";
import { initYoutube } from "../../helpers/initPlaybackAPIs";

interface IProps {
  currentTrack: any;
  classes: any;
  playing: boolean;
}

interface IState {
  expanded: boolean;
}
class CurrentArt extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      expanded: false
    };
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  public componentDidMount() {
    initYoutube();
  }
  public componentDidUpdate(prev: IProps) {
    if (prev.currentTrack.track.id !== this.props.currentTrack.track.id) {
      const element = document.getElementById("ytPlayer");
      if (element && !this.props.currentTrack.youtube) {
        const style = element.style;
        style.height = "0px";
        style.width = "0px";
      }
    }
  }

  public render() {
    const { classes, currentTrack, playing } = this.props;
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
          <Grid container={true} alignItems="center">
            <Fade in={expanded && currentTrack.youtube}>
              <Paper>
                <div id="ytPlayer" className={classes.youtube} />
              </Paper>
            </Fade>
            {(!playing || !currentTrack.youtube || !expanded) && (
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
              {currentTrack.track.artists && currentTrack.track.artists[0].name}
            </Typography>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>{"  "}</ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  private toggleExpand() {
    const { expanded } = this.state;
    const { playing, currentTrack } = this.props;
    const { youtube } = currentTrack;
    const element = document.getElementById("ytPlayer");
    if (element) {
      const style = element.style;
      const hide = !youtube || expanded || !playing;
      style.height = hide ? "0px" : "200px";
      style.width = hide ? "0px" : "200px";
    }

    this.setState({ expanded: !this.state.expanded });
  }
}

const styles = {
  image: { transition: "all 0.5s ease" },
  title: { padding: "0 2em" },
  root: {},
  youtube: {
    display: "block",
    height: "0px",
    width: "0px",
    transition: "all 0.25s ease"
  }
};
export default withStyles(styles)(CurrentArt);
