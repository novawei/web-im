/**
 * Created by Nova on 2017/8/18.
 */
const React = require('react');
const RoomList = require('../component/RoomList');
require('../resource/css/middle.css');

class MiddleContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let component = null;
    if (this.props.selectedIndex == 0) {
      component = (<div>消息列表</div>);
    } else if (this.props.selectedIndex == 1) {
      component = (<div>联系人列表</div>);
    } else {
      component = <RoomList roomList={this.props.roomList} />;
    }
    return (
      <div className="middle-container">
        {component}
      </div>
    )
  }
}

module.exports = MiddleContainer;