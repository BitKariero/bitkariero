import React from 'react';
import {render} from 'react-dom';
import BK_Menu from './components/menu.jsx';
import BK_Identity from './components/identity.jsx';

class BitKariero extends React.Component {
  constructor() {
    super();
    this.state = {
      tabs: [
        {key: 'identity', label: 'Identity', icon: 'user'},
        {key: 'records', label: 'Records', icon: 'file text outline'},
        {key: 'approval-queue', label: 'Approval queue', icon: 'hourglass outline'},
        {key: 'resume', label: 'Résumé', icon: 'signup'}
      ],
      activeTab: 'identity',

      identity: {name: 'George Orwell', birthdate: '1903-06-25', desc: 'Novelist, essayist, journalist and critic.'}
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(newTab) {
    this.setState({
      activeTab: newTab
    });
  }

  render () {
    return (
      <div>
        <BK_Menu tabs={this.state.tabs} activeTab={this.state.activeTab} onChange={this.onTabChange} />

        { this.state.activeTab == 'identity' &&
          <BK_Identity identity={this.state.identity}/>
        }
      </div>
    );
  }
}

render(<BitKariero/>, document.getElementById('root'));
