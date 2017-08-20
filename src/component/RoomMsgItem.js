const React = require('react');
require('../resource/css/app.css');

class RoomMsgItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let from = this.props.msg.from.split('/')[1];

    const getClassName = () => {
      if (this.props.selected) {
        return 'msg-list-item msg-list-item-select';
      } else {
        return 'msg-list-item'
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
          <div className="room-msg-list-cont">
            <div className="msg-list-cont-top">
              <div className="msg-list-name">{from}</div>
            </div>
            <div className="msg-list-cont-bottom">
              <div className="msg-list-content">
                {this.props.msg.body.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = RoomMsgItem;