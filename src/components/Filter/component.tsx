import * as React from 'react';
import './Filter.css';

interface IProps {
  setFilter: (t: string) => void;
}
interface IState {
  value: string;
}

export default class Filter extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    return (
      <div className="filter">
        <form onSubmit={this.handleChange}>
          <input
            type="text"
            placeholder="filter"
            onChange={this.handleChange}
          />
          <i className="fa fa-search" />
        </form>
      </div>
    );
  }
  private handleChange(e: any) {
    e.preventDefault();
    const { setFilter } = this.props;
    this.setState({
      value: e.target.value
    });
    setFilter(e.target.value);
  }
}
