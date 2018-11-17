import * as React from 'react';
import Filter from '../Filter';
import Sort from '../Sort';
import './SongListOptions.css';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Clear from '@material-ui/icons/DeleteSweep';
import Add from '@material-ui/icons/PlaylistAdd';
import AddCheck from '@material-ui/icons/PlaylistAddCheck';

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
          <Grid container={true} spacing={24} alignItems="center">
            {this.props.selectionMade && (
              <>
                <Grid item={true}>
                  <Button
                    variant="fab"
                    mini={true}
                    onClick={this.props.clearSelection}
                  >
                    <Clear />
                  </Button>
                  <Button
                    variant="fab"
                    mini={true}
                    onClick={this.props.addSelected}
                  >
                    <Add />
                  </Button>
                  <Button
                    variant="fab"
                    mini={true}
                    onClick={this.props.makeQueue}
                  >
                    <AddCheck />
                  </Button>
                </Grid>
              </>
            )}

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
