import * as React from 'react';
import Filter from '../Filter';
import './SongListOptions.css';

interface IProps {
  currentSort: string;
  setSort: (t: string) => void;
  pending: boolean;
  isLibrary: boolean;
  playlistId: string;
  isUnified: boolean;
  update: any;
  convertPlaylistToUnified: (name: string) => void;
  selectionMade: boolean;
  addSelected: () => void;
  makeQueue: () => void;
  clearSelection: () => void;
}

export default class extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.setName = this.setName.bind(this);
    this.setArtist = this.setArtist.bind(this);
    this.setAlbum = this.setAlbum.bind(this);
    this.setAdded = this.setAdded.bind(this);
    this.convert = this.convert.bind(this);
  }
  public render() {
    const current = this.props.currentSort.substring(
      0,
      this.props.currentSort.indexOf('-')
    );
    const ascDesc = this.props.currentSort.substring(
      this.props.currentSort.indexOf('-') + 1
    );
    const icon = (
      <i className={`fa fa-chevron-${ascDesc === 'desc' ? 'up' : 'down'}`} />
    );

    return (
      <div className="song-list-options-container">
        {!this.props.isLibrary &&
          !this.props.isUnified && (
            <button
              className="btn"
              onClick={this.convert(this.props.playlistId)}
            >
              Convert to unified
            </button>
          )}
        <div className="song-list-options">
          {this.props.selectionMade && (
            <div className="selected-buttons">
              <button className="btn" onClick={this.props.clearSelection}>
                <i className={'fa fa-trash'} aria-hidden="true" />
              </button>
              <button className="btn" onClick={this.props.addSelected}>
                <i className={'fa fa-plus'} aria-hidden="true" />
              </button>
              <button className="btn" onClick={this.props.makeQueue}>
                <i className={'fa fa-file'} aria-hidden="true" />
              </button>
            </div>
          )}

          <Filter />
          <div className="dropdown">
            <button className="dropbtn">
              sort
              <i className="fa fa-sort" />
            </button>
            <div className="dropdown-content">
              <div
                onClick={this.setName}
                className={`${
                  current === 'name' ? 'activeSort' : ''
                } song-title-header`}
              >
                <p>
                  {this.props.pending && <i className="fa fa-sync fa-spin" />}{' '}
                  Title{current === 'name' && icon}
                </p>
              </div>
              <div
                onClick={this.setArtist}
                className={`${
                  current === 'artist' ? 'activeSort' : ''
                } song-artist-header`}
              >
                <p>
                  Artist
                  {current === 'artist' && icon}
                </p>
              </div>
              <div
                onClick={this.setAlbum}
                className={`${
                  current === 'album' ? 'activeSort' : ''
                } song-album-header`}
              >
                <p>
                  Album
                  {current === 'album' && icon}
                </p>
              </div>
              <div
                className={`${
                  current === 'added' ? 'activeSort' : ''
                } song-list-options`}
              >
                <i onClick={this.setAdded} className="fa fa-calendar" />
                {current === 'added' && icon}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  private setName() {
    this.props.currentSort.substring(
      this.props.currentSort.indexOf('-') + 1
    ) === 'desc'
      ? this.props.setSort('name-asc')
      : this.props.setSort('name-desc');
    this.props.update();
  }
  private setArtist() {
    this.props.currentSort.substring(
      this.props.currentSort.indexOf('-') + 1
    ) === 'desc'
      ? this.props.setSort('artist-asc')
      : this.props.setSort('artist-desc');
    this.props.update();
  }

  private setAlbum() {
    this.props.currentSort.substring(
      this.props.currentSort.indexOf('-') + 1
    ) === 'desc'
      ? this.props.setSort('album-asc')
      : this.props.setSort('album-desc');
    this.props.update();
  }

  private setAdded() {
    this.props.currentSort.substring(
      this.props.currentSort.indexOf('-') + 1
    ) === 'desc'
      ? this.props.setSort('added-asc')
      : this.props.setSort('added-desc');
    this.props.update();
  }
  private convert = name => () => {
    this.props.convertPlaylistToUnified(name);
  };
}
