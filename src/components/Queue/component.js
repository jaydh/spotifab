import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Queue.css';
import SongControls from '../SongControls';
import { List, AutoSizer } from 'react-virtualized';
import VolumeControls from '../VolumeControls';

export default class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showYT: false,
      showPlaylist: false,
      itemHeight: 30,
      newPlaylistName: ''
    };
    this.rowRenderer = this.rowRenderer.bind(this);
    this.handleSumbit = this.handleSumbit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  render() {
    return (
      <div id="queue-container">
        <div className="queue-header">
          <div className="queue-buttons">
            Queue{' '}
            <button className="btn" onClick={this.props.shuffleQueue}>
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
                this.props.togglePlay();
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
                id="queue"
                rowCount={this.props.songs.size}
                rowRenderer={this.rowRenderer}
                rowHeight={this.state.itemHeight}
                width={width}
                height={height}
                //    scrollToIndex={this.props.position}
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
      <div
        id={`queue-item-${index}`}
        className={
          index === this.props.position
            ? 'user-song-item active'
            : 'user-song-item'
        }
        key={key}
        style={style}
      >
        <div className="song-buttons">
          <button
            className="btn"
            onClick={() => this.props.updatePosition(index)}
          >
            <i className="fa fa-play-circle-o play-btn" aria-hidden="true" />
          </button>
        </div>
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
    );
  }
}
