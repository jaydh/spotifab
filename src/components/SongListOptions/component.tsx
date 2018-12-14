import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Clear from '@material-ui/icons/DeleteSweep';
import MenuIcon from '@material-ui/icons/Menu';
import Add from '@material-ui/icons/PlaylistAdd';
import AddCheck from '@material-ui/icons/PlaylistAddCheck';
import QueueIcon from '@material-ui/icons/QueueMusic';
import * as React from 'react';
import asyncComponent from '../AsyncComponent';
import Filter from '../Filter';
import Sort from '../Sort';
import './SongListOptions.css';

const Queue = asyncComponent(() => import('../Queue'));
const SideMenu = asyncComponent(() => import('../SideMenu'));

interface IProps {
  pending: boolean;
  isLibrary: boolean;
  playlistId: string;
  isUnified: boolean;
  update: () => void;
  convertPlaylistToUnified: (name: string) => void;
  selectionMade: boolean;
  addSelected: () => void;
  makeQueue: () => void;
  clearSelection: () => void;
  classes: any;
}

interface IState {
  sideMenuOpen: boolean;
  queueOpen: boolean;
}

const drawerWidth = 600;

class SongListOptions extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = { sideMenuOpen: false, queueOpen: false };
    this.handleSideOpen = this.handleSideOpen.bind(this);
    this.handleSideClose = this.handleSideClose.bind(this);
    this.handleQueueOpen = this.handleQueueOpen.bind(this);
    this.handleQueueClose = this.handleQueueClose.bind(this);
    this.convert = this.convert.bind(this);
  }
  public render() {
    const { classes } = this.props;
    return (
      <div className="song-list-options-container">
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleSideOpen}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <div className="song-list-options">
              <Grid container={true} spacing={24} alignItems="center">
                {this.props.selectionMade && (
                  <>
                    <Grid item={true}>
                      <Button onClick={this.props.clearSelection}>
                        <Clear />
                      </Button>
                      <Button onClick={this.props.addSelected}>
                        <Add />
                      </Button>
                      <Button onClick={this.props.makeQueue}>
                        <AddCheck />
                      </Button>
                    </Grid>
                  </>
                )}

                <Grid item={true}>
                  <Filter />
                </Grid>
                <Grid item={true}>
                  <Sort update={this.props.update} />
                </Grid>
              </Grid>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleQueueOpen}
                className={classes.menuButton}
              >
                <QueueIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {!this.props.isLibrary && !this.props.isUnified && (
          <button className="btn" onClick={this.convert(this.props.playlistId)}>
            Convert to unified
          </button>
        )}
        <SideMenu
          open={this.state.sideMenuOpen}
          handleClose={this.handleSideClose}
        />
        <Queue
          open={this.state.queueOpen}
          handleClose={this.handleQueueClose}
        />
      </div>
    );
  }
  private convert = name => () => {
    this.props.convertPlaylistToUnified(name);
  };

  private handleSideOpen() {
    this.setState({ sideMenuOpen: true, queueOpen: false });
  }
  private handleSideClose() {
    this.setState({ sideMenuOpen: false });
  }
  private handleQueueOpen() {
    this.setState({ queueOpen: true, sideMenuOpen: false });
  }
  private handleQueueClose() {
    this.setState({ queueOpen: false });
  }
}

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});

export default withStyles(styles)(SongListOptions);
