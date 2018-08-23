import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSongs, fetchYoutubeSongs } from '../../actions/songActions';
import asyncComponent from '../AsyncComponent';

const SongList = asyncComponent(() => import('../SongList'));
const Queue = asyncComponent(() => import('../Queue'));
const SongProgress = asyncComponent(() => import('../SongProgress'));

interface IProps {
  fetchSongs: () => void;
  fetchYoutubeSongs: () => void;
  location: any;
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchSongs,
      fetchYoutubeSongs
    },
    dispatch
  );
};
export default connect(
  null,
  mapDispatchToProps
)(
  class SongMain extends React.Component<IProps> {
    public componentDidMount() {
      if (this.props.location.pathname.startsWith('/library')) {
        this.props.fetchSongs();
        this.props.fetchYoutubeSongs();
      }
    }
    public componentWillReceiveProps(nextProps) {
      if (nextProps.location.pathname.startsWith('/library')) {
        this.props.fetchSongs();
        this.props.fetchYoutubeSongs();
      }
    }
    public render() {
      return (
        <div className="main-view">
          <SongList />
          <Queue />
          <SongProgress />
        </div>
      );
    }
  }
);
