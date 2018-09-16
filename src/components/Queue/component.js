import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Queue.css';
import SongControls from '../SongControls';
import { List, AutoSizer } from 'react-virtualized';
import QueueItem from '../QueueItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { initYoutube } from '../../helpers/initPlaybackAPIs';
import { slide as Menu } from 'react-burger-menu';

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

  componentDidMount() {
    if (!this.props.youtubeReady) {
      initYoutube();
    }
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
        styles={styles}
        width={`${
          window.matchMedia('(max-width: 400px)').matches
        }?'80vw':'30vw'`}
        pageWrapId={'page-wrap'}
        outerContainerId={'app-container'}
        id={'queue-container'}
        customBurgerIcon={
          <React.Fragment>
            <i style={{ color: '#BB0A21' }} className="fas fa-list-ol fa-lg" />
          </React.Fragment>
        }
      >
        <React.Fragment>
          <div className="queue-header">
            <div className="queue-left song-list-header">
              Queue{'    '}
              <span className="queue-buttons">
                <button className="btn" onClick={this.handleShuffle}>
                  <i className="fa fa-random" aria-hidden={true} />
                </button>
                <button
                  onClick={this.props.toggleRepeat}
                  className={'btn' + (this.props.repeat ? 'active' : '')}
                >
                  <i className="fa fa-redo" aria-hidden={true} />
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    this.props.clearSongQueue();
                  }}
                >
                  <i className="fa fa-trash" aria-hidden={true} />
                </button>
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
              </span>
            </div>
          </div>
        </React.Fragment>
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
        <SongControls />
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
    left: '95%',
    top: '36px'
  },
  bmBurgerBars: {
    background: '#BB0A21'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#BB0A21'
  },
  bmMenu: {
    background: '#BB0A21',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
    opacity: '0.80'
  },
  bmMorphShape: {
    fill: '#252627'
  },
  bmItemList: {
    color: '#252627'
  },
  bmItem: {
    display: 'inline-block',
    width: '100%'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
};
