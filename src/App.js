/**
 * Created by Nova on 2017/8/17.
 */
const React = require('react');
const XMPPClient = require('./vendor/strophe/xmppclient');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.client = XMPPClient.getInstance();
    this.client.config('192.168.1.104', 'web-im');

    this.handlers = [];
    this.state = {
      username: 'admin',
      status: '未登录',
      roomList: [],
      msgList: []
    }
  }

  componentWillMount() {
    let handler;
    handler = this.client.addHandler(XMPPClient.HandlerType.CONNECT, this.onConnect);
    this.handlers.push(handler);
    handler = this.client.addHandler(XMPPClient.HandlerType.IQ, this.onIQ);
    this.handlers.push(handler);
    handler = this.client.addHandler(XMPPClient.HandlerType.PRESENCE, this.onPresence);
    this.handlers.push(handler);
    handler = this.client.addHandler(XMPPClient.HandlerType.MESSAGE, this.onMessage);
    this.handlers.push(handler);

    this.client.login('admin', 'admin');
  }

  componentWillUnmount() {
    this.client.disconnect();

    for (let i = 0, len = this.handlers.length; i < len; i++) {
      this.client.removeHandler(this.handlers[i]);
    }
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
      this.client.conn.sendPresence($pres());
    }
  }

  onIQ(element) {
    console.log(element);
    // let query = element.getElementsByTagName("query");
    // if (query && query.length > 0) {
    //   query = query[0];
    //   if (query.getAttribute("xmlns") == 'com:nfs:mucextend:room') {
    //     let elementList = query.getElementsByTagName("room");
    //     let roomList = [];
    //     for (let i = 0; i < elementList.length; i++) {
    //       let element = elementList[i];
    //       let room = {
    //         roomID: element.getAttribute('roomID'),
    //         name: element.getAttribute('name'),
    //         naturalName: element.getAttribute('naturalName'),
    //         description: element.getAttribute('description')
    //       };
    //       roomList.push(room);
    //     }
    //     this.setState({...this.state, roomList: roomList});
    //   }
    // }
    // return true;
  }

  onMessage(element) {
    console.log(element);
    // let body = element.getElementsByTagName('body');
    // if (body && body.length > 0) {
    //   body = body[0];
    //   let msgList = [...this.state.msgList];
    //   let msg = {
    //     id: element.getAttribute('id'),
    //     from: element.getAttribute('from'),
    //     to: element.getAttribute('to'),
    //     type: element.getAttribute('type'),
    //     body: body.textContent
    //   }
    //   msgList.push(msg);
    //   this.setState({...this.state, msgList: msgList});
    // }
    // return true;
  }

  onPresence(element) {
    console.log(element);
  }

  render() {
    return (
      <div>
        <div>Hello {this.state.username}!</div>
        <div>状态：{this.state.status}</div>
        <div>
          <div>我的群组({this.state.roomList.length})</div>
          <ul>
            {this.state.roomList.map(room => (
              <li key={room.roomID}>{room.naturalName}</li>
            ))}
          </ul>
        </div>
        <div>
          <div>消息列表({this.state.msgList.length})</div>
          <ul>
            {this.state.msgList.map(msg => (
              <li key={msg.id}>{msg.from}: {msg.body}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

module.exports = App;
