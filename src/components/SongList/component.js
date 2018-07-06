import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongList.css';
import Draggable from 'react-draggable';
import SongProgress from '../SongProgress';
import { List } from 'immutable';
class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downSelectorPos: 0,
      upSelectorPos: 0,
      selected: List(),
      itemHeight: 0
    };
  }
  componentDidMount() {
    this.props.fetchSongs();
    const list = document.getElementById('song-list');
    const height = list.scrollHeight;
    const itemHeight = height / this.props.songs.size;
    this.setState({ itemHeight });
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
          {!this.state.selected.isEmpty() && (
            <div className="selectes-buttons">
              <button onClick={() => this.addSelectedToQueue()}>
                <i className={'fa fa-plus'} aria-hidden="true" />
              </button>
              <button
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

          {this.props.songs.map((song, i) => {
            const buttonClass =
              song.track.id === this.props.songId && !this.props.songPaused
                ? 'fa-pause-circle-o'
                : 'fa-play-circle-o';

            const selected =
              i <= this.state.upSelectorPos && i >= this.state.downSelectorPos;
            return !song.youtube ? (
              <li
                className={
                  !selected
                    ? 'user-song-item'
                    : 'user-song-item selected-user-song-item'
                }
                key={`songListItem${song.track.id}`}
              >
                <div className="song-buttons">
                  <button
                    onClick={() => {
                      this.makeNewQueue(
                        i,
                        this.state.upSelectorPos === 0
                          ? this.props.songs.size
                          : this.state.upSelectorPos
                      );
                      this.setState({ downSelectorPos: i });
                      this.setState({
                        upSelectorPos: this.props.songs.size - 1
                      });
                      this.props.play();
                    }}
                    className="play-song"
                  >
                    <i
                      className={`fa ${buttonClass} play-btn`}
                      aria-hidden="true"
                    />
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
                <div className="song-buttons" style={{ float: 'right' }}>
                  <button onClick={() => this.props.addSongToQueue(song)}>
                    <i className={'fa fa-plus'} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => {
                      this.setState({
                        downSelectorPos: i,
                        selected: this.props.songs.slice(
                          i,
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
                        upSelectorPos: i,
                        selected: this.props.songs.slice(
                          this.state.downSelectorPos,
                          i
                        )
                      });
                    }}
                  >
                    <i className={'fa fa-angle-up'} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ) : (
              <li
                className={
                  song.track.id === this.props.songId
                    ? 'active user-song-item'
                    : 'user-song-item'
                }
                key={i}
              >
                <div
                  className="play-song"
                  onClick={() => {
                    this.makeNewQueue(
                      i,
                      this.state.upSelectorPos === 0
                        ? this.props.songs.size
                        : this.state.upSelectorPos
                    );
                    this.setState({ downSelectorPos: i });
                    this.setState({
                      upSelectorPos: this.props.songs.size - 1
                    });
                    this.props.play();
                  }}
                >
                  <i
                    className={`fa ${buttonClass} play-btn`}
                    aria-hidden="true"
                  />
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
                        downSelectorPos: i,
                        selected: this.props.songs.slice(
                          i,
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
                        upSelectorPos: i,
                        selected: this.props.songs.slice(
                          this.state.downSelectorPos,
                          i
                        )
                      });
                    }}
                  >
                    <i className={'fa fa-angle-up'} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </div>
        <SongProgress />
      </div>
    );
  }
}

export default SongList;
