import React from 'react';
import {render} from 'react-dom';
import { Accordion, Grid, Segment, Container, Divider, Icon, Image, Header, Label, Button, Checkbox } from 'semantic-ui-react';

export default class BK_Records extends React.Component {
  constructor(props) {
    super(props);
    this.selectedReferences = new Set();
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.createCV = this.createCV.bind(this);
  }

  toggleCheckbox(event) {
    if(this.selectedReferences.has(event.target.name)) {
        this.selectedReferences.delete(event.target.name);
    } else {
        this.selectedReferences.add(target.target.name);
    }
  }

  createCV() {
    console.log(this.selectedReferences);
    BK.createCV(Array.from(this.selectedReferences), 'SUPER AMAZING CV');
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
              <Grid celled container stackable reversed='mobile' columns={4}>
                  <Grid.Column width={2}>
                    <Checkbox name={record.sc} label='add to cv' onChange={parent.toggleCheckbox}/>
                  </Grid.Column>
                  <Grid.Column width={13}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column floated='left' width={10}>
                            <Header as='h1'>{record.company || 'Company'}</Header>
                            <Header as='h2'><i>{record.role || 'Role'}</i></Header>
                            <Header as='h3'><i>{record.location || 'Location'}</i></Header>
                          </Grid.Column>
                          <Grid.Column floated='right' width={3}>
                            <Container textAlign='left'>
                              <Label as='a'>
                                   <Icon name='calendar' />Date
                             </Label>
                             {"     " + record.date || 'Date'}
                           </Container>
                           <br/>
                           <Container textAlign='left'>
                             <Label as='a'>
                                  <Icon name='clock' />Time
                            </Label>
                            {"     " + record.time || 'Time'}
                           </Container>
                          </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                          <Grid.Column floated='left' width={16}>
                            <Container textAlign='justified'>
                              <b>{record.recordType}</b>
                              <Divider />
                              <Accordion>
                                <Accordion.Title>
                                  <Icon name='dropdown' />
                                  See full {record.recordType || 'Record'}
                                </Accordion.Title>
                                <Accordion.Content>
                                  <p>
                                    {record.content || 'Content'}
                                  </p>
                                </Accordion.Content>
                                </Accordion>
                            </Container>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                  </Grid.Column>
              </Grid>
              </div>
            );
          })}
          <Button label='Create CV' onclick={parent.createCV} />
      </div>


    );
  }

}
