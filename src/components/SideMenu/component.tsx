import * as React from 'react';
import { push as Menu } from 'react-burger-menu';
import { NavLink } from 'react-router-dom';
import { auth } from '../../index';
import AddYoutube from '../AddYoutube';
import UserDetails from '../UserDetails';
import UserPlaylists from '../UserPlaylists';

export default class SideMenu extends React.Component {
  public render() {
    return (
      <Menu
        width={'30%'}
        pageWrapId={'page-wrap'}
        outerContainerId={'app-container'}
      >
        <div className="left-side-section">
          <UserDetails />
          <AddYoutube />
          <NavLink
            to="/library"
            activeClassName={'active side-menu-item'}
            className="user-playlist-link"
          >
            Library
          </NavLink>
          <NavLink
            to="/recent"
            activeClassName={'active side-menu-item'}
            className="user-playlist-link"
          >
            Recently Played
          </NavLink>
          <NavLink
            to="/new"
            activeClassName={'active side-menu-item'}
            className="user-playlist-link"
          >
            New Albums
          </NavLink>
          <UserPlaylists />
          <br />
          <NavLink
            activeClassName={'active side-menu-item'}
            className="user-playlist-link"
            to="/Downloads"
          >
            Downloads
          </NavLink>
          <br />
          <NavLink
            activeClassName={'active side-menu-item'}
            className="user-playlist-link"
            to="/authenticate"
            onClick={this.signOut}
          >
            Logout
          </NavLink>
        </div>
      </Menu>
    );
  }
  private signOut() {
    auth.signOut();
  }
}
