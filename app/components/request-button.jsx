import React from 'react';
import {render} from 'react-dom';
import { Icon, Label, Button, Modal } from 'semantic-ui-react';
import BK_RequestForm from './request-form.jsx';


export default class BK_RequestButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    return (
      <Modal open={this.state.isOpen} trigger={
        <Button
          primary
          content='New request'
          icon='plus'
          labelPosition='left'
          id='bk-request-button'
          onClick={this.toggleModal}
        />
      }>
        <Modal.Header>
          Create a new request
        </Modal.Header>
        <Modal.Content>
          <BK_RequestForm onChange={this.toggleModal}/>
        </Modal.Content>
      </Modal>
    )
  }
}
