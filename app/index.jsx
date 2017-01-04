import React from 'react';
import {render} from 'react-dom';
import BK_Menu from './components/menu.jsx';
import BK_Identity from './components/identity.jsx';

class BitKariero extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'identity',
      identity: {
        name: 'George Orwell',
        birthdate: '1903-06-25',
        email: 'george.orwell@minitrue.com',
        shortdesc: 'Novelist, essayist, journalist and critic.',
        longdesc: 'Best known for his dystopian novel Nineteen Eighty-Four\
        (published in 1949) and the allegorical novella Animal Farm (1945). His\
        non-fiction works, including The Road to Wigan Pier (1937), documenting\
        his experience of working class life in the north of England, and Homage\
        to Catalonia (1938), an account of his experiences in the Spanish Civil\
        War, are widely acclaimed, as are his essays on politics, literature,\
        language, and culture.',
      },

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
      </div>
    );
  }
}

render(<BitKariero/>, document.getElementById('root'));
