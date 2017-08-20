/**
 * Created by Nova on 2017/8/18.
 */
const React = require('react');
const RoomItem =  require('./RoomItem');
require('../resource/css/app.css');

class RoomList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="middle-cont">
        <div className="middle">
          {this.props.roomList.map((room) =>
            <RoomItem key={room.roomID} room={room}/>
          )}
        </div>
      </div>
    )
  }
}

module.exports = RoomList;