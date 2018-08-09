import * as React from 'react';

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
      <div>
        <form onSubmit={this.handleChange}>
          <input
            placeholder={this.state.value === '' ? 'Filter' : this.state.value}
            onChange={this.handleChange}
          />
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
