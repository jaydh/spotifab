import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MaterialList from "@material-ui/core/List";
import { withStyles } from "@material-ui/core/styles";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Delete from "@material-ui/icons/Delete";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";
import Repeat from "@material-ui/icons/Repeat";
import Shuffle from "@material-ui/icons/Shuffle";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import QueueItem from "../QueueItem";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const drawerWidth = 300;

interface IProps {
  position: number;
  songs: any;
  open: boolean;
  onQueueClose: () => void;
  repeatOn: boolean;
  toggleRepeat: () => void;
  clearSongQueue: () => void;
  shuffleQueue: () => void;
  addUnifiedPlaylist: (t: string) => void;
  removeSongFromQueue: (t: number) => void;
  insertSongInQueue: (t: any, index: number) => void;
  classes: any;
}

interface IState {
  showPlaylist: boolean;
  itemHeight: number;
  newPlaylistName: string;
}

class Queue extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showPlaylist: false,
      itemHeight: 30,
      newPlaylistName: ""
    };
    this.handleSumbit = this.handleSumbit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.togglePlaylistAdd = this.togglePlaylistAdd.bind(this);
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.position !== prevProps.position) {
      const current = document.getElementById(
        `queue-item-${this.props.position}`
      );
      if (current) {
        current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
    }
  }

  public render() {
    const {
      classes,
      songs,
      open,
      onQueueClose,
      repeatOn,
      toggleRepeat,
      clearSongQueue
    } = this.props;
    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={onQueueClose}>
            <ChevronRight />
          </IconButton>
          <ToggleButtonGroup>
            <ToggleButton value="shuffle" onClick={this.handleShuffle}>
              <Shuffle />
            </ToggleButton>
            <ToggleButton
              value="repeate"
              selected={repeatOn}
              onClick={toggleRepeat}
            >
              <Repeat />
            </ToggleButton>
            <ToggleButton value="delete" onClick={clearSongQueue}>
              <Delete />
            </ToggleButton>
            {this.state.showPlaylist ? (
              <form onSubmit={this.handleSumbit}>
                <input
                  onChange={this.handleChange}
                  placeholder="Playlist name"
                />
              </form>
            ) : (
              <ToggleButton
                value="newPlaylist"
                onClick={this.togglePlaylistAdd}
              >
                <PlaylistAdd />
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        </div>
        <Divider />

        <Divider />
        <DragDropContext onDragEnd={this.handleDragStop}>
          <Droppable droppableId={"queue-droppbale"}>
            {(provided: any, snapshot: any) => (
              <div
                className="queue"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <MaterialList>
                  {songs.map((song: any, index: number) =>
                    this.rowRenderer(song, index, "queue-song" + index)
                  )}
                </MaterialList>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Drawer>
    );
  }
  private rowRenderer(song: any, index: number, key: any) {
    return (
      <Draggable draggableId={`draggable-${index}`} index={index} key={key}>
        {(provid: any, snaps: any) => (
          <div
            ref={provid.innerRef}
            {...provid.draggableProps}
            {...provid.dragHandleProps}
          >
            <QueueItem song={song} index={index} />
          </div>
        )}
      </Draggable>
    );
  }

  private handleSumbit(e: any) {
    e.preventDefault();
    this.props.addUnifiedPlaylist(this.state.newPlaylistName);
  }
  private handleChange(e: any) {
    e.preventDefault();
    this.setState({ newPlaylistName: e.target.value });
  }

  private handleShuffle() {
    this.props.shuffleQueue();
  }

  private handleDragStop(result: any) {
    if (!result.destination) {
      return;
    }
    const song = this.props.songs.get(result.source.index);
    this.props.removeSongFromQueue(result.source.index);
    this.props.insertSongInQueue(song, result.destination.index);
  }
  private togglePlaylistAdd() {
    this.setState({ showPlaylist: !this.state.showPlaylist });
  }
}
const styles = (theme: any) => ({
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

export default withStyles(styles)(Queue);
