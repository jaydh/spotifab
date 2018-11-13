import * as React from 'react';
import './Filter.css';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FilterIcon from '@material-ui/icons/FilterList';

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
          <Input
            onChange={this.handleChange}
            value={this.state.value}
            margin="dense"
            placeholder="Filter"
            endAdornment={
              <InputAdornment position="end">
                <FilterIcon fontSize="small" />
              </InputAdornment>
            }
            inputProps={{
              'aria-label': 'Save article'
            }}
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
