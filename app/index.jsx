import React from 'react';
import {render} from 'react-dom';
import BK_Menu from './components/menu.jsx';
import BK_Identity from './components/identity.jsx';
import BK_Records from './components/records.jsx';

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

      records: [
        {id: 'GOOGLE', location: 'London, United Kingdom', company: 'Google Inc', recordType: 'Reference', role: 'Chief Software Engineer - Tushar Roy', date: '24/06/15', time: 'UTC 13:23', content: 'I would like to recommend Mr. Happy Singh as a candidate for a position with your organization. In his position as Junior Software Developer, Happy was employed in our office from June 2014 - December 2014. Mr. Happy did an excellent job in this position and was an asset to our organization during her tenure with the office. '},
        {id: 'BT', location: 'London, United Kingdom', company: 'British Telecommunication PLC', recordType: 'Reference', role: 'Systems Engineer - Bunty Singh', date: '10/05/14', time: 'UTC: 12:35', content: 'I was very impressed with Mr. Happy Singh’s enthusiasm, debugging skills, criticial thinking skills and his acumen in Unix when I hired him. During the time Happy reported to me (I have since moved on to a different department), he has consistently demonstrated all of these qualities and more, and I heartily endorse him for any Systems Engineering position.'},
        {id: 'CISCO', location: 'Feltham, London, United Kingdom', company: 'Cisco Inc', recordType: 'Reference', role: 'Network Administrator - Tinku Greval', date: '01/02/14', time: 'UTC: 07:25', content: 'Mr. Happy is reliable, dedicated and an alert Administator. Hus ability to remain patient when seeing the an almost impossibly recoverable solution is unparalleled, and it is because of his excellence in this area that I repeatedly asked her to mentor new employees in the administation. Mr. Happy multitasks effectively and is able to handle maintanance while keeping the servers up. '},
        {id: 'FACEBOOK', location: 'Menlo Park, CA, USA', company: 'Facebook Inc', recordType: 'Reference', role: 'Internship Coordinator - Mr. Paul Smith', date: '01/02/13', time: 'UTC: 08:26', content: 'Very few people have the capacity and courage to invest themselves in the company that they are working for. Mr. Happy Singh is an exception. Since the day he joined Facebook Inc. as a junior software engineer, we have considered him to be our asset. His productivity began shortly after he joined and went through an initial training phase.'},
        {id: 'UCL', location: 'London, United Kingdom', company: 'University College London, University of London', recordType: 'Recommendation', role: 'Professor Mathematics -Mr. Robin Hirsch', date: '20/03/12', time: 'UTC: 13:14', content: 'Mr. Happy Singh has asked me to write a letter of recommendation to accompany his application for PhD program in Computer Science at your university. I am pleased to provide a reference for such a gifted student who is at the very top of his highly competitive and highly talented class. I would like to stress particularly  his thirst for knowledge which is intensified by Happys’s strong determination, and his deep interest in science. Ivan is an outstanding researcher and person.'},
        {id: 'SABIS', location: 'Lahore, Pakistan', company: 'SABIS International School of Choueifat', recordType: 'Teacher Recommendation', role: 'Instructor Mathematics -Mr. Rumi Jalaluddin', date: '19/02/11 UTC', time: '12:24', content: 'I have taught Mr. Happy Singh Mathematics for four years in the CIE Cambridge Ordinary and College Board Advanced Placement Examinations. Being his teacher I can vouch that he is one of the most brilliant and conscientious student that I have encountered in my entire teaching career. He has a very comprehensive understanding of the subjects and has excellent analytical skills.'},
        {id: 'SABIS', location: 'Lahore, Pakistan', company: 'SABIS International School of Choueifat', recordType: 'Peer Recommendation', role: 'Peer - Bubbly Shah', date: '13/02/11', time: 'UTC: 10:52', content: 'We both have grown in the ten years we have known each other. We went through some of the same difficulties and challenges at the same time; growing up, adapting to high school, relationships, the SATs, and of course, wearing braces and programming all day in the Computer Lab while everyone was dating as we both were nerds and will remain nerds.'},
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
      </div>
    );
  }
}

render(<BitKariero/>, document.getElementById('root'));
