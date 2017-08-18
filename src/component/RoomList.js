/**
 * Created by Nova on 2017/8/18.
 */
const React = require('react');

class RoomList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>群组列表</div>
        <div>
          <ul>
            {this.props.roomList.map((room) =>
              <li key={room.roomID}>{room.naturalName}</li>
            )}
          </ul>
        </div>
      </div>
    )
  }
}

module.exports = RoomList;