import * as React from "react";
import {
  Button,
  ClickAwayListener,
  Grow,
  FormControlLabel,
  Switch,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  withStyles
} from "@material-ui/core";
import { Spotify, Youtube } from "mdi-material-ui";

import Down from "@material-ui/icons/KeyboardArrowDown";
import Up from "@material-ui/icons/KeyboardArrowUp";
import Person from "@material-ui/icons/Person";
import SortIcon from "@material-ui/icons/Sort";
import TitleIcon from "@material-ui/icons/Title";
import Update from "@material-ui/icons/Update";

const styles = {
  options: {
    colorPrimary: "#855a91",
    zIndex: 100
  },
  root: {
    display: "flex"
  }
};

interface IProps {
  classes: any;
  currentSort: string;
  showCompleted: boolean;
  showSpotify: boolean;
  showYoutube: boolean;
  setSort: (t: string) => void;
  toggleShowCompleted: () => void;
  toggleShowYoutube: () => void;
  toggleShowSpotify: () => void;
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
  }
  public render() {
    const {
      classes,
      currentSort,
      showYoutube,
      showSpotify,
      toggleShowYoutube,
      toggleShowSpotify
    } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <Button
          buttonRef={this.handleRef}
          aria-owns={open ? "menu-list-grow" : undefined}
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
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList className={classes.options}>
                    <MenuItem onClick={this.setName}>
                      Name <TitleIcon fontSize="small" />{" "}
                      {currentSort.startsWith("name") &&
                        (currentSort === "name-asc" ? <Down /> : <Up />)}
                    </MenuItem>
                    <MenuItem onClick={this.setArtist}>
                      Artist <Person fontSize="small" />{" "}
                      {currentSort.startsWith("artist") &&
                        (currentSort === "artist-asc" ? <Down /> : <Up />)}
                    </MenuItem>
                    <MenuItem onClick={this.setAdded}>
                      Date <Update fontSize="small" />{" "}
                      {currentSort.startsWith("added") &&
                        (currentSort === "added-asc" ? <Down /> : <Up />)}
                    </MenuItem>
                    <MenuItem>
                      <FormControlLabel
                        control={
                          <Switch
                            color="primary"
                            checked={showSpotify}
                            onClick={toggleShowSpotify}
                          />
                        }
                        label={<Spotify />}
                      />
                    </MenuItem>
                    <MenuItem>
                      <FormControlLabel
                        control={
                          <Switch
                            color="primary"
                            checked={showYoutube}
                            onClick={toggleShowYoutube}
                          />
                        }
                        label={<Youtube />}
                      />
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
  private setName = () => {
    this.props.currentSort.substring(
      this.props.currentSort.indexOf("-") + 1
    ) === "desc"
      ? this.props.setSort("name-asc")
      : this.props.setSort("name-desc");
  };
  private setArtist = () => {
    this.props.currentSort.substring(
      this.props.currentSort.indexOf("-") + 1
    ) === "desc"
      ? this.props.setSort("artist-asc")
      : this.props.setSort("artist-desc");
  };

  private setAlbum = () => {
    this.props.currentSort.substring(
      this.props.currentSort.indexOf("-") + 1
    ) === "desc"
      ? this.props.setSort("album-asc")
      : this.props.setSort("album-desc");
  };

  private setAdded = () => {
    this.props.currentSort.substring(
      this.props.currentSort.indexOf("-") + 1
    ) === "desc"
      ? this.props.setSort("added-asc")
      : this.props.setSort("added-desc");
  };

  private handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  private handleClose = (event: any) => {
    if (this.state.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  private handleRef = (node: any) => {
    this.setState({ anchorEl: node });
  };

  private handleSort = (sort: string) => () => {
    this.props.setSort(sort);
  };
}

export default withStyles(styles)(Sort);
