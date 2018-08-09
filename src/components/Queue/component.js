import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Queue.css';
import SongControls from '../SongControls';
import { List, AutoSizer } from 'react-virtualized';
import VolumeControls from '../VolumeControls';
import Draggable from 'react-draggable';

export default class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPlaylist: false,
      itemHeight: 30,
      newPlaylistName: ''
    };
    this.rowRenderer = this.rowRenderer.bind(this);
    this.handleSumbit = this.handleSumbit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.position !== nextProps.position) {
      const current = document.getElementById(
        `queue-item-${nextProps.position}`
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
  handleSumbit(e) {
    e.preventDefault();
    this.props.createNewPlaylist(this.state.newPlaylistName, 'newss');
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
      <div id="queue-container">
        <div className="queue-header">
          <div className="queue-buttons">
            Queue{' '}
            <button className="btn" onClick={this.handleShuffle}>
              <i className="fa fa-random" aria-hidden={true} />
            </button>
            <button
              onClick={this.props.toggleRepeat}
              className={'btn' + (this.props.repeat ? 'active' : '')}
            >
              <i className="fa fa-repeat" aria-hidden={true} />
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
                <i className="fa fa-external-link" aria-hidden={true} />
              </button>
            )}{' '}
          </div>
          <VolumeControls />
        </div>
        <div className="queue song-list">
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={ref => (this.refs = ref)}
                id="queue"
                rowCount={this.props.songs.size}
                rowRenderer={this.rowRenderer}
                rowHeight={this.state.itemHeight}
                width={width}
                height={height}
              />
            )}
          </AutoSizer>
        </div>
        <SongControls />
      </div>
    );
  }
  rowRenderer(options) {
    const { index, key, style } = options;
    const song = this.props.songs.get(index);
    return (
      <Draggable
        axis="y"
        grid={[this.state.itemHeight, this.state.itemHeight]}
        onDrag={this.handleDrag(song, index)}
        key={key}
      >
        <div
          id={`queue-item-${index}`}
          className={
            index === this.props.position
              ? 'user-song-item active'
              : 'user-song-item'
          }
          style={style}
        >
          <button
            className="play-song btn"
            onClick={() => this.props.updatePosition(index)}
          >
            <i className="fa fa-play-circle-o play-btn" aria-hidden="true" />
          </button>
          <div className="song-title">
            <p>
              {song.youtube && <i className="fa fa-youtube-play" />}
              {song.track.name}
            </p>
          </div>
          <div className="song-buttons">
            <button
              className="btn"
              onClick={() => this.props.removeSongFromQueue(index)}
            >
              <i className="fa fa-trash" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Draggable>
    );
  }
  handleDrag = (song, index) => (e, data) => {
    console.log(e, data);
    console.log(song, index);
    let newPosition = Math.round(data.lastY / this.state.itemHeight);
    newPosition = newPosition < 0 ? 0 : newPosition;
    newPosition =
      newPosition >= this.props.songs.size
        ? this.props.songs.size
        : newPosition;
    //if new pos negative then put to front
    //if new pos bigger than size put to end
    if (index !== newPosition) {
      this.props.removeSongFromQueue(index);
      this.props.insertSongInQueue(song, newPosition);
      this.refs.forceUpdate();
      this.refs.recomputeRowHeights();
      this.refs.forceUpdateGrid();
      this.refs.scrollToRow(index);
    }
  };
}
