/**
 * Created by Nova on 2017/8/18.
 */
const React = require('react');

class ChatList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>消息列表</div>
        <div>
          <ul>
            {this.props.chatList.map((msg) =>
              <li key={msg.id}>{msg.from}:{msg.body.text}</li>
            )}
          </ul>
        </div>
      </div>
    )
  }
}

module.exports = ChatList;