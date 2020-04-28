import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
Button, Glyphicon, Tooltip, OverlayTrigger,Table,
} from 'react-bootstrap';
function issue$(string) {
  const string1 = '$';
  const string2 = string1 + string;
  return string2;
}

const IssueRow = withRouter(({ issue, location: { search }, deleteIssue,index }) => {
  const selectLocation = { pathname: `/issues/${issue.id}`, search };
  const deleteTooltip = (
    <Tooltip id="delete-tooltip" placement="top">Delete Issue</Tooltip>
  );
  const editTooltip = (
    <Tooltip id="close-tooltip" placement="top">Edit Issue</Tooltip>
  );
  function onDelete(e) {
    e.preventDefault();
    deleteIssue(index);
  }
  const tableRow = (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.name}</td>
      <td>{issue$(issue.price)}</td>
      <td>{issue.category}</td>
      <td><Link to={`/image/${issue.id}`}>View</Link></td>
        <LinkContainer to={`/edit/${issue.id}`}>
        <OverlayTrigger delayShow={1000} overlay={editTooltip}>
          <Button bsSize="xsmall">
            <Glyphicon glyph="edit" />
          </Button>
        </OverlayTrigger>
        </LinkContainer>
        <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
          <Button bsSize="xsmall" onClick={onDelete}>
            <Glyphicon glyph="trash" />
          </Button>
        </OverlayTrigger>
    </tr>
  );
  return (
    <LinkContainer to={selectLocation}>
    {tableRow}
    </LinkContainer>
  );
});

export default function IssueTable({ issues, deleteIssue }) {
const issueRows = issues.map((issue, index) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      deleteIssue={deleteIssue}
      index={index}
    />
  ));
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </Table>
  );
}