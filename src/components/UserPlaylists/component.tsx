import React, { Component } from "react";
import { isTokenTimeValid } from "../../helpers/validateToken";
import { ConnectedPlaylist } from "./index";
import { Button, Collapse } from "@material-ui/core";
import Plus from "@material-ui/icons/Add";
import Delete from "@material-ui/icons/Delete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import More from "@material-ui/icons/MoreHoriz";
import Minus from "@material-ui/icons/Remove";
import Warning from "@material-ui/icons/Warning";

interface IProps {
  fetchPlaylistsMenu: () => void;
  fetchUnifiedPlaylistMenu: () => void;
  synced: boolean;
  tokenTime: boolean;
  history: any;
  location: any;
  playlistMenu: any;
  unifiedMenu: any;
  user: any;
  firebaseLoaded: boolean;
}

interface IState {
  showPlaylist: boolean;
  selectedId?: any[];
}

class UserPlaylists extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showPlaylist: true,
      selectedId: undefined
    };
  }

  componentDidMount() {
    this.props.fetchPlaylistsMenu();
    this.props.fetchUnifiedPlaylistMenu();
  }

  render() {
    const { showPlaylist } = this.state;
    const isPlaylist = this.props.location.pathname.startsWith("/playlist");
    return (
      <>
        <Button onClick={this.toggleShowPlaylist}>
          <Typography variant="subheading">Playlists</Typography>{" "}
          {this.state.showPlaylist ? <Minus /> : <Plus />}
        </Button>
        <Collapse in={showPlaylist}>
          <List>
            {this.props.playlistMenu &&
              this.props.unifiedMenu
                .concat(this.props.playlistMenu)
                .map((playlist: any) => (
                  <ConnectedPlaylist
                    key={playlist.id}
                    playlist={playlist}
                    selected={
                      isPlaylist ? this.state.selectedId === playlist.id : false
                    }
                    selectHandler={this.handleSelect(playlist)}
                  />
                ))}
          </List>
        </Collapse>
      </>
    );
  }

  handleSelect = (playlist: any) => (event: Event) => {
    this.setState({ selectedId: playlist.id });
    this.props.history.push(
      `/playlist/${playlist.unified ? "unified" : "spotify"}/${
        playlist.owner.id
      }/${playlist.id}`
    );
  };

  toggleShowPlaylist = () => {
    this.setState({ showPlaylist: !this.state.showPlaylist });
  };
}

interface IProps2 {
  playlist: any;
  selected: any;
  selectHandler: any;
  deleteUnifiedPlaylist: (id: string) => void;
  unfollowPlaylist: (id: string) => void;
}
interface IState2 {
  showMenu: boolean;
  unfollowCount: number;
}

export class Playlist extends React.Component<IProps2, IState2> {
  constructor(props: IProps2) {
    super(props);
    this.state = {
      showMenu: false,
      unfollowCount: 0
    };
  }

  render() {
    const { playlist, selected, selectHandler } = this.props;
    return (
      <ListItem button={true} selected={selected} onClick={selectHandler}>
        <ListItemText primary={playlist.name} />
        <div onMouseEnter={this.toggleShow} onMouseLeave={this.toggleShow}>
          {this.state.showMenu ? (
            <Button
              onClick={this.handleUnfollow(playlist)}
              style={{ color: this.state.unfollowCount > 0 ? "red" : "" }}
            >
              {this.state.unfollowCount > 0 && this.state.unfollowCount < 3 ? (
                <React.Fragment>
                  <Warning /> {4 - this.state.unfollowCount}
                </React.Fragment>
              ) : (
                ""
              )}
              <Delete />
            </Button>
          ) : (
            <React.Fragment>
              <Button onClick={this.toggleShow}>
                <More />
              </Button>
            </React.Fragment>
          )}
        </div>
      </ListItem>
    );
  }

  private toggleShow = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  private handleUnfollow = (playlist: any) => () => {
    if (this.state.unfollowCount > 2) {
      playlist.unified
        ? this.props.deleteUnifiedPlaylist(playlist.id)
        : this.props.unfollowPlaylist(playlist.id);
    }
    this.setState({ unfollowCount: this.state.unfollowCount + 1 });
  };
}

export default UserPlaylists;
