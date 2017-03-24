import React from 'react';
import {render} from 'react-dom';
import { Icon, Label, Button, Form, Input, TextArea, Grid } from 'semantic-ui-react';
import { recordTypes } from '../common.jsx';


export default class BK_RequestFulfillForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {referenceText: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({referenceText: event.target.value});
  }

  handleSubmit(event) {
    const { object } = this.props;

    event.preventDefault();
    BK.provideReference(object.sc, this.state.referenceText);
    this.props.onChange();
  }

  render() {
    const { object } = this.props;

    return (
      <Grid verticalAlign='middle' centered>
        <Grid.Column verticalAlign='middle' centered width={2}>
          <div className="address-icon" style={{backgroundImage: 'url(' + blockies.create({ seed:object.sc ,size: 8,scale: 16}).toDataURL()+')'}}></div>
        </Grid.Column>

        <Grid.Column width={14}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>Text:</label>
              <TextArea
              placeholder='Type in your reference'
              value = {this.state.referenceText}
              onChange={this.handleChange}
              />
            </Form.Field>
            <Button primary type='submit'>Submit</Button>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}
