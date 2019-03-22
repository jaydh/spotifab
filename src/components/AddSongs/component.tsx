import * as React from 'react';
import AddSpotify from '../AddSpotify';
import AddYoutube from '../AddYoutube';
import { IconButton, Grow } from '@material-ui/core';
import { LibraryAdd } from '@material-ui/icons';

interface IProps {}

interface IState {
  show: boolean;
}

export default class AddSongs extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      show: false
    };
  }
  public render() {
    const { show } = this.state;
    return (
      <>
        <IconButton onClick={this.handleClick}>
          <LibraryAdd fontSize="small" />
        </IconButton>
        <Grow in={show} timeout={500}>
          <span>
            <AddSpotify />
            <AddYoutube />
          </span>
        </Grow>
      </>
    );
  }
  private handleClick = () => this.setState({ show: !this.state.show });
}
