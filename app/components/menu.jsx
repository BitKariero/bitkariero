import React from 'react';
import {render} from 'react-dom';
import { Menu, Icon, Label } from 'semantic-ui-react'

export default class BK_Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: props.initialTab
    }

    this.handleItemClick = this.handleItemClick.bind(this)
  }

  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
    this.props.onTabChange(this.state.activeItem);
  }

  render() {
    const { activeItem } = this.state;
    const { tabs } = this.props;

    console.log(activeItem);

    var parent = this;

    return (
      <Menu icon='labeled' widths={this.props.tabs.length}>
        {tabs.map(function(tab, i) {
          return (
            <Menu.Item
              name={tab.key}
              key={tab.key}
              active={activeItem === tab.key}
              onClick={parent.handleItemClick}
            >
              <Icon name={tab.icon} />
              {tab.label}
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }
}
