import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MaterialList from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import Playlist from '@material-ui/icons/PlaylistPlay';
import ChevronRight from '@material-ui/icons/ChevronRight';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import Repeat from '@material-ui/icons/Repeat';
import Shuffle from '@material-ui/icons/Shuffle';
import React, { Component } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import QueueItem from '../QueueItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Queue.css';

const drawerWidth = 300;
class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPlaylist: false,
      itemHeight: 30,
      newPlaylistName: ''
    };
    this.handleSumbit = this.handleSumbit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.togglePlaylistAdd = this.togglePlaylistAdd.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.position !== prevProps.position) {
      const current = document.getElementById(
        `queue-item-${this.props.position}`
      );
      if (current) {
        current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }

  render() {
    const { classes, songs, open, handleClose } = this.props;
    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleClose}>
            <ChevronRight />
          </IconButton>
          <Button onClick={this.handleShuffle} mini={true}>
            <Shuffle />
          </Button>
          <Button onClick={this.props.toggleRepeat} mini={true}>
            <Repeat />{' '}
          </Button>
          <Button onClick={this.props.clearSongQueue} mini={true}>
            <Delete />
          </Button>
          {this.state.showPlaylist ? (
            <form onSubmit={this.handleSumbit}>
              <input onChange={this.handleChange} placeholder="Playlist name" />
            </form>
          ) : (
            <Button onClick={this.togglePlaylistAdd}>
              <PlaylistAdd />
            </Button>
          )}{' '}
        </div>
        <Divider />

        <Divider />
        <DragDropContext onDragEnd={this.handleDragStop}>
          <Droppable droppableId={'queue-droppbale'}>
            {(provided, snapshot) => (
              <div
                className="queue"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <MaterialList>
                  {songs.map((song, index) =>
                    this.rowRenderer(song, index, 'queue-song' + index)
                  )}
                </MaterialList>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Drawer>
    );
  }
  rowRenderer(song, index, key) {
    return (
      <Draggable draggableId={`draggable-${index}`} index={index} key={key}>
        {(provid, snaps) => (
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

  handleSumbit(e) {
    e.preventDefault();
    this.props.addUnifiedPlaylist(this.state.newPlaylistName);
  }
  handleChange(e) {
    e.preventDefault();
    this.setState({ newPlaylistName: e.target.value });
  }

  handleShuffle() {
    this.props.shuffleQueue();
    this.refs.forceUpdateGrid();
  }

  handleDragStop(result) {
    if (!result.destination) {
      return;
    }
    const song = this.props.songs.get(result.source.index);
    this.props.removeSongFromQueue(result.source.index);
    this.props.insertSongInQueue(song, result.destination.index);
  }
  togglePlaylistAdd() {
    this.setState({ showPlaylist: !this.state.showPlaylist });
  }
}
const styles = theme => ({
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

export default withStyles(styles)(Queue);
