import React from 'react';
import {render} from 'react-dom';
import { Grid, Card, Header, Image, Segment, List, Icon, Label, Divider, Button, Input, TextArea, Form } from 'semantic-ui-react';
import { identityFields, identityDisplayOrder, placeholderId } from '../common.jsx';

var serialize = require('form-serialize');

export default class BK_Identity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: props.identity,
      new: (false || this.props.new),
    }
    this.updateState = this.updateState.bind(this)
  }

   updateState() {
    this.setState({new: !this.state.new});
  }

  render() {
    const { identity } = this.props;

    return (
      <Grid container stackable reversed='mobile' columns={2}>
        <Grid.Column width={12}>
          { !this.state.new ?
              <BK_IdentityFull identity={identity} onChange={this.updateState} new={this.state.new}/>
                                :
              <BK_IdentityFullNew identity={placeholderId} onChange={this.updateState} new={this.state.new} />
          }
        </Grid.Column>

        <Grid.Column width={4}>
          {!this.state.new ?
          <BK_IdentityCard identity={identity} />
            :
          <div></div>
          }

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
      new: (false || this.props.new)
    };

    this.updateState = this.updateState.bind(this)
  }

   updateState() {
    this.props.onChange();
    this.setState({new: !this.state.new});
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

class BK_IdentityFullNew extends BK_IdentityFull {
  constructor(props) {
    super(props);
  }

  updateState() {
   this.props.onChange();
   this.setState({new: false});

   var form = document.querySelector('#create-id');
   var obj = serialize(form, { hash: true });
   
   BK.createId(obj);
  }

  render() {
    const { identity } = this.props;
    var parent = this;

    return (
      <div>
        <Form id='create-id' onsubmit='return false;'>
        <Header as='h2' attached='top'>
          <Grid columns={2}>
            <Grid.Column width={2} verticalAlign='middle'>
              <Image shape='circular' src='img/person.jpg' id="bk-identity-small-picture"/>
            </Grid.Column>

            <Grid.Column width={10} verticalAlign='middle'>
              <Grid.Row>
                <Grid.Column>
                  <Input name='name' className='bk-identity-name' defaultValue={identity.name} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                    <Input name='shortdesc' className="bk-identity-shortdesc" defaultValue={identity.shortdesc} />
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>

            <Grid.Column width={4}>
              <BK_EditUpdateButton new={parent.state.new} onChange={this.updateState} />
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
                        <TextArea name={idField}
                          className='bk-identity-field'
                          value={identity[idField]}
                        />
                        </div>
                                                         :
                        <Input name={idField} className='bk-identity-field' defaultValue={identity[idField]} />
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
        { !this.props.new ?
            <Button
              type='button'
              id='bk-identity-edit'
              compact secondary floated='right'
              content='Edit'
              onClick={this.handleClick}
            />
                               :
           <div>
           <Button
             type='button'
             id='bk-identity-update'
             compact positive floated='right'
             content='Create identity'
             onClick={this.handleClick}
           />
           <Button
             type='button'
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
