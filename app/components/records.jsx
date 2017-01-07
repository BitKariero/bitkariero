import React from 'react';
import {render} from 'react-dom';
import { Accordion, Grid, Segment, Container, Divider, Icon, Image, Header, Label } from 'semantic-ui-react';

export default class BK_Records extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { records } = this.props;
    console.log(records);

    return (
      <div>
        { records.map(function(record, i) {
            return (
              <div>
              <Grid celled container stackable reversed='mobile' columns={4}>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <Image src={'img/' + record.id + '.png'} shape='circular' size='small'/>
                  </Grid.Column>
                  <Grid.Column width={13}>
                   <Header as='h1'>{record.company}</Header>
                   <Header as='h2'><i>{record.role}</i></Header>
                   <Header as='h3'><i>{record.location}</i></Header>
                   <Grid columns={2}>
                   <Grid.Column width={13}>
                    </Grid.Column>
                      <Grid.Column width={3}>
                         <Container textAlign='left'>
                           <Label as='a'>
                                <Icon name='calendar' />Date
                          </Label>
                          {"     " + record.date}
                        </Container>
                        <br/>
                        <Container textAlign='left'>
                          <Label as='a'>
                               <Icon name='clock' />Time
                         </Label>
                         {"     " + record.time}
                        </Container>
                        </Grid.Column>
                    </Grid>
                    <Container textAlign='justified'>
                      <b>{record.recordType}</b>
                      <Divider />
                      <Accordion>
                        <Accordion.Title>
                          <Icon name='dropdown' />
                          See full {record.recordType}
                        </Accordion.Title>
                        <Accordion.Content>
                          <p>
                            {record.content}
                          </p>
                        </Accordion.Content>
                        </Accordion>
                    </Container>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            );
          })}
      </div>
    );
  }
}
