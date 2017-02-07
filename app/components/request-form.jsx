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
    this.state = {addrValue: BK.ownAddress};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({addrValue: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    var myp = BK.requestRecord(BK.PlainReference, this.state.addrValue);
    console.log(myp);
    myp.then(
        function(val) {
            console.log("got promise" + val);
        }
    );


    alert(this.state.addrValue);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field>
          <label>Record type: </label>
          <Dropdown placeholder='Record type' fluid selection options={recordTypes} />
        </Form.Field>
        <Form.Field>
          <label icon='asterisk'>Provided by:</label>
          <Input
          type="text"
          value={this.state.addrValue}
          onChange={this.handleChange}
          label={{ icon: 'asterisk' }}
          labelPosition='right corner'
          />
        </Form.Field>
        <Button primary type='submit'>Submit</Button>
      </Form>
    )
  }
}
