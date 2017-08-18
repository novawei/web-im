/**
 * Created by Nova on 2017/8/18.
 */
const React = require('react');
const ChatItem = require('./ChatItem');
require('../resource/css/app.css');

class ChatList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="middle">
        {this.props.chatList.map((msg) =>
          <ChatItem key={msg.id} msg={msg}/>
        )}
      </div>
    )
  }
}

module.exports = ChatList;