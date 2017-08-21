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
      XMPPClient.buildHandler(XMPPClient.Type.IQ, this.onIQ.bind(this)),
      XMPPClient.buildHandler(XMPPClient.Type.MESSAGE, this.onMessage.bind(this)),
    ]);
    // 获取历史消息
    let peer = this.getPeerJid(this.props.msg).split('@')[0];
    let json = {query: {xmlns: 'com:nfs:msghistory:query', type: 'chat', peer: peer, pageNum: 1, pageSize: 5}};
    XMPPClient.getInstance().sendIQ('get', null, json);
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

  onIQ(json) {
    if (json.type == 'result'
      && json.query
      && json.query.type == 'chat'
      && json.query.xmlns == 'com:nfs:msghistory:query') {
      let msgList = [...json.query.message];
      msgList = msgList.reverse();
      for (let msg of msgList) {
        msg.time = XMPPClient.getTime(new Date(msg.stamp));
        this.onMessage(msg);
      }
    }
  }

  onMessage(json) {
    let peerJid = this.getPeerJid(this.props.msg);
    if (peerJid == json.from
      || peerJid == json.to
      || peerJid.indexOf(json.from) >= 0
      || peerJid.indexOf(json.to) >= 0) {
      let msgList = this.state.msgList;
      msgList.push(json);
      this.setState({msgList: msgList});
      let elem = document.getElementById('container');
      setTimeout(function () {
        elem.scrollTop = elem.scrollHeight;
      }, 100);
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
        time: XMPPClient.getCurrentTime(),
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