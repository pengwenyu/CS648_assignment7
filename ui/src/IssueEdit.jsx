import React from 'react';
import graphQLFetch from './graphQLFetch.js';
import { Link } from 'react-router-dom';
import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import Toast from './Toast.jsx';
import {
Col, Panel, Form, FormGroup, FormControl, ControlLabel,Alert,
ButtonToolbar, Button,
} from 'react-bootstrap';

export default class IssueEdit extends React.Component {
	constructor() {
    super();
    this.state = {
    issue: {},
	invalidFields: {},
	showingValidation: false,
    toastVisible: false,
    toastMessage: ' ',
    toastType: 'success',
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	this.onValidityChange = this.onValidityChange.bind(this);
	this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
}
	componentDidMount() {
    this.loadData();
}
	componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
}
	onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
	const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
    issue: { ...prevState.issue, [name]: value },
}));
}
	onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }
	async handleSubmit(e) {
    e.preventDefault();
	this.showValidation();
    const { issue, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;
	const query = `mutation issueUpdate(
      $id: Int!
      $changes: IssueUpdateInputs!
    ) {
      issueUpdate(
        id: $id
        changes: $changes
      ) {
        id name price category image
      }
    }`;

    const { id, created, ...changes } = issue;
    const data = await graphQLFetch(query, { changes, id }, this.showError);
    if (data) {
      this.setState({ issue: data.issueUpdate });
      this.showSuccess('Updated issue successfully');
    }
}
	async loadData() {
	const query = `query issue($id: Int!){
    issue(id: $id) {
    id name category price image
}
}`;
	const { match: { params: { id } } } = this.props;	
    const data = await graphQLFetch(query,{ id }, this.showError);
	this.setState({ issue: data ? data.issue : {}, invalidFields: {} });
}
	showValidation() {
this.setState({ showingValidation: true });
}
	dismissValidation() {
this.setState({ showingValidation: false });
}
	showSuccess(message) {
this.setState({
toastVisible: true, toastMessage: message, toastType: 'success',
});
}
showError(message) {
this.setState({
toastVisible: true, toastMessage: message, toastType: 'danger',
});
}
dismissToast() {
this.setState({ toastVisible: false });
}
	render() {
	const { toastVisible, toastMessage, toastType } = this.state;
    const { issue: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
        if (propsId != null) {
            return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
        }
        return null;
    }
    const { invalidFields,showingValidation} = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
      <Alert bsStyle="danger">
        Please correct invalid fields before submitting.
      </Alert>
      );
    }
    const { issue: { name, category } } = this.state;
    const { issue: { price, image } } = this.state;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing issue: ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
      <Form horizontal onSubmit={this.handleSubmit}>
          <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Name</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Category</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="category"
                  value={category}
                  onChange={this.onChange}
                >
                  <option value="Shirts">Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Accessories">Accessories</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Price</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="price"
                  value={price}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Image</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="image"
                  value={image}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">Submit</Button>
                  <LinkContainer to="/issues">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
            <Col smOffset={3} sm={9}>{validationMessage}</Col>
            </FormGroup>
          </Form>
        </Panel.Body>
        <Panel.Footer>
          <Link to={`/edit/${id - 1}`}>Prev</Link>
          {' | '}
          <Link to={`/edit/${id + 1}`}>Next</Link>
        </Panel.Footer>
        <Toast
        showing={toastVisible}
        onDismiss={this.dismissToast}
        bsStyle={toastType}
        >
        {toastMessage}
        </Toast>
      </Panel>
    );
  }
}