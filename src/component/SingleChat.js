const React = require('react');
const MsgItem = require('./MsgItem');
const XMPPClient = require('../vendor/xmpp/xmppclient');
require('../resource/css/app.css');

class SingleChat extends React.Component {
  constructor(props) {
    super(props);
    this.previousTime = null;
    this.state = {
      msgList: []
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
    let elem = document.getElementById('container');
    setTimeout(function () {
      elem.scrollTop = elem.scrollHeight;
    }, 100);
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
    let peerName = this.getPeerJid(this.props.msg);
    peerName = peerName.split('@')[0];

    const getSelected = (msg) => {
      let fromName = msg.from.split('@')[0];
      let username = XMPPClient.getInstance().getUsername();
      let selected = false;
      if (fromName == username) {
        selected = true;
      }
      return selected;
    };

    this.previousTime = null;
    const getMsgItem = (msg) => {
      let component = <MsgItem key={msg.id}
                               previousTime={this.previousTime}
                               msg={msg}
                               selected={getSelected(msg)}/>
      this.previousTime = msg.time;
      return component;
    };

    return (
      <div className="right-cont">
        <div className="right">
          <div className="chat-detail-title">{peerName}</div>
          <div className="chat-detail-cont" id="container">
            <div className="chat-detail-list">
              {this.state.msgList.map((msg) => getMsgItem(msg))}
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