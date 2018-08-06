import * as React from 'react';
import './sort.css';

interface IProps {
  setSort: (t: string) => void;
}
export default class Filter extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.setAddedAsc = this.setAddedAsc.bind(this);
    this.setAddedDesc = this.setAddedDesc.bind(this);
    this.setNameAsc = this.setNameAsc.bind(this);
    this.setNameDesc = this.setNameDesc.bind(this);
  }
  public render() {
    return (
      <div className="dropdown">
        <span>Mouse over me</span>
        <div className="dropdown-content">
          <button onClick={this.setAddedAsc}>Set asc</button>
          <button onClick={this.setAddedDesc}>Set desc</button>
          <button onClick={this.setNameAsc}>Set desc</button>
          <button onClick={this.setNameDesc}>Set desc</button>
        </div>
      </div>
    );
  }
  private setAddedAsc() {
    this.props.setSort('added-asc');
  }
  private setAddedDesc() {
    this.props.setSort('added-desc');
  }
  private setNameAsc() {
    this.props.setSort('name-asc');
  }
  private setNameDesc() {
    this.props.setSort('name-desc');
  }
}
