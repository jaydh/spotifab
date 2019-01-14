import {
  Button,
  Divider,
  Drawer,
  IconButton,
  Tab,
  Tabs,
  withStyles
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import * as React from 'react';
import { auth } from '../../firebase';
import AddYoutube from '../AddYoutube';
import UserDetails from '../UserDetails';
import UserPlaylists from '../UserPlaylists';

interface IProps {
  classes: any;
  open: boolean;
  handleClose: () => void;
  location: any;
  history: any;
}

interface IState {
  open: boolean;
  tabValue: string;
}

class SideMenu extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      open: false,
      tabValue: props.location.pathname.substring(1)
    };
    this.handleHistoryPush = this.handleHistoryPush.bind(this);
  }
  public render() {
    const { classes, open, handleClose, location } = this.props;
    const { tabValue } = this.state;
    const path = location.pathname.substring(1);
    const useTab =
      path === 'library' || path === 'new' || path === 'recent' ? true : false;
    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <UserDetails />
          <IconButton onClick={handleClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <AddYoutube />

        <Tabs
          value={useTab ? tabValue : false}
          indicatorColor="primary"
          textColor="primary"
          fullWidth={true}
        >
          <Tab
            value="library"
            label="Library"
            onClick={this.handleHistoryPush('/library')}
          />
          <Tab
            value="recent"
            label="Recently Played"
            onClick={this.handleHistoryPush('/recent')}
          />
          <Tab
            value="new"
            label="New Ablums"
            onClick={this.handleHistoryPush('/new')}
          />
        </Tabs>

        <Divider />
        <UserPlaylists />
        <Divider />
        <Button onClick={this.signOut}>Logout</Button>
      </Drawer>
    );
  }

  private signOut() {
    auth.signOut();
  }

  private handleHistoryPush = (value: string) => () => {
    this.props.history.push(value);
    this.setState({ tabValue: value.substring(1) });
  };
}

const drawerWidth = 500;

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

export default withStyles(styles)(SideMenu);
