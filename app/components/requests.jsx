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
              <Grid celled container stackable columns={2}>
                  <Grid.Column verticalAlign='middle' centered width={2}>
                    <Grid.Row>
                      <div className="address-icon" style={{backgroundImage: 'url(' + blockies.create({ seed:object.sc ,size: 8,scale: 16}).toDataURL()+')'}}>
                      </div>
                    </Grid.Row>
                  </Grid.Column>
                  <Grid.Column width={14}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column floated='left'>
                            <Header as='h2'>{'Request: ' + object.type.toLowerCase()}</Header>

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


                            <Grid.Row>
                            <Grid.Column width={2}>
                              <Label as='a'>
                                   <Icon name='angle double down' />From
                             </Label>
                           </Grid.Column>

                           <Grid.Column width={14}>
                            <span>{object.from}</span>
                           </Grid.Column>
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
