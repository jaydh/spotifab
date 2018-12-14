import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import './UserDetails.css';

export default class UserDetails extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
  }
  render() {
    return (
      <span>
        <Avatar alt="user" className="user-image" src={this.props.userImage} />
        {this.props.displayName}{' '}
      </span>
    );
  }
}
