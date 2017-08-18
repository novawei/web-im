const React = require('react');
require('../resource/css/app.css');

class ChatItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let from = this.props.msg.from;
    from = from.substring(0, from.indexOf('@'));
    let now = new Date();
    now = `${now.getHours()}:${now.getMinutes()}`;
    return (
      <div className='chat-item'>
        <div className="chat-avatar"></div>
        <div className="chat-cont">
          <div className="chat-cont-top">
            <div className="chat-name">{from}</div>
            <div className="chat-time">{now}</div>
          </div>
          <div className="chat-cont-bottom">
            <div className="chat-content">{this.props.msg.body.text}</div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ChatItem;