import * as React from 'react';
import { Breadcrumbs } from '@material-ui/lab';
import { Typography, Paper, Link, withStyles } from '@material-ui/core';
import { LibraryMusic } from '@material-ui/icons';

interface IProps {
  history: any;
  name: string;
  clearPlaylistName: () => void;
  classes: any;
}

const styles = {
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: `2px 4px`
  },
  link: {
    display: 'flex'
  },
  icon: {
    marginRight: 2 / 2,
    width: 20,
    height: 20
  }
} as any;

class Nav extends React.Component<IProps> {
  public render() {
    const { history, name, classes } = this.props;
    const { pathname } = history.location;
    const path = (() => {
      switch (true) {
        case pathname.startsWith('/playlist'):
          return 'Playlist';
        case pathname.startsWith('/album'):
          return 'Album';
        case pathname.startsWith('/artist'):
          return 'Artist';
        default:
          return;
      }
    })();
    return (
      <Paper className={classes.root}>
        <Breadcrumbs separator="›" arial-label="Breadcrumb">
          <Link
            color="inherit"
            className={classes.link}
            onClick={this.onLibraryClick}
          >
            <LibraryMusic className={classes.icon} />
            Library
          </Link>
          {path && <Typography color="textPrimary"> {path} </Typography>}{' '}
          {path && name && <Typography color="textPrimary">{name}</Typography>}{' '}
        </Breadcrumbs>
      </Paper>
    );
  }

  private onLibraryClick = () => {
    this.props.history.push('/library');
    this.props.clearPlaylistName();
  };
}

export default withStyles(styles)(Nav);
