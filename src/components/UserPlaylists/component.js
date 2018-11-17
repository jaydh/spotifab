import React, { Component } from 'react';
import './UserPlaylists.css';
import { NavLink } from 'react-router-dom';
import { isTokenTimeValid } from '../../helpers/validateToken';
import { ConnectedPlaylist } from './index';
import Button from '@material-ui/core/Button';
import Plus from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import More from '@material-ui/icons/MoreHoriz';
import Minus from '@material-ui/icons/Remove';

class UserPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPlaylist: true
    };
    this.toggleShowPlaylist = this.toggleShowPlaylist.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (!this.props.synced && isTokenTimeValid(this.props.tokenTime)) {
      this.props.fetchPlaylistsMenu();
      this.props.fetchUnifiedPlaylistMenu();
    }
  }

  render() {
    return (
      <div className="user-playlist-container">
        <div className="user-playlist-link">
          <h3 className="user-playlist-header">
            Playlists
            <Button onClick={this.toggleShowPlaylist}>
              {this.state.showPlaylist ? <Minus /> : <Plus />}
            </Button>
          </h3>
        </div>
        <div className="playlists">
          {this.state.showPlaylist &&
            this.props.playlistMenu &&
            this.props.unifiedMenu
              .concat(this.props.playlistMenu)
              .map(playlist => (
                <ConnectedPlaylist key={playlist.id} playlist={playlist} />
              ))}
        </div>
      </div>
    );
  }

  toggleShowPlaylist() {
    this.setState({ showPlaylist: !this.state.showPlaylist });
  }
}

export class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      unfollowCount: 0
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
  }
  toggleShow() {
    this.setState({ showMenu: !this.state.showMenu });
  }
  handleUnfollow = playlist => () => {
    if (this.state.unfollowCount > 2) {
      playlist.unified
        ? this.props.deleteUnifiedPlaylist(playlist.id)
        : this.props.unfollowPlaylist(playlist.id);
    }
    this.setState({ unfollowCount: this.state.unfollowCount + 1 });
  };

  render() {
    const { playlist } = this.props;
    return (
      <div className={'user-playlist-item'}>
        <NavLink
          to={`/playlist/${playlist.unified ? 'unified' : 'spotify'}/${
            playlist.owner.id
          }/${playlist.id}`}
          activeClassName="active-playlist"
          className="user-playlist-link"
        >
          {playlist.spotify && <i className="fab fa-spotify" />}
          {playlist.name}
        </NavLink>{' '}
        <div
          className="playlist-action-container"
          onMouseEnter={this.toggleShow}
          onMouseLeave={this.toggleShow}
        >
          {this.state.showMenu ? (
            <Button
              className="btn playlist-action"
              onClick={this.handleUnfollow(playlist)}
              style={{ color: this.state.unfollowCount > 0 ? 'red' : '' }}
            >
              {this.state.unfollowCount > 0 && this.state.unfollowCount < 3 ? (
                <i className="fa fa-warning" aria-hidden={true}>
                  {4 - this.state.unfollowCount}
                </i>
              ) : (
                ''
              )}
              <Delete />
            </Button>
          ) : (
            <React.Fragment>
              <Button className="btn playlist-action" onClick={this.toggleShow}>
                <More />
              </Button>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default UserPlaylists;
