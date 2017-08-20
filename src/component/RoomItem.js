const React = require('react');
require('../resource/css/app.css');

class RoomItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='chat-list-item'>
        <div className="chat-list-avatar"></div>
        <div className="chat-list-cont">
          <div className="chat-list-cont-top">
            <div className="chat-list-name">{this.props.room.naturalName}</div>
          </div>
          <div className="chat-list-cont-bottom">
            {this.props.room.description}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = RoomItem;