import React from 'react';
import {render} from 'react-dom';
import BK_Menu from './components/menu.jsx'

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
      activeTab: 'identity'
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
        <BK_Menu tabs={this.state.tabs} initialTab={this.state.activeTab} onTabChange={this.onTabChange} />
      </div>
    );
  }
}

render(<BitKariero/>, document.getElementById('root'));
