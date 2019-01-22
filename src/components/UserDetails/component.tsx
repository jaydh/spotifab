import React from "react";
import { Avatar, Chip } from "@material-ui/core";

interface IProps {
  fetchUser: () => void;
  userImage: string;
  displayName: string;
}

export default class UserDetails extends React.Component<IProps> {
  public componentDidMount() {
    this.props.fetchUser();
  }
  public render() {
    return (
      <Chip
        color="primary"
        avatar={
          <Avatar
            alt="user"
            className="user-image"
            src={this.props.userImage}
          />
        }
        label={this.props.displayName}
        onDelete={this.handleSignout}
      />
    );
  }
  private handleSignout = () => (window as any).firebase.auth().signOut();
}
