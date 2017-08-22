/**
 * Created by Nova on 2017/8/17.
 */
import {Strophe, $iq, $pres, $msg} from './lib/strophe';

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
    XMPPClient.Type = {
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
    this.conn.addHandler(this._onIQ.bind(this), null, 'iq', null, null, null);
    this.conn.addHandler(this._onMessage.bind(this), null, 'message', null, null, null);
    this.conn.addHandler(this._onPresence.bind(this), null, 'presence', null, null, null);
  }

  getStatus() {
    return this.state.status;
  }

  getUsername() {
    return this.state.username;
  }

  getUserJid() {
    return `${this.state.username}@${this.info.domain}/${this.info.resource}`;
  }

  login(username, password) {
    this.state = {
      ...this.state, status: XMPPClient.Status.DOING,
      username: username, password: password
    };
    let jid = `${username}@${this.info.domain}/${this.info.resource}`;
    this.conn.connect(jid, password, this._onConnect.bind(this));
  }

  logout() {
    this.conn.disconnect();
    this.state = {
      ...this.state, status: XMPPClient.Status.UNKNOWN,
      username: null, password: null
    };
  }

  sendPresence(toJid) {
    return this.sendPresence(toJid, null);
  }

  sendPresence(toJid, json) {
    let pres = toJid ? $pres({to: toJid}) : $pres();
    if (json) {
      this._convertJSONToXML(pres, json);
    }
    return this.conn.sendPresence(pres, null, null, null);
  }

  sendMessage(toJid, type, text) {
    let id = this.conn.getUniqueId();
    let msg = $msg({to: toJid, type: type, id: id}).c('body', null, text);
    this.conn.send(msg);
    return id;
  }

  /**
   * json格式如下，最外层必须是map，否则无法找到tag
   * {query: {xmlns: 'com:nfs:msghistory:query', type: 'chat', peer: 'novawei', pageNum: 1, pageSize: 5}};
   * {item: [{id: 1}, {id: 2}]}
   */
  sendIQ(type, toJid, json) {
    let iq = toJid ? $iq({type: type, to: toJid}) : $iq({type: type});
    this._convertJSONToXML(iq, json);
    console.log(iq);
    return this.conn.sendIQ(iq, null, null, null);
  }

  static buildHandler(type, callback) {
    return {type: type, callback: callback};
  }

  /**
   * 添加回调
   * @param handlers
   * @returns {*}
   */
  addHandlers(handlers) {
    for (let handler of handlers) {
      this.addHandler(handler);
    }
    return handlers;
  }

  /**
   * 添加回调
   * @param type    XMPPClient.HandlerType
   * @param callback
   * @returns {{type: *, callback: *}}
   */
  addHandler(handler) {
    let handlers = this.handlers[handler.type];
    if (!this.handlers[handler.type]) {
      handlers = [];
      this.handlers[handler.type]= handlers;
    }
    handlers.push(handler);
    return handler;
  }

  /**
   * 移除回调
   * @param handlers
   */
  removeHandlers(handlers) {
    for (let handler of handlers) {
      this.removeHandler(handler);
    }
  }

  /**
   * 移除回调
   * @param handler
   */
  removeHandler(handler) {
    let handlers = this.handlers[handler.type];
    if (handlers) {
      let index = handlers.indexOf(handler);
      if (index >= 0) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 根据类型，运行回到，传递参数
   * @param type
   * @param param
   */
  _runHandlers(type, param) {
    let handlers = this.handlers[type];
    if (handlers) {
      for (let handler of handlers) {
        handler.callback(param);
      }
    }
  }

  _onConnect(status) {
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
        this.sendPresence();
        break;
      default:
        this.state = {...this.state, status: XMPPClient.Status.UNKNOWN};
        break;
    }
    this._runHandlers(XMPPClient.Type.CONNECT, this.state.status);
  }

  _onIQ(elem) {
    console.log(elem);
    let json = this._convertXMLToJSON(elem);
    this._runHandlers(XMPPClient.Type.IQ, json);
    return true;
  }

  _onPresence(elem) {
    let json = this._convertXMLToJSON(elem);
    this._runHandlers(XMPPClient.Type.PRESENCE, json);
    return true;
  }

  static getCurrentTime() {
    return this.getTime(new Date());
  }

  static getTime(date) {
    let fixHour = date.getHours() < 10 ? '0' : '';
    let fixMinute = date.getMinutes() < 10 ? '0' : '';
    return `${fixHour}${date.getHours()}:${fixMinute}${date.getMinutes()}`;
  }

  _onMessage(elem) {
    let body = elem.getElementsByTagName("body");
    if (body && body.length > 0) {
      let json = this._convertXMLToJSON(elem);
      json.time = XMPPClient.getCurrentTime();
      this._runHandlers(XMPPClient.Type.MESSAGE, json);
    }
    return true;
  }

  _convertXMLToJSON(xml) {
    // Create the return object
    let obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.hasAttributes()) {
        for (let attr of xml.attributes) {
          obj[attr.name] = attr.value;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (let item of xml.childNodes) {
        let nodeName = item.nodeName;
        if (nodeName == '#text') {
          nodeName = 'text';
        }
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = this._convertXMLToJSON(item);
        } else {
          if (typeof(obj[nodeName].length) == "undefined") {
            let old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this._convertXMLToJSON(item));
        }
      }
    }
    return obj;
  }

  /**
   * 转换JSON2xml，parent必须不能为空，否则无法添加子节点
   * {query: {xmlns: 'com:nfs:msghistory:query', type: 'chat', peer: 'novawei', pageNum: 1, pageSize: 5}};
   * @param parent
   * @param json
   * @private
   */
  _convertJSONToXML(parent, json) {
    if (typeof(json) == 'object') {
      /**
       * 获取tag生成element
       */
      for (let tag in json) {
        let text = null;
        let attributes = {};
        let children = [];
        let node = json[tag];

        /**
         * 获取tag对应的属性
         * {xmlns: 'com:nfs:msghistory:query', type: 'chat', peer: 'novawei', pageNum: 1, pageSize: 5}
         */
        for (let key in node) {
          let value = node[key];
          if (key == 'text') {
            text = value;
          } else if (typeof(value) == 'object') {
            let child = {};
            child[key] = value;
            children.push(child);
          } else if (value instanceof Array) {
            for (let item of value) {
              let child = {};
              child[key] = item;
              children.push(child);
            }
          } else {
            attributes[key] = value;
          }
        }
        // 生成节点，然后遍历子节点（object类型和array类型，作为children处理）
        let child = parent.c(tag, attributes, text);
        for (let item of children) {
          this._convertJSONToXML(child, item);
        }
      }
    }
  }

}

module.exports = XMPPClient;
