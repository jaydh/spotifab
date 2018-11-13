import * as React from 'react';
import Filter from '../Filter';
import Sort from '../Sort';
import './SongListOptions.css';

import Grid from '@material-ui/core/Grid';

interface IProps {
  pending: boolean;
  isLibrary: boolean;
  playlistId: string;
  isUnified: boolean;
  update: () => void;
  convertPlaylistToUnified: (name: string) => void;
  selectionMade: boolean;
  addSelected: () => void;
  makeQueue: () => void;
  clearSelection: () => void;
}

export default class extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.convert = this.convert.bind(this);
  }
  public render() {
    return (
      <div className="song-list-options-container">
        {!this.props.isLibrary && !this.props.isUnified && (
          <button className="btn" onClick={this.convert(this.props.playlistId)}>
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
          <Grid container={true} spacing={24} alignItems="center">
            <Grid item={true}>
              <Filter />
            </Grid>
            <Grid item={true}>
              <Sort update={this.props.update} />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
  private convert = name => () => {
    this.props.convertPlaylistToUnified(name);
  };
}
