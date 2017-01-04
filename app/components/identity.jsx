import React from 'react';
import {render} from 'react-dom';
import { Grid, Card, Header, Image, Segment, List, Icon, Label, Divider } from 'semantic-ui-react'
import { identityFields, identityDisplayOrder } from '../common.jsx';


export default class BK_Identity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: props.identity
    }
  }

  render() {
    const { identity } = this.props;

    return (
      <Grid container stackable reversed='mobile' columns={2}>
        <Grid.Column width={12}>
          <BK_IdentityEditable identity={identity} />
        </Grid.Column>

        <Grid.Column width={4}>
          <BK_IdentityCard identity={identity} />
        </Grid.Column>
      </Grid>
    )
  }
}

class BK_IdentityCard extends React.Component {
  render() {
    const { identity } = this.props;

    return (
      <div>
        <Card
          image='img/person.jpg'
          header={identity.name}
          meta={'Born ' + identity.birthdate}
          description={identity.shortdesc}
          id='bk-identity-card'
        />
      </div>
    )
  }
}

class BK_IdentityEditable extends React.Component {
  render() {
    const { identity } = this.props;

    return (
      <div>
        <Header as='h2' attached='top'>
          <Grid columns={2}>
            <Grid.Column width={2} verticalAlign='middle'>
              <Image shape='circular' src='img/person.jpg' id="bk-identity-small-picture"/>
            </Grid.Column>

            <Grid.Column width={14} verticalAlign='middle'>
              <Grid.Row>
                <Grid.Column>
                  <span>{identity.name}</span>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <span id="bk-identity-shortdesc">{identity.shortdesc}</span>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Header>

        <Segment attached>
          <List>
          { identityDisplayOrder.map(function(idField, i) {
            return (
              <div>
              { identity[idField] && !identityFields[idField].shownInHeader &&
                <div>
                  <List.Item>
                    <List.Content>
                      <Label>
                        <Icon name={identityFields[idField].icon} />
                        {identityFields[idField].label}
                      </Label>

                      { idField == 'longdesc' ?
                        <p className='bk-identity-field'>{identity[idField]}</p>
                                              :
                        <span className='bk-identity-field'>{identity[idField]}</span>
                      }
                    </List.Content>
                  </List.Item>
                  { i !== (identityDisplayOrder.length - 1) &&
                    <Divider />
                  }
                </div>
              }
            </div>
            )
          })}
          </List>
        </Segment>
      </div>
    )
  }
}
