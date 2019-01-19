import {
  AppBar,
  Button,
  Collapse,
  Fade,
  Grid,
  IconButton,
  Toolbar,
  withStyles
} from "@material-ui/core";
import {
  DeleteSweep as Clear,
  Menu as MenuIcon,
  PlaylistAdd as Add,
  PlaylistAddCheck as AddCheck,
  QueueMusic as QueueIcon
} from "@material-ui/icons";
import * as React from "react";
import Loadable from "react-loadable";

const HiddenLoad = () => <></>;
const Queue = Loadable({
  loader: () => import("../Queue"),
  loading: HiddenLoad
});
const SideMenu = Loadable({
  loader: () => import("../SideMenu"),
  loading: HiddenLoad
});
const SongProgress = Loadable({
  loader: () => import("../SongProgress"),
  loading: HiddenLoad
});

import Authenticate from "../Authenticate";
import CurrentArt from "../CurrentArt";
import Filter from "../Filter";
import SongControls from "../SongControls";
import Sort from "../Sort";
import Volume from "../VolumeControls";

interface IProps {
  pending: boolean;
  isLibrary: boolean;
  playlistId: string;
  isUnified: boolean;
  update: () => void;
  convertPlaylistToUnified: (name: string) => void;
  selectionMade: boolean;
  addSelected: () => void;
  makeQueueFromSelection: () => void;
  clearSelection: () => void;
  classes: any;
  currentTrack: any;
  selection: boolean;
  onSideOpen: () => void;
  onQueueOpen: () => void;
}

interface IState {
  sideRender: boolean;
  queueRender: boolean;
}

const drawerWidth = 600;

class MainBar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      sideRender: false,
      queueRender: false
    };
    this.handleSideOpen = this.handleSideOpen.bind(this);
    this.handleQueueOpen = this.handleQueueOpen.bind(this);
    this.handleQueueMouseOver = this.handleQueueMouseOver.bind(this);
    this.handleSideMouseOver = this.handleSideMouseOver.bind(this);
    this.convert = this.convert.bind(this);
  }
  public render() {
    const {
      classes,
      currentTrack,
      playlistId,
      isLibrary,
      isUnified,
      selection,
      makeQueueFromSelection,
      addSelected,
      clearSelection
    } = this.props;
    const { sideRender, queueRender } = this.state;
    return (
      <>
        <AppBar position="relative" className={classes.appBar}>
          <Toolbar disableGutters={!open}>
            <Grid
              container={true}
              spacing={40}
              alignItems="center"
              justify="space-between"
            >
              <Grid item={true} container={true} xs={4} sm={4} md={4} lg={4}>
                <Grid item={true}>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleSideOpen}
                    onMouseOver={this.handleSideMouseOver}
                    className={classes.menuButton}
                    children={<MenuIcon />}
                  />
                </Grid>
                <Authenticate />
              </Grid>
              <Fade in={currentTrack !== undefined}>
                <Grid
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  item={true}
                  container={true}
                  alignItems="center"
                  justify="center"
                >
                  <SongControls />
                  <SongProgress />
                </Grid>
              </Fade>
              <Grid
                item={true}
                container={true}
                justify="flex-end"
                alignItems="center"
                xs={4}
                sm={4}
                md={4}
                lg={4}
              >
                <Fade in={selection !== undefined}>
                  <Grid item={true}>
                    <Button onClick={clearSelection}>
                      <Clear />
                    </Button>
                    <Button onClick={addSelected}>
                      <Add />
                    </Button>
                    <Button onClick={makeQueueFromSelection}>
                      <AddCheck />
                    </Button>
                  </Grid>
                </Fade>
                <Grid item={true} children={<Filter />} />
                <Grid item={true} children={<Sort />} />
                <Grid item={true} children={<Volume />} />
                <Grid
                  item={true}
                  children={
                    <IconButton
                      color="inherit"
                      aria-label="Open drawer"
                      onClick={this.handleQueueOpen}
                      onMouseOver={this.handleQueueMouseOver}
                      className={classes.menuButton}
                      children={<QueueIcon />}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Toolbar>
          <Collapse in={currentTrack !== undefined}>
            <CurrentArt />
          </Collapse>
        </AppBar>
        {playlistId && !isLibrary && !isUnified && (
          <button className="btn" onClick={this.convert(this.props.playlistId)}>
            Convert to unified
          </button>
        )}
        {sideRender && <SideMenu />}
        {queueRender && <Queue />}
      </>
    );
  }
  private convert = (name: string) => () => {
    this.props.convertPlaylistToUnified(name);
  };

  private handleQueueMouseOver() {
    this.setState({ queueRender: true });
    Queue.preload();
  }

  private handleSideMouseOver() {
    this.setState({ sideRender: true });
    SideMenu.preload();
  }

  private handleSideOpen() {
    this.props.onSideOpen();
  }
  private handleQueueOpen() {
    this.props.onQueueOpen();
  }
}

const styles = (theme: any) => ({
  root: {
    display: "flex"
  },
  appBar: {
    backgroundColor: "#82b1ff",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});

export default withStyles(styles)(MainBar);
