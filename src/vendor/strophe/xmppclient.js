/**
 * Created by Nova on 2017/8/17.
 */
import {Strophe, $iq, $pres, $msg} from './strophe';

class XMPPClient {

  static getInstance() {
    if (!XMPPClient.instance) {
      XMPPClient.instance = new XMPPClient();
    }
    return XMPPClient.instance;
  }

  constructor() {
    XMPPClient.Status = {
      UNKNOWN: 0,
      DOING: 1,
      SUCCESS: 2,
      FAILURE: 3
    };
    XMPPClient.HandlerType = {
      CONNECT: 'CONNECT',
      IQ: 'IQ',
      PRESENCE: 'PRESENCE',
      MESSAGE: 'MESSAGE'
    };

    this.info = {};
    this.state = {status: XMPPClient.Status.UNKNOWN};
    this.handlers = {};
  }

  config(domain, resource) {
    if (this.info.domain == domain && this.info.resource == resource) {
      return;
    }
    if (this.conn) {
      this.conn.disconnect();
    }
    this.state = {
      ...this.state, status: XMPPClient.Status.UNKNOWN,
      username: null, password: null
    };
    this.info = {...this.info, domain: domain, resource: resource};
    this.conn = new Strophe.Connection(`http://${domain}:7070/http-bind/`);
    // 添加回调处理
    this.conn.addHandler(this.onIQ.bind(this), null, 'iq', null, null, null);
    this.conn.addHandler(this.onMessage.bind(this), null, 'message', null, null, null);
    this.conn.addHandler(this.onPresence.bind(this), null, 'presence', null, null, null);
  }

  getStatus() {
    return this.state.status;
  }

  login(username, password) {
    this.state = {
      ...this.state, status: XMPPClient.Status.DOING,
      username: username, password: password
    };
    let jid = `${username}@192.168.1.104/${this.state.resource}`;
    this.conn.connect(jid, password, this.onConnect.bind(this));
  }

  logout() {
    this.conn.disconnect();
    this.state = {
      ...this.state, status: XMPPClient.Status.UNKNOWN,
      username: null, password: null
    };
  }

  /**
   * 添加回调
   * @param type    XMPPClient.HandlerType
   * @param callback
   * @returns {{type: *, callback: *}}
   */
  addHandler(type, callback) {
    let handler = {type: type, callback: callback};
    let handlers = this.handlers[type];
    if (!this.handlers[type]) {
      handlers = [];
      this.handlers[type]= handlers;
    }
    handlers.push(handler);
    return handler;
  }

  /**
   * 移除回调
   * @param handler
   */
  removeHandler(handler) {
    let handlers = this.handlers[handler.type];
    if (handlers) {
      let index = handlers.indexOf(handler);
      if (index >=0 ) {
        handlers.slice(index, 1);
      }
    }
  }

  /**
   * 根据类型，运行回到，传递参数
   * @param type
   * @param param
   */
  runHandlers(type, param) {
    let handlers = this.handlers[type];
    if (handlers) {
      for (let i = 0, len = handlers.length; i < len; i++) {
        let handler = handlers[i];
        handler.callback(param);
      }
    }
  }

  onConnect(status) {
    switch (status) {
      case Strophe.Status.CONNECTING:
      case Strophe.Status.AUTHENTICATING:
        this.state = {...this.state, status: XMPPClient.Status.DOING};
        break;
      case Strophe.Status.CONNFAIL:
      case Strophe.Status.AUTHFAIL:
      case Strophe.Status.ERROR:
      case Strophe.Status.CONNTIMEOUT:
        this.state = {...this.state, status: XMPPClient.Status.FAILURE};
        break;
      case Strophe.Status.CONNECTED:
        this.state = {...this.state, status: XMPPClient.Status.SUCCESS};
        break;
      default:
        this.state = {...this.state, status: XMPPClient.Status.UNKNOWN};
        break;
    }
    this.runHandlers(XMPPClient.HandlerType.CONNECT, this.state.status);
  }

  onIQ(element) {
    this.runHandlers(XMPPClient.HandlerType.IQ, element);
    return true;
  }

  onPresence(element) {
    this.runHandlers(XMPPClient.HandlerType.PRESENCE, element);
    return true;
  }

  onMessage(element) {
    this.runHandlers(XMPPClient.HandlerType.MESSAGE, element);
    return true;
  }
}

module.exports = XMPPClient;
