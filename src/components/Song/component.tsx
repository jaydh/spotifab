import {
  Button,
  Slide,
  Fade,
  Hidden,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  withStyles
} from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import Next from "@material-ui/icons/NavigateNext";
import Play from "@material-ui/icons/PlayArrow";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";
import { parse } from "date-fns";
import { Spotify, Youtube } from "mdi-material-ui";
import * as React from "react";

interface IProps {
  index: number;
  song: any;
  makeNewQueueAndPlay: (index: number) => void;
  selected: boolean;
  addSongToQueue: (song: string) => void;
  removeSpotifySong: (song: any) => void;
  removeYoutubeSong: (song: any) => void;
  addToNext: () => void;
  sort: string;
  classes: any;
}

interface IState {
  showOptions: boolean;
  hovered: boolean;
}

class Song extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showOptions: false,
      hovered: false
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.handleDouble = this.handleDouble.bind(this);
    this.getDetailString = this.getDetailString.bind(this);
    this.getSortString = this.getSortString.bind(this);
  }
  public render() {
    const { song, classes, makeNewQueueAndPlay, selected } = this.props;
    const { hovered } = this.state;
    const sortString = this.getSortString();
    const detailString = this.getDetailString();
    return (
      <ListItem
        className={classes.root}
        onMouseEnter={this.setHoverTrue}
        onMouseLeave={this.setHoverFalse}
        onDoubleClick={this.handleDouble}
        selected={selected}
      >
        {hovered && (
          <Slide direction="right" in={hovered} timeout={500}>
            <ListItemIcon
              children={
                <Button onClick={this.handleDouble}>
                  {song.youtube ? <Youtube /> : <Spotify />}
                  <Play />
                </Button>
              }
            />
          </Slide>
        )}

        <ListItemSecondaryAction
          children={
            <Hidden mdDown>
              <Fade in={hovered}>
                <div>
                  <Button onClick={this.handleRemove(song)}>
                    <Delete />
                  </Button>
                  <Button onClick={this.handleAdd(song)}>
                    <PlaylistAdd />
                  </Button>
                  <Button onClick={this.props.addToNext}>
                    <Next />
                  </Button>
                </div>
              </Fade>
            </Hidden>
          }
        />
        <ListItemText
          primary={song.track.name}
          primaryTypographyProps={{
            variant: "subtitle1",
            style: {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px"
            }
          }}
          secondary={this.state.hovered ? detailString : sortString}
          secondaryTypographyProps={{
            variant: "body2"
          }}
        />
      </ListItem>
    );
  }
  private toggleShow = () => {
    this.setState({
      showOptions: !this.state.showOptions
    });
  };
  private handleAdd = (song: any) => () => {
    this.props.addSongToQueue(song);
  };
  private handleRemove = (song: any) => () => {
    if (song.youtube) {
      this.props.removeYoutubeSong(song.track);
    } else {
      this.props.removeSpotifySong(song.track);
    }
  };
  private handleDouble() {
    this.props.makeNewQueueAndPlay(this.props.index);
  }

  private setHoverTrue = () => this.setState({ hovered: true });
  private setHoverFalse = () => this.setState({ hovered: false });

  private getDetailString() {
    const { song, sort } = this.props;
    const currentSort = sort.substring(0, this.props.sort.indexOf("-"));

    switch (currentSort) {
      case "artist":
        return (
          song.track.album &&
          song.track.album.name + " - " + song.track.artists &&
          song.track.artists[0].name
        );
      case "album":
        return (
          song.track.artists &&
          song.track.artists[0].name + " - " + song.track.album &&
          song.track.album.name
        );
      case "added":
        return (
          song.track.artists &&
          song.track.artists[0].name + " - " + song.track.album &&
          song.track.album.name +
            " - " +
            parse(song.added_at).toLocaleDateString()
        );
      default:
        return "";
    }
  }

  private getSortString() {
    const { song, sort } = this.props;
    const currentSort = sort.substring(0, this.props.sort.indexOf("-"));

    switch (currentSort) {
      case "artist":
        return song.track.artists && song.track.artists[0].name;
      case "album":
        return song.track.album && song.track.album.name;
      case "added":
        return parse(song.added_at).toLocaleDateString();
      default:
        return "";
    }
  }
}

const styles = {
  icon: {
    margin: 0
  },
  root: {
    height: 40
  }
};

export default withStyles(styles)(Song);
