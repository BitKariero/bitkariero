import React from 'react';
import {render} from 'react-dom';
import { Modal, Form, Accordion, Grid, Segment, Container, Divider, Icon, Image, Header, Label, Button, Checkbox } from 'semantic-ui-react';

export default class BK_Records extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {cvtext: '', isOpen:false};
    
    this.selectedReferences = new Set();
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleChange(event) {
    this.setState({cvtext: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    BK.createCV(Array.from(this.selectedReferences), this.state.cvtext);
    this.setState({isOpen: true});
  }
  
  closeModal() {
    this.setState({cvtext: '', isOpen: false});
  }
  
  toggleCheckbox(sc) {
    console.log(sc);
    if(this.selectedReferences.has(sc)) {
        this.selectedReferences.delete(sc);
    } else {
        this.selectedReferences.add(sc);
    }
  }
  
  render() {
    const { records } = this.props;
    var parent = this;

    // Diplay latest first
    let recs = [].concat(records).reverse();

    return (

      <div>
      <Header as='h2' icon textAlign='center'>
     <Icon name='check circle' circular />
     <Header.Content>
       Verified Requests
     </Header.Content>
     </Header>
        {
        recs.map(function(record, i) {
            return (
              <div>
              <Grid celled container stackable columns={2}>
                  <Grid.Column verticalAlign='middle' centered width={2}>
                    <Grid.Row>
                      <div className="address-icon" style={{backgroundImage: 'url(' + blockies.create({ seed:record.sc ,size: 8,scale: 16}).toDataURL()+')'}}>
                      </div>
                      <Checkbox label='add to cv' onChange={(e) => parent.toggleCheckbox(record.sc)}/>
                    </Grid.Row>
                  </Grid.Column>
                  <Grid.Column width={14}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column floated='left'>
                            <Header as='h2'>{'Reference: ' + record.type.toLowerCase()}</Header>

                            <Grid.Row>
                              <Grid.Column width={2}>
                                <Label as='a'>
                                     <Icon name='user' />From
                               </Label>
                             </Grid.Column>

                             <Grid.Column width={14}>
                              <span>{record.fromid.name} ({record.from})</span>
                             </Grid.Column>
                           </Grid.Row>
                            
                            <Grid.Row>
                              <Grid.Column width={2}>
                                <Label as='a'>
                                     <Icon name='certificate' />Address
                               </Label>
                             </Grid.Column>

                             <Grid.Column width={14}>
                              <span>{record.sc}</span>
                             </Grid.Column>
                           </Grid.Row>
                           
                           


                            <Grid.Row>
                            <Grid.Column width={2}>
                              <Label as='a'>
                                   <Icon name='angle double down' />Contents
                             </Label>
                           </Grid.Column>

                           <Grid.Column width={14}>
                            <span>{record.content}</span>
                           </Grid.Column>
                           </Grid.Row>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                  </Grid.Column>
              </Grid>
              </div>
            );

          })
        }
      <Grid celled container stackable reversed='mobile' columns={4}>
        <Grid.Column width={16}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
            <label>
              CV Text:
              <input type="text" value={this.state.cvtext} onChange={this.handleChange} />
            </label>
            </Form.Field>
            <Button primary type="submit">Create CV</Button>
          </Form>
          

        </Grid.Column>
    </Grid>
    
    <Modal open={this.state.isOpen} onClose={this.closeModal}>
        <Modal.Header>
          CV Created
        </Modal.Header>
        <Modal.Content>
          Created CV Sucessfully. Preview:
          <div>
            {this.state.cvtext}
          </div>
        </Modal.Content>
      </Modal>
      
    </div>
      
      
    ); 
        
   }

}
