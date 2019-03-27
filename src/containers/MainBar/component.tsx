import {
  AppBar,
  Button,
  Collapse,
  Fade,
  Grid,
  Hidden,
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
import AddSongs from "../../components/AddSongs";
import Authenticate from "../../components/Authenticate";
import CurrentArt from "../../components/CurrentArt";
import Filter from "../../components/Filter";
import SongControls from "../../components/SongControls";
import Sort from "../../components/Sort";
import Volume from "../../components/VolumeControls";
import Nav from "../../components/Nav";

const HiddenLoad = () => <></>;
const Queue = Loadable({
  loader: () => import("../../components/Queue"),
  loading: HiddenLoad
});
const SideMenu = Loadable({
  loader: () => import("../SideMenu"),
  loading: HiddenLoad
});
const SongProgress = Loadable({
  loader: () => import("../../components/SongProgress"),
  loading: HiddenLoad
});

interface IProps {
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
  updateVolume: (val: number) => void;
}

interface IState {
  sideRender: boolean;
  queueRender: boolean;
  matches: boolean;
}

const drawerWidth = 600;

class MainBar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      sideRender: false,
      queueRender: false,
      matches: window.innerWidth <= 768
    };
  }

  public componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    if (this.state.matches) {
      this.props.updateVolume(750);
    }
    this.handleQueueMouseOver();
    this.handleSideMouseOver();
  }
  public componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
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
    const { sideRender, queueRender, matches } = this.state;
    return (
      <>
        <AppBar position="relative" className={classes.appBar}>
          <Toolbar disableGutters={!open}>
            <Grid container={true} spacing={40} justify="space-between">
              <Grid
                item={true}
                xs={4}
                sm={4}
                md={4}
                lg={4}
                container
                alignContent="center"
                alignItems="center"
              >
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleSideOpen}
                    className={classes.menuButton}
                    children={<MenuIcon />}
                  />
                </Grid>
                <Grid item>
                  <Nav />
                </Grid>
                <Grid item>{!matches && <AddSongs />}</Grid>
                <Grid item>
                  <Authenticate />
                </Grid>
              </Grid>
              {currentTrack !== undefined && (
                <Fade in={currentTrack !== undefined}>
                  <Grid
                    xs={12}
                    sm={12}
                    md={4}
                    lg={4}
                    item={true}
                    container={true}
                    alignItems="center"
                    justify="center"
                    style={{ order: matches ? 2 : 0 }}
                  >
                    <SongControls />
                    <SongProgress />
                  </Grid>
                </Fade>
              )}
              <Grid
                item={true}
                container={true}
                justify={matches ? "center" : "flex-end"}
                alignItems="center"
                xs={8}
                sm={8}
                md={4}
                lg={4}
              >
                <Hidden mdDown>
                  {selection !== undefined && (
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
                  )}
                </Hidden>
                <Grid item={true} children={<Filter />} />
                <Grid item={true} children={<Sort />} />
                <Hidden mdDown>
                  <Grid item={true} children={<Volume />} />
                </Hidden>
                <Grid
                  item={true}
                  children={
                    <IconButton
                      color="inherit"
                      aria-label="Open drawer"
                      onClick={this.handleQueueOpen}
                      className={classes.menuButton}
                      children={<QueueIcon />}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Toolbar>
          {currentTrack && (
            <Collapse in={currentTrack !== undefined}>
              <CurrentArt />
            </Collapse>
          )}
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

  private handleQueueMouseOver = () => {
    this.setState({ queueRender: true });
    Queue.preload();
  };

  private handleSideMouseOver = () => {
    this.setState({ sideRender: true });
    SideMenu.preload();
  };

  private handleSideOpen = () => {
    this.props.onSideOpen();
  };
  private handleQueueOpen = () => {
    this.props.onQueueOpen();
  };
  private handleResize = () => {
    const x = window.matchMedia("(max-width: 992px)");
    this.setState({ matches: x.matches });
  };
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
