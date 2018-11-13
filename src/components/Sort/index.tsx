import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSort } from '../../actions/uiActions';

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import Down from '@material-ui/icons/KeyboardArrowDown';
import Up from '@material-ui/icons/KeyboardArrowUp';
import Person from '@material-ui/icons/Person';
import SortIcon from '@material-ui/icons/Sort';
import TitleIcon from '@material-ui/icons/Title';
import Update from '@material-ui/icons/Update';

interface IProps {
  classes: any;
  currentSort: string;
  showCompleted: boolean;
  setSort: (t: string) => void;
  toggleShowCompleted: () => void;
  update: () => void;
}

interface IState {
  open: boolean;
  anchorEl: any;
}

class Sort extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { open: false, anchorEl: undefined };
    this.handleClose = this.handleClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRef = this.handleRef.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.setName = this.setName.bind(this);
    this.setArtist = this.setArtist.bind(this);
    this.setAlbum = this.setAlbum.bind(this);
    this.setAdded = this.setAdded.bind(this);
  }
  public render() {
    const { classes, currentSort } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <Button
          buttonRef={this.handleRef}
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          <SortIcon fontSize="small" />
        </Button>
        <Popper
          className={classes.options}
          open={open}
          anchorEl={this.state.anchorEl}
          transition={true}
          disablePortal={true}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList className={classes.options}>
                    <MenuItem onClick={this.setName}>
                      Name <TitleIcon fontSize="small" />{' '}
                      {currentSort.startsWith('name') &&
                        (currentSort === 'name-asc' ? <Down /> : <Up />)}
                    </MenuItem>
                    <MenuItem onClick={this.setArtist}>
                      Artist <Person fontSize="small" />{' '}
                      {currentSort.startsWith('artist') &&
                        (currentSort === 'artist-asc' ? <Down /> : <Up />)}
                    </MenuItem>
                    <MenuItem onClick={this.setAdded}>
                      Date <Update fontSize="small" />{' '}
                      {currentSort.startsWith('added') &&
                        (currentSort === 'added-asc' ? <Down /> : <Up />)}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
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

  private handleToggle() {
    this.setState(state => ({ open: !state.open }));
  }

  private handleClose(event: any) {
    if (this.state.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  }

  private handleRef(node: any) {
    this.setState({ anchorEl: node });
  }

  private handleSort = (sort: string) => () => {
    this.props.setSort(sort);
  };
}

const styles = {
  options: {
    colorPrimary: '#855a91',
    zIndex: 100
  },
  root: {
    display: 'flex'
  }
};

const mapStateToProps = (state: any) => {
  return {
    currentSort: state.ui.sort,
    showCompleted: state.ui.showCompleted
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ setSort }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Sort));
