import React, { Component } from 'react';
import './UserPlaylists.css';
import { NavLink } from 'react-router-dom';

class UserPlaylists extends Component {
  componentDidMount() {
    this.props.fetchPlaylistsMenu();
  }
  renderPlaylists() {
    return this.props.playlistMenu.map(playlist => {
      const getPlaylistSongs = () => {
        this.props.fetchPlaylistSongs(playlist.owner.id, playlist.id);
      };
      return (
        <div key={playlist.id}>
          <NavLink
            to={`/playlist/${playlist.name}`}
            onClick={getPlaylistSongs}
            activeClassName="active side-menu-item"
            className={'side-menu-item'}
          >
            {playlist.name}
            <br />
          </NavLink>
          <button onClick={() => this.props.unfollowPlaylist(playlist.id)}>
            <i className="fa fa-minus" aria-hidden={true} />
          </button>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="user-playlist-container">
        <h3 className="user-playlist-header">Playlists</h3>
        {this.props.playlistMenu && this.renderPlaylists()}
      </div>
    );
  }
}

export default UserPlaylists;
