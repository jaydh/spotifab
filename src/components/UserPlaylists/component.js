import React, { Component } from 'react';
import './UserPlaylists.css';
import { NavLink } from 'react-router-dom';

class UserPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
  }
  componentDidMount() {
    if (this.props.user) {
      this.props.fetchPlaylistsMenu();
    }
  }

  render() {
    return (
      <div className="user-playlist-container">
        <h3 className="user-playlist-header">Playlists</h3>
        {this.props.playlistMenu && this.renderPlaylists()}
      </div>
    );
  }

  renderPlaylists() {
    return this.props.playlistMenu.map(playlist => {
      const getPlaylistSongs = () => {
        this.props.fetchPlaylistSongs(playlist.owner.id, playlist.id);
      };
      return (
        <div className={'user-playlist-item'} key={playlist.id}>
          <NavLink
            to={`/playlist/${playlist.name}`}
            onClick={getPlaylistSongs}
            activeClassName="active side-menu-item"
            className="user-playlist-link"
          >
            {playlist.name}
          </NavLink>{' '}
          <div className="playlist-action-container" onMouseOut={this.hideMenu}>
            {this.state.showMenu ? (
              <button
                className="btn playlist-action"
                onClick={() => this.props.unfollowPlaylist(playlist.id)}
              >
                <i className="fa fa-minus" aria-hidden={true} />
              </button>
            ) : (
              <button className="btn playlist-action" onClick={this.toggleShow}>
                <i className="fa fa-ellipsis-v" />
              </button>
            )}
          </div>
        </div>
      );
    });
  }

  toggleShow() {
    this.setState({ showMenu: !this.state.showMenu });
  }
  hideMenu() {
    this.setState({ showMenu: false });
  }
}

export default UserPlaylists;
