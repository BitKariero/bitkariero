import React from 'react';
import {render} from 'react-dom';
import { Accordion, Grid, Segment, Container, Divider, Icon, Image, Header, Label, Button, Modal } from 'semantic-ui-react';
import BK_RequestFulfillForm from './request-fulfill-form.jsx';


export default class BK_Requests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(addr) {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    const { requests } = this.props;
    var parent = this;

    // Diplay latest first
    let reqs = [].concat(requests).reverse();

    return (
      <div>
      <Header as='h2' icon textAlign='center'>
     <Icon name='wait' circular />
     <Header.Content>
        Incoming Requests
     </Header.Content>
     </Header>
        { reqs.map(function(object, i) {
            return (
              <div>
              <Grid celled container stackable columns={2}>
                  <Grid.Column verticalAlign='middle' centered width={2}>
                    <Grid.Row>
                      <div className="address-icon" style={{backgroundImage: 'url(' + blockies.create({ seed:object.sc ,size: 8,scale: 16}).toDataURL()+')'}}>
                      </div>
                    </Grid.Row>
                  </Grid.Column>
                  <Grid.Column width={10}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column floated='left'>
                            <Header as='h2'>{'Request: ' + object.type.toLowerCase()}</Header>

                            <Grid.Row>
                              <Grid.Column width={2}>
                                <Label as='a'>
                                     <Icon name='user' />From
                               </Label>
                             </Grid.Column>

                             <Grid.Column width={14}>
                              <span>{object.fromid.name} ({object.from}) </span>
                             </Grid.Column>
                           </Grid.Row>
                           
                            <Grid.Row>
                              <Grid.Column width={2}>
                                <Label as='a'>
                                     <Icon name='certificate' />Address
                               </Label>
                             </Grid.Column>

                             <Grid.Column width={14}>
                              <span>{object.sc}</span>
                             </Grid.Column>
                           </Grid.Row>


                           
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                  </Grid.Column>

                  <Grid.Column verticalAlign='middle' centered width={4}>
                    <Button
                      positive
                      content='Fulfill request'
                      icon='exchange'
                      labelPosition='left'
                      id={'bk-fulfill-req-' + object.sc}
                      onClick={(e) => {parent.setState({contract: object}); parent.toggleModal(object.sc)}}
                    />
                  </Grid.Column>
              </Grid>
            </div>
            );
          })}

      <Modal open={parent.state.isOpen} onClose={parent.toggleModal}>
        <Modal.Header>
          Fulfill request
        </Modal.Header>
        <Modal.Content>
          <BK_RequestFulfillForm onChange={parent.toggleModal} object={parent.state.contract}/>
        </Modal.Content>
      </Modal>
    </div>
    );
  }
}
