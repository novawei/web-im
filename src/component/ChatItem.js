const React = require('react');
require('../resource/css/app.css');

class ChatItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let from = this.props.msg.from.split('@')[0];
    let body = this.props.msg.body.text;
    if (this.props.msg.type == 'groupchat') {
      let username = this.props.msg.from.split('/')[1];
      body = `${username}:${body}`;
    }
    const getClassName = () => {
      if (this.props.selected) {
        return 'chat-list-item chat-list-item-select';
      } else {
        return 'chat-list-item'
      }
    };

    return (
      <div className={getClassName()} onClick={() => this.props.onSelect()}>
        <div className="chat-list-avatar"></div>
        <div className="chat-list-cont">
          <div className="chat-list-cont-top">
            <div className="chat-list-name">{from}</div>
            <div className="chat-list-time">{this.props.msg.time}</div>
          </div>
          <div className="chat-list-cont-bottom">
            {body}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ChatItem;