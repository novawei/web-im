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

    this.state = {
      status: XMPPClient.Status.UNKNOWN
    }
  }

  config(domain, resource) {
    if (this.state.domain == domain && this.state.resource == resource) {
      return;
    }
    if (this.conn) {
      this.conn.disconnect();
    }
    this.resetState();
    this.state = {
      ...this.state,
      domain: domain,
      resource: resource,
    };
    this.conn = new Strophe.Connection(`http://${domain}:7070/http-bind/`);
  }

  resetState() {
    this.state = {
      ...this.state,
      status: XMPPClient.Status.UNKNOWN,
      username: null,
      password: null
    };
  }

  getStatus() {
    return this.state.status;
  }

  login(username, password) {
    this.state = {...this.state, username: username, password: password};
    let jid = `${username}@192.168.1.104/${this.state.resource}`;
    this.conn.connect(jid, password, this.onConnect);
  }

  logout() {
    this.conn.disconnect();
    this.resetState();
  }

  addHandler() {

  }


  onConnect(status) {
    console.log(`status = ${status}`);
  }
}

module.exports = XMPPClient;
