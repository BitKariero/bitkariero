import React from 'react';
import {render} from 'react-dom';
import { Accordion, Grid, Segment, Container, Divider, Icon, Image, Header, Label } from 'semantic-ui-react';

export default class BK_Resume extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { resume } = this.props;

    return (
      <div>
      <Header as='h2' icon textAlign='center'>
     <Header.Content>
       People
     </Header.Content>
     </Header>
        { BK.allCVs.map(function(CV, i) {
            return (
              <div>
              <Grid celled container stackable reversed='mobile' columns={4}>
                  <Grid.Column width={2}>
                    <Image src={'img/' + i + '.png'} shape='circular' size='small'/>
                  </Grid.Column>
                  <Grid.Column width={13}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column floated='left' width={10}>
                            <Header as='h1'>{CV.name.name || 'Name'}</Header>
                            <p>
                                {CV.text || 'CV'}
                            </p>
                          </Grid.Column>
                          <Grid.Column floated='right' width={3}>
                            <Container textAlign='left'>
                              <Label as='a'>
                                   <Icon name='calendar' />Date
                             </Label>
                             {"     " +  'Date'}
                           </Container>
                           <br/>
                           <Container textAlign='left'>
                             <Label as='a'>
                                  <Icon name='clock' />Time
                            </Label>
                            {"     " +  'Time'}
                           </Container>
                          </Grid.Column>
                        </Grid.Row>
                        
                        <Grid.Row>
                          <Grid.Column floated='left' width={16}>
                            <Container textAlign='justified'>
                              
                              <Divider />
                              <Accordion>
                                <Accordion.Title>
                                  <Icon name='dropdown' />
                                  See references
                                </Accordion.Title>
                                <Accordion.Content>
                                  { CV.references.map((ref, i) => {
                                    return (
                                            <div>
                                            <Header as='h3'> {'From:' + ref.from.name || ''}</Header>
                                            <p>
                                                {ref.content || ''}
                                            </p>
                                            </div>
                                    );
                                    })
                                  }
                                            
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
      </div>
    );
  }
}
