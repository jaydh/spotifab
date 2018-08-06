import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongList.css';
import Draggable from 'react-draggable';
import { List } from 'immutable';
import { List as VirtualList, AutoSizer } from 'react-virtualized';
import Filter from '../Filter';
import Sort from '../Sort';

class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downSelectorPos: 0,
      upSelectorPos: 0,
      selected: List(),
      itemHeight: 30
    };
    this.rowRenderer = this.rowRenderer.bind(this);
  }
  makeNewQueue(i, j) {
    let end = i < j ? j : this.props.songs.size - 1;
    this.props.clearSongQueue();
    this.props.songs.slice(i, end + 1).map(t => {
      this.props.addSongToQueue(t);
    });
  }
  updateDownPos = (e: MouseEvent, data: Object) => {
    const { songs } = this.props;
    const position = Math.round(data.lastY / this.state.itemHeight);
    this.setState({
      downSelectorPos: position,
      selected: this.props.songs.slice(position, this.state.upSelectorPos)
    });
  };
  updateUpPos = (e: MouseEvent, data: Object) => {
    const { songs } = this.props;
    const position = Math.round(data.lastY / this.state.itemHeight);
    this.setState({
      upSelectorPos: position,
      selected: this.props.songs.slice(this.state.downSelectorPos, position)
    });
  };

  addSelectedToQueue() {
    this.state.selected.map(t => this.props.addSongToQueue(t));
  }

  render() {
    return (
      <div id="song-list-container">
        <div className="song-header-container song-list-header">
          <div className="song-title-header">
            <p>Title</p>
          </div>
          <div className="song-artist-header">
            <p>Artist</p>
          </div>
          <div className="song-album-header">
            <p>Album</p>
          </div>
          <Filter />
          <Sort />
          {!this.state.selected.isEmpty() && (
            <div className="selected-buttons">
              <button className="btn" onClick={() => this.addSelectedToQueue()}>
                <i className={'fa fa-plus'} aria-hidden="true" />
              </button>
              <button
                className="btn"
                onClick={() =>
                  this.makeNewQueue(
                    this.state.downSelectorPos,
                    this.state.upSelectorPos
                  )
                }
              >
                <i className={'fa fa-file'} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        <div id="song-list">
          <Draggable
            axis="y"
            position={{
              x: 0,
              y: this.state.downSelectorPos * this.state.itemHeight + 2
            }}
            grid={[30, 30]}
            onDrag={this.updateDownPos}
          >
            <button className="btn">
              <i className="fa fa-angle-down" />
            </button>
          </Draggable>
          <Draggable
            axis="y"
            position={{
              x: 0,
              y: this.state.upSelectorPos * this.state.itemHeight + 2
            }}
            grid={[30, 30]}
            onDrag={this.updateUpPos}
          >
            <button className="btn">
              <i className="fa fa-angle-up" />
            </button>
          </Draggable>
          <AutoSizer>
            {({ height, width }) => (
              <VirtualList
                rowCount={this.props.songs.size}
                rowRenderer={this.rowRenderer}
                rowHeight={this.state.itemHeight}
                width={width}
                height={height}
              />
            )}
          </AutoSizer>
        </div>
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

    const selected =
      index <= this.state.upSelectorPos && index >= this.state.downSelectorPos;
    return !song.youtube ? (
      <div
        className={
          !selected
            ? 'user-song-item'
            : 'user-song-item selected-user-song-item'
        }
        key={key}
        style={style}
      >
        <div className="song-buttons">
          <button
            className="play-song"
            onClick={() => {
              this.makeNewQueue(
                index,
                this.state.upSelectorPos === 0
                  ? this.props.songs.size
                  : this.state.upSelectorPos
              );
              this.setState({ downSelectorPos: index });
              this.setState({
                upSelectorPos: this.props.songs.size - 1
              });
              this.props.play();
            }}
            className="play-song"
          >
            <i className={`fa ${buttonClass} play-btn`} aria-hidden="true" />
          </button>
        </div>
        <div className="song-title">
          <p>{song.track.name}</p>
        </div>

        <div className="song-artist">
          <p>{song.track.artists[0].name}</p>
        </div>

        <div className="song-album">
          <p>{song.track.album.name}</p>
        </div>
        <div className="song-buttons">
          <button onClick={() => this.props.addSongToQueue(song)}>
            <i className={'fa fa-plus'} aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              this.setState({
                downSelectorPos: index,
                selected: this.props.songs.slice(
                  index,
                  this.state.upSelectorPos
                )
              });
            }}
          >
            <i className={'fa fa-angle-down'} aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              this.setState({
                upSelectorPos: index,
                selected: this.props.songs.slice(
                  this.state.downSelectorPos,
                  index
                )
              });
            }}
          >
            <i className={'fa fa-angle-up'} aria-hidden="true" />
          </button>
        </div>
      </div>
    ) : (
      <div
        className={
          song.track.id === this.props.songId
            ? 'active user-song-item'
            : 'user-song-item'
        }
        key={key}
        style={style}
      >
        <div
          className="play-song"
          onClick={() => {
            this.makeNewQueue(
              index,
              this.state.upSelectorPos === 0
                ? this.props.songs.size
                : this.state.upSelectorPos
            );
            this.setState({ downSelectorPos: index });
            this.setState({
              upSelectorPos: this.props.songs.size - 1
            });
            this.props.play();
          }}
        >
          <i className={`fa ${buttonClass} play-btn`} aria-hidden="true" />
        </div>
        <i className="fa fa-youtube-play" />
        {song.track.name}
        <div className="song-buttons">
          <button onClick={() => this.props.addSongToQueue(song)}>
            <i className={'fa fa-plus'} aria-hidden="true" />
          </button>
          <button onClick={() => this.props.addSongToQueue(song)}>
            <i className={'fa fa-plus'} aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              this.setState({
                downSelectorPos: index,
                selected: this.props.songs.slice(
                  index,
                  this.state.upSelectorPos
                )
              });
            }}
          >
            <i className={'fa fa-angle-down'} aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              this.setState({
                upSelectorPos: index,
                selected: this.props.songs.slice(
                  this.state.downSelectorPos,
                  index
                )
              });
            }}
          >
            <i className={'fa fa-angle-up'} aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }
}

export default SongList;
