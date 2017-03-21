import React from 'react';
import {render} from 'react-dom';
import { Accordion, Grid, Segment, Container, Divider, Icon, Image, Header, Label } from 'semantic-ui-react';

export default class BK_Requests extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { requests } = this.props;
    console.log(requests);

    return (
      <div>
      <Header as='h2' icon textAlign='center'>
     <Icon name='wait' circular />
     <Header.Content>
        Incoming Requests
     </Header.Content>
     </Header>
        { requests.map(function(object, i) {
            return (
              <div>
              <Grid celled container stackable reversed='mobile' columns={4}>
                  <Grid.Column width={2}>
                    <Image src={'img/' + object.id + '.png'} shape='circular' size='small'/>
                  </Grid.Column>
                  <Grid.Column width={13}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column floated='left' width={13}>
                            <Header as='h2'>Request</Header>

                            <Grid.Row>
                            <Label as='a'>
                                 <Icon name='certificate' />Address
                           </Label>
                           <span>{object.sc}</span>
                           </Grid.Row>


                            <Grid.Row>
                            <Label as='a'>
                                 <Icon name='angle double down' />From
                           </Label>
                           <span>{object.from}</span>
                           </Grid.Row>

                           <Grid.Row>
                           <Label as='a'>
                                <Icon name='file outline' />Type
                          </Label>
                          <span>{object.type}</span>
                          </Grid.Row>

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
