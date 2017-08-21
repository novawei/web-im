/**
 * Created by Nova on 2017/8/17.
 */
const React = require('react');
const XMPPClient = require('./vendor/xmpp/xmppclient');

const Navigation = require('./component/Navigation');
const ChatList = require('./component/ChatList');
const RoomList = require('./component/RoomList');
const SingleChat = require('./component/SingleChat');
const RoomChat = require('./component/RoomChat');

require('./resource/css/app.css');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.client = XMPPClient.getInstance();
    this.client.config('10.50.200.45', 'web-im');

    this.handlers = [];
    this.state = {
      username: 'admin',
      status: '未登录',
      selectedIndex: 0,
      roomList: [],
      chatList: []
    }
  }

  componentWillMount() {
    this.handlers = this.client.addHandlers([
      XMPPClient.buildHandler(XMPPClient.Type.CONNECT, this.onConnect.bind(this)),
      XMPPClient.buildHandler(XMPPClient.Type.IQ, this.onIQ.bind(this)),
      XMPPClient.buildHandler(XMPPClient.Type.PRESENCE, this.onPresence.bind(this)),
      XMPPClient.buildHandler(XMPPClient.Type.MESSAGE, this.onMessage.bind(this))
    ]);
    this.client.login('admin', 'admin');
  }

  componentWillUnmount() {
    this.client.disconnect();
    this.client.removeHandlers(this.handlers);
  }

  translateStatus(status) {
    const list = [
      '登录失败',
      '正在连接...',
      '连接失败',
      '正在登录...',
      '用户名或密码错误',
      '登录成功',
      '断开连接',
      '正在断开连接...',
      'ATTACHED',
      'REDIRECT',
      '连接超时'];
    return status < list.length ? list[status] : '未知状态';
  }

  onConnect(status) {
    console.log(status);
    if (status == XMPPClient.Status.SUCCESS) {
      // 请求用户的群组列表
      let json = {query: {xmlns: 'com:nfs:mucextend:room'}};
      this.client.sendIQ('get', null, json);
    }
  }

  onIQ(json) {
    if (json.query && json.query.xmlns == 'com:nfs:mucextend:room') {
      //请求房间列表返回result
      //{xmlns: "jabber:client", type: "result", id: "01b7ca9c-78d7-4b1e-8235-ab9f0692c034:sendIQ", to: "admin@10.50.200.45/web-im", query: {…}}
      // query:{xmlns: "com:nfs:mucextend:room", room: Array(2)}
      this.setState({...this.state, roomList: json.query.room});
    }
  }

  onMessage(json) {
    let chatList = [...this.state.chatList];
    let index = -1;
    for (let i = 0, len = chatList.length; i < len; i++) {
      let msg = chatList[i];
      if (msg.type == json.type) {
        if (msg.type == 'groupchat') {
          let roomJid = msg.from.split('/')[0];
          let fromJid = json.from.split('/')[0];
          if (roomJid == fromJid) {
            index = i;
            break;
          }
        } else if (msg.from == json.from) {
          index = i;
          break;
        }
      }
    }
    if (index >= 0) {
      chatList.splice(index, 1);
    }
    chatList.splice(0, 0, json);
    this.setState({...this.state, chatList: chatList});
  }

  onPresence(json) {

  }

  handleSelectIndex(index) {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  }

  handleSelectChat(msg) {
    this.setState({
      ...this.state,
      selectedChat: msg
    })
  }

  render() {
    let listComponent = null;
    let detailComponent = null;
    if (this.state.selectedIndex == 0) {
      listComponent = <ChatList chatList={this.state.chatList}
                                selectedChat={this.state.selectedChat}
                                onSelectChat={this.handleSelectChat.bind(this)}/>;
      if (this.state.selectedChat) {
        if (this.state.selectedChat.type == 'groupchat') {
          detailComponent = <RoomChat msg={this.state.selectedChat}/>
        } else {
          detailComponent = <SingleChat msg={this.state.selectedChat}/>
        }
      }
    } else if (this.state.selectedIndex == 1) {

    } else if (this.state.selectedIndex == 2) {
      listComponent = <RoomList roomList={this.state.roomList}/>
    }
    return (
      <div className="app">
        <Navigation
          username={this.state.username}
          selectedIndex={this.state.selectedIndex}
          onSelectIndex={this.handleSelectIndex.bind(this)}
        />
        {listComponent}
        {detailComponent}
      </div>
    )
  }
}

module.exports = App;
