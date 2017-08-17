/**
 * Created by Nova on 2017/8/17.
 */
const React = require('react');
const XMPPClient = require('./vendor/strophe/xmppclient');

class App extends React.Component {
  constructor(props) {
    super(props);
    XMPPClient.getInstance().config('192.168.1.104', 'web-im');
    this.state = {
      username: 'admin',
      status: '未登录',
      roomList: [],
      msgList: []
    }
  }

  componentWillMount() {
    XMPPClient.getInstance().login('admin', 'admin');
  }

  componentWillUnmount() {
    //this.conn.disconnect();
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

  // onConnect(status) {
  //   this.setState({...this.state, status: this.translateStatus(status)});
  //   if (status == Strophe.Status.CONNECTED) {
  //     this.conn.addHandler(this.onIQ.bind(this), null, 'iq', null, null, null);
  //     this.conn.addHandler(this.onMessage.bind(this), null, 'message', null, null, null);
  //     this.conn.addHandler(this.onPresence.bind(this), null, 'presence', null, null, null);
  //     this.conn.sendPresence($pres(), null, null, 6000);
  //     this.conn.sendIQ($iq({type: 'get'}).c('query', {xmlns: 'com:nfs:mucextend:room'}));
  //     //connection.sendIQ($iq({type: 'get'}).c('query', {xmlns: 'com:nfs:mucextend:user', roomID: 1}));
  //     //connection.sendIQ($iq({type: 'get'}).c('query', {xmlns: 'com:nfs:msghistory:query', type: 'chat', peer: 'novawei', pageNum: 1, pageSize: 5}));
  //   }
  // }
  //
  // onIQ(element) {
  //   let query = element.getElementsByTagName("query");
  //   if (query && query.length > 0) {
  //     query = query[0];
  //     if (query.getAttribute("xmlns") == 'com:nfs:mucextend:room') {
  //       let elementList = query.getElementsByTagName("room");
  //       let roomList = [];
  //       for (let i = 0; i < elementList.length; i++) {
  //         let element = elementList[i];
  //         let room = {
  //           roomID: element.getAttribute('roomID'),
  //           name: element.getAttribute('name'),
  //           naturalName: element.getAttribute('naturalName'),
  //           description: element.getAttribute('description')
  //         };
  //         roomList.push(room);
  //       }
  //       this.setState({...this.state, roomList: roomList});
  //     }
  //   }
  //   return true;
  // }
  //
  // onMessage(element) {
  //   let body = element.getElementsByTagName('body');
  //   if (body && body.length > 0) {
  //     body = body[0];
  //     let msgList = [...this.state.msgList];
  //     let msg = {
  //       id: element.getAttribute('id'),
  //       from: element.getAttribute('from'),
  //       to: element.getAttribute('to'),
  //       type: element.getAttribute('type'),
  //       body: body.textContent
  //     }
  //     msgList.push(msg);
  //     this.setState({...this.state, msgList: msgList});
  //   }
  //   return true;
  // }
  //
  // onPresence(element) {
  //   console.log(element);
  //   return true;
  // }

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
