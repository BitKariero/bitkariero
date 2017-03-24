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
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateIdentity = this.updateIdentity.bind(this);
    this.updateReferences = this.updateReferences.bind(this);
    this.updateRequests = this.updateRequests.bind(this);
  }

  async componentWillMount() {
    await BK.init();
    await this.updateState();
  }

  async updateIdentity() {
    var id = placeholderId;
    if(BK.identityContract) {
      await BK.identityContract.info().then(BK.ipfs.get).then(info => {
        id = JSON.parse(info);
        this.setState({identity: id});
      });
    }
    this.setState({identity: id});
  }

  async updateReferences() {
    var records = [];
    this.setState({records: records});

    for (var i = 0, len = BK.myReferences.length; i < len; i++) {
      try {
      var ref = await BK.getReference(BK.myReferences[i].sc);
      console.log("updateReference – read ref: " + ref);
      if (ref && ref.length > 0) {
        var record = {};
        var parsed = null;

        try {
          parsed = JSON.parse(ref);
        } catch (err) {parsed = null;}

        if (parsed && typeof parsed != 'string') {
          record = parsed
        } else { record.content = ref; }
        
        record.sc = BK.myReferences[i].sc;
        record.from = BK.myReferences[i].from;
        record.type = 'Reference';
        record.fromid = await BK.getIdentityInfo(BK.getIdentity(record.from));

        records.push(record);
        this.setState({records: records});
      }    
    
        } catch(e) {console.log(e);}
    }
    
  }

  async updateRequests() {
    var requests = [];
    this.setState({requests: requests});

    for (var i = 0, len = BK.incomingRequests.length; i < len; i++) {
      try {
      var request = BK.incomingRequests[i];
      request['type'] = 'Reference';
      var from = request.from;
      request.fromid = await BK.getIdentityInfo(BK.getIdentity(from));
      requests.push(request);
      console.log(request);
      this.setState({requests: requests});
      } catch(err) {console.log(err)}
    }

    
  }
  
  async updateIdentityList() {
    BK.updateIdentityList();
  }

  async updateState() {
    console.log("Updating state.");
    await this.updateIdentity();
    await this.updateReferences();
    await this.updateRequests();
    await this.updateIdentityList();
    console.log("Records ->");
    console.log(this.state.records);
  }

  onTabChange(newTab) {
    this.setState({
      activeTab: newTab
    });

    this.updateState();
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
