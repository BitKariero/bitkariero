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
     <Icon name='check circle' circular />
     <Header.Content>
       Resumes
     </Header.Content>
     </Header>
 
      </div>
    );
  }
}
