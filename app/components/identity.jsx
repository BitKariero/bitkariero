import React from 'react';
import {render} from 'react-dom';
import { Grid, Card, Header, Image, Segment, List, Icon, Label, Divider, Button, Input, TextArea, Form } from 'semantic-ui-react';
import { identityFields, identityDisplayOrder } from '../common.jsx';


export default class BK_Identity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: props.identity,
      editing: false,
    }
    this.toggleEditState = this.toggleEditState.bind(this)
  }

  toggleEditState() {
    this.setState({editing: !this.state.editing});
  }

  render() {
    const { identity } = this.props;

    return (
      <Grid container stackable reversed='mobile' columns={2}>
        <Grid.Column width={12}>
          { !this.state.editing ?
              <BK_IdentityFull identity={identity} onChange={this.toggleEditState} editing={this.state.editing} />
                                :
              <BK_IdentityFullEdit identity={identity} onChange={this.toggleEditState} editing={this.state.editing} />
          }
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

class BK_IdentityFull extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: (false || this.props.editing)
    };

    this.toggleEditState = this.toggleEditState.bind(this)
  }

  toggleEditState() {
    this.props.onChange();
    this.setState({editing: !this.state.editing});
  }

  render() {
    const { identity } = this.props;
    var parent = this;

    return (
      <div>
        <Header as='h2' attached='top'>
          <Grid columns={2}>
            <Grid.Column width={2} verticalAlign='middle'>
              <Image shape='circular' src='img/person.jpg' id="bk-identity-small-picture"/>
            </Grid.Column>

            <Grid.Column width={10} verticalAlign='middle'>
              <Grid.Row>
                <Grid.Column>
                  <span className='bk-identity-name'>{identity.name}</span>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                    <span className="bk-identity-shortdesc">{identity.shortdesc}</span>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>

            <Grid.Column width={4}>
              <BK_EditUpdateButton editing={parent.state.editing} onChange={this.toggleEditState} />
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

                      { identityFields[idField].longForm ?
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

class BK_IdentityFullEdit extends BK_IdentityFull {
  constructor(props) {
    super(props);
  }

  render() {
    const { identity } = this.props;
    var parent = this;

    return (
      <div>
        <Form action='a.php' method='post'>
        <Header as='h2' attached='top'>
          <Grid columns={2}>
            <Grid.Column width={2} verticalAlign='middle'>
              <Image shape='circular' src='img/person.jpg' id="bk-identity-small-picture"/>
            </Grid.Column>

            <Grid.Column width={10} verticalAlign='middle'>
              <Grid.Row>
                <Grid.Column>
                  <Input className='bk-identity-name' defaultValue={identity.name} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                    <Input className="bk-identity-shortdesc" defaultValue={identity.shortdesc} />
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>

            <Grid.Column width={4}>
              <BK_EditUpdateButton editing={parent.state.editing} onChange={this.toggleEditState} />
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

                      { identityFields[idField].longForm ?
                        <div className='bk-identity-field'>
                        <TextArea
                          className='bk-identity-field'
                          value={identity[idField]}
                        />
                        </div>
                                                         :
                        <Input className='bk-identity-field' defaultValue={identity[idField]} />
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
        </Form>
      </div>

    );
  }
}


class BK_EditUpdateButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e, element) {
    this.props.onChange();
  }

  render() {
    return (
      <div>
        { !this.props.editing ?
            <Button
              id='bk-identity-edit'
              compact secondary floated='right'
              content='Edit'
              onClick={this.handleClick}
            />
                               :
           <div>
           <Button
             id='bk-identity-update'
             type='submit'
             compact positive floated='right'
             content='Update'
           />
           <Button
             id='bk-identity-cancel'
             compact negative floated='right'
             content='Cancel'
             onClick={this.handleClick}
           />
           </div>
        }
      </div>
    )
  }
}
