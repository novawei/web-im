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

  handleSelect(msg) {
    this.props.onSelectChat(msg);
  }

  render() {
    const getSelected = (msg) => {
      let selected = false;
      if (this.props.selectedChat) {
        if (this.props.selectedChat.from == msg.from) {
          selected = true;
        }
      }
      return selected;
    };
    return (
      <div className="middle-cont">
        <div className="middle">
          {this.props.chatList.map((msg, idx, array) => (
            <ChatItem key={msg.id}
                      selected={getSelected(msg)}
                      msg={msg}
                      onSelect={() => this.handleSelect(msg)}/>
          ))}
        </div>
      </div>
    )
  }
}

module.exports = ChatList;