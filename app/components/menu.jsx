import React from 'react';
import {render} from 'react-dom';
import { Menu, Icon, Label} from 'semantic-ui-react';
import BK_RequestButton from './request-button.jsx';
import { tabs } from '../common.jsx';


export default class BK_Menu extends React.Component {
  constructor(props) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this)
  }

  handleItemClick(e, { name }) {
    this.props.onChange(name);
  }

  render() {
    const { activeTab } = this.props;

    var parent = this;

    return (
      <Menu stackable fluid icon='labeled' widths={1 + tabs.length + 1}>
        <Menu.Item>
          <img src='img/logo-large.png' id='bk-menu-logo' />
        </Menu.Item>

        {tabs.map(function(tab, i) {
          return (
            <Menu.Item
              name={tab.key}
              key={tab.key}
              active={activeTab === tab.key}
              onClick={parent.handleItemClick}
            >
              <Icon name={tab.icon} />
              {tab.label}
            </Menu.Item>
          )
        })}

        <Menu.Item>
          <BK_RequestButton />
        </Menu.Item>
      </Menu>
    )
  }
}
