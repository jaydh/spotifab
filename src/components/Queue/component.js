import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Queue.css';
import { List, AutoSizer } from 'react-virtualized';
import QueueItem from '../QueueItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { stack as Menu } from 'react-burger-menu';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import MaterialList from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/Delete';
import Repeat from '@material-ui/icons/Repeat';
import Shuffle from '@material-ui/icons/Shuffle';

export default class SongList extends Component {
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
    if (
      !this.props.songs.isEmpty() &&
      !prevProps.songs.isEmpty() &&
      this.props.songs.get(0).track.id !== prevProps.songs.get(0).track.id
    ) {
      this.refs.forceUpdateGrid();
    }
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

  render() {
    return (
      <Menu
        right={true}
        width={`${
          window.matchMedia('(max-width: 700px)').matches ? '99vw' : '15vw'
        }`}
        styles={styles}
        pageWrapId={'page-wrap'}
        outerContainerId={'app-container'}
        noOverlay={true}
        customBurgerIcon={
          <React.Fragment>
            <i style={{ color: '#BB0A21' }} className="fas fa-list-ol fa-lg" />
          </React.Fragment>
        }
      >
        <MaterialList>
          <div className="queue-header">
            <Typography>Queue</Typography>
            <Button variant="fab" onClick={this.handleShuffle} mini={true}>
              <Shuffle />
            </Button>
            <Button variant="fab" onClick={this.props.toggleRepeat} mini={true}>
              <Repeat />{' '}
            </Button>
            <Button
              variant="fab"
              onClick={() => {
                this.props.clearSongQueue();
              }}
              mini={true}
            >
              <Delete />
            </Button>
            {this.state.showPlaylist ? (
              <form onSubmit={this.handleSumbit}>
                <input
                  onChange={this.handleChange}
                  placeholder="Playlist name"
                />
              </form>
            ) : (
              <button
                className="btn"
                onClick={() => this.setState({ showPlaylist: true })}
              >
                <i className="fa fa-external-link-alt" aria-hidden={true} />
              </button>
            )}{' '}
          </div>
          <Divider />
          <DragDropContext onDragEnd={this.handleDragStop}>
            <Droppable droppableId={'queue-droppbale'}>
              {(provided, snapshot) => (
                <div
                  className="queue"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <AutoSizer>
                    {({ height, width }) => (
                      <List
                        ref={ref => (this.refs = ref)}
                        rowCount={this.props.songs.size}
                        rowRenderer={this.rowRenderer}
                        rowHeight={this.state.itemHeight}
                        width={width}
                        height={height}
                      />
                    )}
                  </AutoSizer>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </MaterialList>
      </Menu>
    );
  }
  rowRenderer(options) {
    const { index, key, style } = options;
    const song = this.props.songs.get(index);
    return (
      <div key={key} style={style}>
        <Draggable draggableId={`draggable-${index}`} index={index}>
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
      </div>
    );
  }
  handleDragStop(result) {
    if (!result.destination) {
      return;
    }
    const song = this.props.songs.get(result.source.index);
    this.props.removeSongFromQueue(result.source.index);
    this.props.insertSongInQueue(song, result.destination.index);
  }
}

const styles = {
  bmBurgerButton: {
    position: 'fixed',
    left: '97%',
    top: '45px'
  },
  bmBurgerBars: {
    background: '#BB0A21'
  },
  bmCrossButton: {
    height: '16px',
    width: '16px'
  },
  bmCross: {
    background: 'white'
  },
  bmMenu: {
    background: '#202020',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
    opacity: '0.90'
  },
  bmMorphShape: {
    fill: '#252627'
  },
  bmItemList: {
    color: '#252627'
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
};
