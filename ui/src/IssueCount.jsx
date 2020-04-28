import React from 'react';
import graphQLFetch from './graphQLFetch.js';
/* eslint "react/prefer-stateless-function": "off" */
import { Link, NavLink, withRouter } from 'react-router-dom';
// eslint-disable-next-line react/prefer-stateless-function
export default class IssueCount extends React.Component {
  constructor() {
    super();
    this.state = { issueCounts: [] };
  }
  componentDidMount() {
    this.loadData();
  }
  componentDidUpdate(prevProps) {
    this.loadData();
  }
  async loadData() {
    const query = `query {
    issueCounts {
      count
    }
}`;
    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issueCounts: data.issueCounts });
    }
  }
  render() {
	const { issueCounts } = this.state;
    const { match } = this.props;
    const statRows = issueCounts.map(counts => (
    <div>There are {counts.count} avaliable product</div>
    ));
    return (
	   <table className="table" border="0">
      <tbody>
        {statRows}
      </tbody>
    </table>
  );
}
}