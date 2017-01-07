import React from 'react';
import {render} from 'react-dom';
import { Accordion, Grid, Segment, Container, Divider, Icon, Image, Header, Label } from 'semantic-ui-react';

export default class BK_ApprovalQueue extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { approvalqueue } = this.props;
    console.log(approvalqueue);

    return (
      <div>
      <Header as='h2' icon textAlign='center'>
     <Icon name='wait' circular />
     <Header.Content>
        Pending Requests
     </Header.Content>
     </Header>
        { approvalqueue.map(function(object, i) {
            return (
              <div>
              <Grid celled container stackable reversed='mobile' columns={4}>
                  <Grid.Column width={2}>
                    <Image src={'img/' + object.id + '.png'} shape='circular' size='small'/>
                  </Grid.Column>
                  <Grid.Column width={13}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column floated='left' width={10}>
                            <Header as='h1'>{object.company}</Header>
                            <Header as='h2'><i>{object.role}</i></Header>
                            <Header as='h3'><i>{object.location}</i></Header>
                          </Grid.Column>
                          <Grid.Column floated='right' width={3}>
                            <Container textAlign='left'>
                              <Label as='a'>
                                   <Icon name='calendar' />Date
                             </Label>
                             {"     " + object.date}
                           </Container>
                           <br/>
                           <Container textAlign='left'>
                             <Label as='a'>
                                  <Icon name='clock' />Time
                            </Label>
                            {"     " + object.time}
                           </Container>
                          </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                          <Grid.Column floated='left' width={10}>
                            <Container textAlign='justified'>
                              <b>{object.recordType}</b>
                            </Container>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                  </Grid.Column>
              </Grid>
            </div>
            );
          })}
      </div>
    );
  }
}
