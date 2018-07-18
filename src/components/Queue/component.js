import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongList.css';
import SongControls from '../SongControls';
import { List, AutoSizer } from 'react-virtualized';

export default class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showYT: false,
      itemHeight: 30
    };
    this.rowRenderer = this.rowRenderer.bind(this);
  }
/*  componentWillReceiveProps(nextProps) {
    if (this.props.position !== nextProps.position) {
      const queue = document.getElementById('queue');
      const height = queue.scrollHeight;
      const position = nextProps.position;
      const offset = (height / nextProps.songs.size) * position;
      queue.scrollTop = Math.round(offset);
    }
  }*/

  render() {
    return (
      <div id="queue-container">
        <div className="song-header-container song-list-header">
          <div className="song-title-header">
            <p>
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
            </p>
          </div>
        </div>
        <div id="queue" className="queue song-list">
          <AutoSizer>
            {({ height, width }) => (
              <List
                rowCount={this.props.songs.size}
                rowRenderer={this.rowRenderer}
                rowHeight={this.state.itemHeight}
                width={width}
                height={height}
                scrollToIndex={this.props.position}
              />
            )}
          </AutoSizer>
        </div>
        {this.props.currentTrack && (
          <div className="album-art">
            <div
              id="ytPlayer"
              style={{
                display: 'none',
                margin: '0 auto',
                maxWidth: '90%',
                maxHeight: '90%'
              }}
            />
            {!this.state.showYT && (
              <img
                src={
                  this.props.currentTrack.album
                    ? this.props.currentTrack.album.images[1].url
                    : `http://img.youtube.com/vi/${
                        this.props.currentTrack.id
                      }/hqdefault.jpg`
                }
                className="current-playing-art"
              />
            )}
            {!this.props.currentTrack.uri && (
              <i
                className="fa fa-youtube-play"
                onClick={() => {
                  document.getElementById('ytPlayer').style.display = this.state
                    .showYT
                    ? 'none'
                    : 'flex';
                  this.setState({ showYT: !this.state.showYT });
                }}
              />
            )}
          </div>
        )}
        <SongControls />
      </div>
    );
  }
  rowRenderer(options) {
    const { index, key, style } = options;
    const song = this.props.songs.get(index);
    const buttonClass =
      song.track.id === this.props.songId && !this.props.songPaused
        ? 'fa-pause-circle-o'
        : 'fa-play-circle-o';
    return (
      <div
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
            onClick={() => this.props.updatePosition(index)}
            className="play-song"
          >
            <i className={`fa ${buttonClass} play-btn`} aria-hidden="true" />
          </button>
        </div>
        <div className="song-title">
          <p>
            {song.youtube && <i className="fa fa-youtube-play" />}
            {song.track.name}
          </p>
        </div>
      </div>
    );
  }
}
