import React from 'react';
import {render} from 'react-dom';
import BK_Menu from './components/menu.jsx';
import BK_Identity from './components/identity.jsx';
import BK_Records from './components/records.jsx';
import BK_Requests from './components/requests.jsx';

class BitKariero extends React.Component {
  constructor() {
    super();
    BK.init();
    this.state = {
      activeTab: 'identity',
      identity: {
        name: 'George Orwell',
        birthdate: '1903-06-25',
        email: 'george.orwell@minitrue.com',
        shortdesc: 'Novelist, essayist, journalist and critic.',
        longdesc: 'Best known for his dystopian novel Nineteen Eighty-Four (published in 1949) and the allegorical novella Animal Farm (1945). His non-fiction works, including The Road to Wigan Pier (1937), documenting his experience of working class life in the north of England, and Homage to Catalonia (1938), an account of his experiences in the Spanish Civil War, are widely acclaimed, as are his essays on politics, literature, language, and culture.',
      },

      records: [
        {id: 'PLACEHOLDER', location: 'London, United Kingdom', company: 'Google Inc', recordType: 'Reference', role: 'Chief Software Engineer - Tushar Roy', date: '24/06/15', time: 'UTC 13:23', content: 'I would like to recommend Mr. Happy Singh as a candidate for a position with your organization. In his position as Junior Software Developer, Happy was employed in our office from June 2014 - December 2014. Mr. Happy did an excellent job in this position and was an asset to our organization during her tenure with the office. '}
      ],
      requests: [
        {id: 'PH', location: '77 Massachusetts Ave, Cambridge, MA 02139, USA', company: 'Massachusetts Institute of Technology', recordType: 'MSc Computer Science', role: 'Department of Admissions', date: '20/07/17', time: 'UTC 15:43'}
      ],
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
        <BK_Menu
          activeTab={this.state.activeTab}
          onChange={this.onTabChange}
        />

        { this.state.activeTab == 'identity' &&
          <BK_Identity identity={this.state.identity}/>
        }

        { this.state.activeTab == 'records' &&
          <BK_Records records={this.state.records}/>
        }
        { this.state.activeTab == 'requests' &&
          <BK_Requests requests={this.state.requests}/>
        }
      </div>
    );
  }
}

render(<BitKariero/>, document.getElementById('root'));
