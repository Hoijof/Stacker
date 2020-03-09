import React, { Component, Fragment } from "react";
import proptypes from "prop-types";

import "./LateralMenu.scss";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";

import cx from "classname";

export default class LateralMenu extends Component {
  static proptypes = {
    tags: proptypes.array,
    filterByTag: proptypes.func,
    settings: proptypes.object,
    saveSettings: proptypes.func,
    burn: proptypes.func
  };

  static defaultProps = {
    tags: ["testTag", "testTag2"],
    filterByTag: tag => {
      console.log(`Filtering by ${tag}`);
    }
  };

  constructor() {
    super();

    this.state = {
      expanded: true
    };

    this.toggleSettings = this.toggleSettings.bind(this);
    this.toggleCardType = this.toggleCardType.bind(this);
  }

  renderTags(tags) {
    const renderedTags = [];

    tags.forEach(tag => {
      renderedTags.push(
        <div
          className="Tag"
          key={tag}
          onClick={this.props.filterByTag.bind(this, tag)}
        >
          {tag}
        </div>
      );
    });

    return renderedTags;
  }

  toggleSettings() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  toggleCardType() {
    this.props.saveSettings({
      type: this.props.settings.type ? 0 : 1
    });
  }

  render() {
    const { tags, settings } = this.props;
    const { expanded } = this.state;

    console.log(settings);

    const classNames = cx({
      LateralMenu: true,
      expanded
    });

    return (
      <menu className={classNames}>
        {!expanded && this.renderTags(tags)}
        <div className="Settings" onClick={this.toggleSettings}>
          Settings
        </div>
        {expanded && (
          <div>
            <div className="Setting">
              <FormControlLabel
                control={
                  <Switch
                    checked={!settings.type}
                    onChange={this.toggleCardType}
                    color="primary"
                  />
                }
                label="Golden Ratio Cards"
              />
            </div>
            <div className="Setting">
              <Button
                onClick={this.props.burn}
                variant="contained"
                color="secondary"
              >
                Hard Reset :D
              </Button>
            </div>
          </div>
        )}
      </menu>
    );
  }
}
