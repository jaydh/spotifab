import * as React from 'react';

import Button from '@material-ui/core/Button';
import Play from '@material-ui/icons/PlayCircleOutline';

interface IProps {
  itemHeight: number;
  song: any;
  index: number;
  key: string;
  style: any;
  updatePosition: (index) => void;
  removeSongFromQueue: (index) => void;
  insertSongInQueue: (song, newPosition) => void;
  position: number;
  play: () => void;
}
export default class QueueItem extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  public render() {
    const { song, index } = this.props;
    return (
      <div
        id={`queue-item-${index}`}
        className={
          index === this.props.position
            ? 'user-queue-item active'
            : 'user-queue-item'
        }
      >
        <Button className="play-song btn" onClick={this.handleUpdate}>
          <Play />
        </Button>
        <div className="song-title">
          <p>
            {song.youtube && <i className="fab fa-youtube" />}
            {song.track.name}
          </p>
        </div>
        <div className="song-buttons">
          <button className="btn" onClick={this.handleRemove}>
            <i className="fa fa-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }
  private handleUpdate() {
    this.props.updatePosition(this.props.index);
    this.props.play();
  }

  private handleRemove() {
    this.props.removeSongFromQueue(this.props.index);
  }
}
