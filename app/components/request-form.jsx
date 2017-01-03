import React from 'react';
import {render} from 'react-dom';
import { Icon, Label, Button, Form, Input, Dropdown } from 'semantic-ui-react';
import { recordTypes } from '../common.jsx';



export default class BK_RequestForm extends React.Component {
  render() {
    return (
      <Form>
        <Form.Field>
          <label>Record type: </label>
          <Dropdown placeholder='Record type' fluid selection options={recordTypes} />
        </Form.Field>
        <Form.Field>
          <label icon='asterisk'>Provided by:</label>
          <Input
          label={{ icon: 'asterisk' }}
          labelPosition='right corner'
          placeholder="Provider's address"
          />
        </Form.Field>
        <Button primary type='submit'>Submit</Button>
      </Form>
    )
  }
}
