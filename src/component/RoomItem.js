const React = require('react');
require('../resource/css/app.css');

class RoomItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='chat-item'>
        <div className="chat-avatar"></div>
        <div className="chat-cont">
          <div className="chat-cont-top">
            <div className="chat-name">{this.props.room.naturalName}</div>
          </div>
          <div className="chat-cont-bottom">
            <div className="chat-content">{this.props.room.description}</div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = RoomItem;