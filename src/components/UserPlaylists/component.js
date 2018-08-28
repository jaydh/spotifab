import React, { Component } from 'react';
import './UserPlaylists.css';
import { NavLink } from 'react-router-dom';
import { isTokenTimeValid } from '../../helpers/validateToken';

class UserPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      unfollowCount: 0,
      showPlaylist: false
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
    this.toggleShowPlaylist = this.toggleShowPlaylist.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.synced && isTokenTimeValid(nextProps.tokenTime)) {
      this.props.fetchPlaylistsMenu();
    }
  }

  render() {
    return (
      <div className="user-playlist-container">
        <div className="user-playlist-link" onClick={this.toggleShowPlaylist}>
          <h3 className="user-playlist-header">
            Playlists{' '}
            <i
              className={`fa ${
                this.state.showPlaylist ? 'fa-minus' : 'fa-plus'
              }`}
            />
          </h3>
        </div>
        {this.state.showPlaylist &&
          this.props.playlistMenu &&
          this.renderPlaylists()}
      </div>
    );
  }

  toggleShowPlaylist() {
    this.setState({ showPlaylist: !this.state.showPlaylist });
  }
  renderPlaylists() {
    return this.props.playlistMenu.map(playlist => {
      return (
        <div className={'user-playlist-item'} key={playlist.id}>
          <NavLink
            to={`/playlist/spotify/${playlist.owner.id}/${playlist.id}`}
            activeClassName="active side-menu-item"
            className="user-playlist-link"
          >
            {playlist.name}
          </NavLink>{' '}
          <div className="playlist-action-container">
            {this.state.showMenu && (
              <button
                className="btn playlist-action"
                onClick={this.handleUnfollow(playlist.id)}
                style={{ color: this.state.unfollowCount > 0 ? 'red' : '' }}
              >
                {this.state.unfollowCount > 0 &&
                this.state.unfollowCount < 3 ? (
                  <i className="fa fa-warning" aria-hidden={true}>
                    {4 - this.state.unfollowCount}
                  </i>
                ) : (
                  ''
                )}
                <i className="fa fa-trash" aria-hidden={true} />
              </button>
            )}
            <button
              className="btn playlist-action"
              onMouseEnter={this.hideMenu}
              onClick={this.toggleShow}
            >
              <i className="fa fa-ellipsis-v" />
            </button>
          </div>
        </div>
      );
    });
  }

  toggleShow() {
    this.setState({ showMenu: !this.state.showMenu });
  }
  hideMenu() {
    this.setState({ showMenu: true });
  }
  handleUnfollow = id => () => {
    if (this.state.unfollowCount > 2) {
      this.props.unfollowPlaylist(id);
      this.setState({ unfollowCount: 0 });
    }
    this.setState({ unfollowCount: this.state.unfollowCount + 1 });
  };
}

export default UserPlaylists;
