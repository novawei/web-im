const React = require('react');
const RoomMsgItem = require('./RoomMsgItem');
const XMPPClient = require('../vendor/xmpp/xmppclient');
require('../resource/css/app.css');

class RoomChat extends React.Component {
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
    let roomJid = this.props.msg.from.split('/')[0];
    roomJid = `${roomJid}/${XMPPClient.getInstance().getUsername()}`;
    /**
     * MUC ROOM
     * <x xmlns='http://jabber.org/protocol/muc'>
     *   <history maxchars='0'/>
     * </x>
     */
    let json = {
      x: {
        xmlns: 'http://jabber.org/protocol/muc',
        history: {
          maxchars: '0'
        }
      }
    };
    XMPPClient.getInstance().sendPresence(roomJid, json);
  }

  componentWillUnmount() {
    XMPPClient.getInstance().removeHandlers(this.handlers);
  }

  onMessage(json) {
    let roomJid = this.props.msg.from.split('/')[0];
    let fromJid = json.from.split('/')[0];
    if (roomJid == fromJid) {
      let msgList = this.state.msgList;
      msgList.push(json);
      this.setState({msgList: msgList});
    }
  }

  onKeyDown(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      let toJid = this.props.msg.from.split('/')[0];
      let body = this.refs.textarea.value;
      XMPPClient.getInstance().sendMessage(toJid, 'groupchat', body);
      this.refs.textarea.value = null;
    }
  }

  render() {
    let roomName = this.props.msg.from.split('@')[0];
    const getSelected = (msg) => {
      let selected = false;
      // if (this.props.selectedChat) {
      //   if (this.props.selectedChat.from == msg.from) {
      //     selected = true;
      //   }
      // }
      return selected;
    };

    this.previousTime = null;
    const getMsgItem = (msg) => {
      let component = <RoomMsgItem key={msg.id}
                                   previousTime={this.previousTime}
                                   msg={msg}
                                   selected={getSelected(msg)}/>
      this.previousTime = msg.time;
      return component;
    };

    return (
      <div className="right-cont">
        <div className="right">
          <div className="chat-detail-title">{roomName}</div>
          <div className="chat-detail-cont">
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

module.exports = RoomChat;