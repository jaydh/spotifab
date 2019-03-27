import {
  Button,
  Fade,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";
import { Album, Group, ExpandMore, Add, Remove } from "@material-ui/icons";
import * as React from "react";
import { Link } from "react-router-dom";
import { Spotify, Youtube } from "mdi-material-ui";

interface IProps {
  currentSong: any;
  classes: any;
  playing: boolean;
  isSaved: boolean;
  addSpotifySong: (id: string) => void;
  addYoutubeSong: (id: string) => void;
}

interface IState {
  expanded: boolean;
}

const styles = {
  image: { transition: "all 0.5s ease" },
  title: { padding: "0 2em", transition: "all 0.5s ease" },
  root: {},
  youtube: {
    display: "block",
    height: "0px",
    width: "0px",
    transition: "all 0.25s ease"
  },
  button: { marginRight: "1em", transition: "all 0.5s ease" },
  buttonIn: { marginRight: "0.5em" }
};

class CurrentArt extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  public componentDidUpdate(prev: IProps) {
    // Hide ytPlayer if not youtube song
    if (prev.currentSong.track.id !== this.props.currentSong.track.id) {
      const element = document.getElementById("ytPlayer");
      if (element && !this.props.currentSong.youtube) {
        const style = element.style;
        style.height = "0px";
        style.width = "0px";
      }
    }
  }

  public render() {
    const { classes, currentSong, isSaved } = this.props;
    const { expanded } = this.state;
    const { track } = currentSong;

    const image = track.album
      ? track.album.images[1].url
      : `http://img.youtube.com/vi/${track.id}/hqdefault.jpg`;

    console.log(track);
    return (
      <ExpansionPanel
        className={classes.root}
        expanded={expanded}
        onChange={this.toggleExpand}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Grid container={true} alignItems="center">
            <Fade in={expanded && currentSong.youtube}>
              <Paper>
                <div id="ytPlayer" className={classes.youtube} />
              </Paper>
            </Fade>
            {(!currentSong.youtube || !expanded) && (
              <img
                src={image}
                className={classes.image}
                style={{
                  height: expanded ? "200px" : "24px",
                  borderRadius: expanded ? "0%" : "10%"
                }}
              />
            )}
            <Typography
              className={classes.title}
              variant={expanded ? "h3" : "headline"}
            >
              {track.name}{" "}
            </Typography>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {track.artists &&
            track.artists.map((t: any) => (
              <Link to={`/artist/${t.id}`} key={`to artist${t.id}`}>
                <Button
                  className={classes.button}
                  color="primary"
                  size={expanded ? "large" : "small"}
                >
                  <Group className={classes.buttonIn} />
                  {t.name}
                </Button>
              </Link>
            ))}
          {track.album && (
            <Link to={`/album/${track.album.id}`}>
              <Button
                className={classes.button}
                color="primary"
                size={expanded ? "large" : "small"}
              >
                <Album className={classes.buttonIn} />
                {track.album.name}
              </Button>
            </Link>
          )}
          {track.external_urls && (
            <Button color="primary" size={expanded ? "large" : "small"}>
              <a
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener"
              >
                <Spotify />
              </a>
            </Button>
          )}
          {currentSong.youtube && (
            <Button color="primary" size={expanded ? "large" : "small"}>
              <a
                href={`https://youtube.com/watch?v=${track.id}`}
                target="_blank"
                rel="noopener"
              >
                <Youtube />
              </a>
            </Button>
          )}
          {isSaved ? (
            <Button
              onClick={this.handleRemove}
              color="primary"
              size={expanded ? "large" : "small"}
            >
              <Remove />
            </Button>
          ) : (
            <Button
              onClick={this.handleAdd}
              color="primary"
              size={expanded ? "large" : "small"}
            >
              <Add />
            </Button>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  private handleAdd = () => {
    const { currentSong, addSpotifySong, addYoutubeSong } = this.props;
    const { track } = currentSong;
    if (currentSong.youtube) {
      addYoutubeSong(track);
    } else if (currentSong.spotify) {
      addSpotifySong(track);
    }
  };

  private handleRemove = () => {
    const { currentSong } = this.props;
    const { track } = currentSong;
    if (currentSong.youtube) {
    } else if (currentSong.spotify) {
    }
  };

  private toggleExpand = () => {
    const { expanded } = this.state;
    const { currentSong } = this.props;
    const { youtube } = currentSong;
    const element = document.getElementById("ytPlayer");
    if (element) {
      const style = element.style;
      const hide = !youtube || expanded;
      style.height = hide ? "0px" : "200px";
      style.width = hide ? "0px" : "200px";
    }

    this.setState({ expanded: !this.state.expanded });
  };
}

export default withStyles(styles)(CurrentArt);
