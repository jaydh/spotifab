import * as React from 'react';
import { push as Menu } from 'react-burger-menu';
import { NavLink } from 'react-router-dom';
import { auth } from '../../index';
import AddYoutube from '../AddYoutube';
import UserDetails from '../UserDetails';
import UserPlaylists from '../UserPlaylists';
import './SideMenu.css';
export default class SideMenu extends React.Component {
  public render() {
    return (
      <Menu
        width={`${
          window.matchMedia('(min-width: 400px)').matches
        }?'15vw':'80vw'`}
        pageWrapId={'page-wrap'}
        outerContainerId={'app-container'}
        className="side-menu-container"
      >
        <div className="menu-header">
          <UserDetails />
          <AddYoutube />
        </div>
        <div className="menu-middle">
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
          <br />
          <UserPlaylists />
        </div>
        <div className="bottom">
          <NavLink
            activeClassName={'active side-menu-item'}
            className="user-playlist-link"
            to="/Downloads"
          >
            Downloads
          </NavLink>
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
