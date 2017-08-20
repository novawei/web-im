const React = require('react');
const ChatItem = require('./ChatItem');
const XMPPClient = require('../vendor/xmpp/xmppclient');
require('../resource/css/app.css');

class SingleChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgList: [props.msg]
    }
  }

  componentWillMount() {
    this.handlers = XMPPClient.getInstance().addHandlers([
      XMPPClient.buildHandler(XMPPClient.Type.MESSAGE, this.onMessage.bind(this))
    ]);
  }

  componentWillUnmount() {
    XMPPClient.getInstance().removeHandlers(this.handlers);
  }

  getPeerJid(msg) {
    let username = XMPPClient.getInstance().getUsername();
    let peerJid = null;
    if (msg.from.indexOf(username) < 0) {
      peerJid = msg.from;
    } else {
      peerJid = msg.to;
    }
    return peerJid;
  }

  onMessage(json) {
    let peerJid = this.getPeerJid(this.props.msg);
    if (peerJid == json.from || peerJid == json.to) {
      let msgList = this.state.msgList;
      msgList.push(json);
      this.setState({msgList: msgList});
    }
  }

  onKeyDown(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      let client = XMPPClient.getInstance();
      let toJid = this.getPeerJid(this.props.msg);
      let body = this.refs.textarea.value;
      let id = client.sendMessage(toJid, 'chat', body);
      // 个人消息，服务端不会发送回来
      let msg = {
        id: id, type: 'chat',
        from: client.getUserJid(),
        to: toJid,
        time: client.getCurrentTime(),
        body: {
          text: body
        }
      };
      this.onMessage(msg);
      this.refs.textarea.value = null;
    }
  }

  render() {
    let username = this.getPeerJid(this.props.msg);
    username = username.split('@')[0];
    return (
      <div className="right-cont">
        <div className="right">
          <div className="chat-detail-title">{username}</div>
          <div className="chat-detail-cont">
            <div className="chat-detail-list">
              {this.state.msgList.map((msg) =>
                <ChatItem key={msg.id} msg={msg}/>
              )}
            </div>
          </div>
          <div className="chat-detail-input">
            <textarea ref="textarea" onKeyDown={this.onKeyDown.bind(this)}></textarea>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = SingleChat;