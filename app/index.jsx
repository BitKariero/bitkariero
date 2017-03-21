import React from 'react';
import {render} from 'react-dom';
import BK_Menu from './components/menu.jsx';
import BK_Identity from './components/identity.jsx';
import BK_Records from './components/records.jsx';
import BK_Requests from './components/requests.jsx';
import BK_Resume from './components/resume.jsx';
import { placeholderId } from './common.jsx';


class BitKariero extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'identity',
      records: [
        {id: 'PLACEHOLDER', location: 'London, United Kingdom', company: 'Google Inc', recordType: 'Reference', role: 'Chief Software Engineer - Tushar Roy', date: '24/06/15', time: 'UTC 13:23', content: 'I would like to recommend Mr. Happy Singh as a candidate for a position with your organization. In his position as Junior Software Developer, Happy was employed in our office from June 2014 - December 2014. Mr. Happy did an excellent job in this position and was an asset to our organization during her tenure with the office. '}
      ],
      requests: [
        {id: 'PH', location: '77 Massachusetts Ave, Cambridge, MA 02139, USA', company: 'Massachusetts Institute of Technology', recordType: 'MSc Computer Science', role: 'Department of Admissions', date: '20/07/17', time: 'UTC 15:43'}
      ],
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  async componentWillMount() {
    await BK.init();

    if(BK.identityContract) {
      await BK.identityContract.info().then(BK.ipfs.get).then(info => {
        var id = JSON.parse(info);
        this.setState({identity: id});
      });
    }
    else {
      this.setState({identity: placeholderId});
    }
  }

  onTabChange(newTab) {
    this.setState({
      activeTab: newTab
    });
  }

  render () {
    if(!this.state['identity']) {
      return false;
    }

    return (
      <div>
        <BK_Menu
          activeTab={this.state.activeTab}
          onChange={this.onTabChange}
        />

        { this.state.activeTab == 'identity' &&
            <BK_Identity identity={this.state.identity} new={this.state.identity == placeholderId}/>
        }

        { this.state.activeTab == 'records' &&
          <BK_Records records={this.state.records}/>
        }
        { this.state.activeTab == 'requests' &&
          <BK_Requests requests={this.state.requests}/>
        }
        { this.state.activeTab == 'resume' &&
          <BK_Resume/>
        }
      </div>
    );
  }
}

render(<BitKariero/>, document.getElementById('root'));
