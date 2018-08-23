import * as React from 'react';
import { push as Menu } from 'react-burger-menu';
import { NavLink } from 'react-router-dom';
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
          <UserPlaylists />
          <NavLink to="/authenticate">Authenticate</NavLink>
          <br />
          <NavLink to="/Downloads">Downloads</NavLink>
        </div>
      </Menu>
    );
  }
}
