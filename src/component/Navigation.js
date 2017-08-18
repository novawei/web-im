const React = require('react');
require('../resource/css/app.css');

class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(index) {
    this.props.onSelectIndex(index);
  }

  render() {
    const getClassName = (index) => {
      if (index == this.props.selectedIndex) {
        return 'menu-item menu-item-select';
      } else {
        return 'menu-item'
      }
    };
    const items = ['消息', '联系人', '群组'];
    return (
      <div className='left'>
        <div className="avatar">
          {this.props.username}
        </div>
        <div className="menu">
          {items.map((item, index, array) => (
            <div className={getClassName(index)}
                 key={index}
                 onClick={() => this.handleClick(index)}>
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

module.exports = Navigation;