import React from 'react';
import {render} from 'react-dom';
import { Grid, Card, Icon, Input } from 'semantic-ui-react'

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
      <Grid stackable columns={2}>
        <Grid.Column width={4}>
          <BK_IdentityCard identity={identity} />
        </Grid.Column>

        <Grid.Column width={12}>
          <BK_IdentityEditable identity={identity} />
        </Grid.Column>
      </Grid>
    )
  }
}

class BK_IdentityCard extends React.Component {
  render() {
    const { identity } = this.props;

    return (
      <Card
        image='img/person.jpg'
        header={identity.name}
        meta={'Born ' + identity.birthdate}
        description={identity.desc}
      />
    )
  }
}

class BK_IdentityEditable extends React.Component {
  render() {
    const { identity } = this.props;

    return (
      <div>
        <h1>{identity.name}</h1>
        <h2>Born {identity.birthdate}</h2>
        <h2>{identity.desc}</h2>
      </div>
    )
  }
}
