/**
 * Created by Nova on 2017/8/18.
 */
const React = require('react');
require('../resource/css/left.css');

class LeftContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(index) {
    this.props.onSelectIndex(index);
  }

  render() {
    const items = ['消息', '联系人', '群组'];
    return (
      <div className='left-container'>
        <div>
          {this.props.name}
        </div>
        <div>
          <ul>
            {items.map((item, index, array) =>
              <li key={index} onClick={() => this.handleClick(index)}>{item}</li>
            )}
          </ul>
        </div>
      </div>
    )
  }
}

module.exports = LeftContainer;