const React = require('react');
require('../resource/css/app.css');

class MsgItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const getClassName = () => {
      if (this.props.selected) {
        return 'msg-list-item msg-list-item-select';
      } else {
        return 'msg-list-item'
      }
    };
    const getContentClassName = () => {
      if (this.props.selected) {
        return 'msg-list-content msg-list-content-select';
      } else {
        return 'msg-list-content'
      }
    };

    let timeComponent = null;
    if (!this.props.previousTime
      || this.props.previousTime != this.props.msg.time) {
      timeComponent = <div className="msg-list-item-time">{this.props.msg.time}</div>
    }

    return (
      <div className="msg-list-out-cont">
        {timeComponent}
        <div className={getClassName()}>
          <div className="msg-list-avatar"></div>
          <div className="msg-list-cont">
            <div className={getContentClassName()}>
              {this.props.msg.body.text}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = MsgItem;