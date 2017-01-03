import React from 'react';
import {render} from 'react-dom';
import { Icon, Label, Button, Modal } from 'semantic-ui-react';
import BK_RequestForm from './request-form.jsx';


export default class BK_RequestButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal trigger={
        <Button
          primary
          content='New request'
          icon='plus'
          labelPosition='left'
          id='bk-request-button'
        />
      }>
        <Modal.Header>
          Create a new request
        </Modal.Header>
        <Modal.Content>
          <BK_RequestForm />
        </Modal.Content>
      </Modal>
    )
  }
}
