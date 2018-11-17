import * as React from 'react';
import { reveal as Menu } from 'react-burger-menu';
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
        styles={styles}
        width={`${
          window.matchMedia('(max-width: 700px)').matches ? '99vw' : '35vw'
        }`}
        pageWrapId={'page-wrap'}
        outerContainerId={'app-container'}
      >
        <div className="menu-header">
          <UserDetails />
          <AddYoutube />
          <NavLink
            to="/services"
            activeClassName={'active side-menu-item'}
            className="user-playlist-link"
          >
            Connected Services
          </NavLink>
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
const styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '16px',
    height: '10px',
    left: '16px',
    top: '45px'
  },
  bmBurgerBars: {
    background: '#4b88a2'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
};
