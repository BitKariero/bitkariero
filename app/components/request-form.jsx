import React from 'react';
import {render} from 'react-dom';
import { Icon, Label, Button, Form, Input, Dropdown } from 'semantic-ui-react';
import { recordTypes } from '../common.jsx';



export default class BK_RequestForm extends React.Component {

  constructor(props) {
    super(props);

    if(!BK.ownAddress) {
      BK.init();
    }
    this.state = {addrValue: ''};
    this.dpOptions = BK.addressNames.map((x) => { return {text: x.name, value: x.value}});
    
   

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e, result) {
    console.log(result);
    this.setState({addrValue: result.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onChange();
    BK.requestReference(this.state.addrValue).then((sc) => {
        console.log("Submitted at " + sc.address);
    });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field>
          <label>Record type: </label>
          <Dropdown name="recordType" placeholder='Record type' fluid selection options={recordTypes} />
        </Form.Field>
        <Form.Field>
          <label>From: </label>
          <Dropdown name="provider" fluid selection options={this.dpOptions} onChange={this.handleChange} />
        </Form.Field>
        <Button primary type='submit'>Submit</Button>
      </Form>
    )
  }
}
