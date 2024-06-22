import React from 'react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = React.useState([
    { avatar: 'S', details: 'Selena submitted new order', time: '20 minutes ago' },
    { avatar: 'S', details: 'Order No.123515 is delivered successfully', time: 'Yesterday' },
    { avatar: 'A', details: 'Order No.125632 is delivered successfully', time: 'Yesterday' },
    { avatar: 'C', details: 'Order No.125645 is delivered successfully', time: 'Yesterday' }

  ]);

  return (
    <div className="notifications">
      {notifications.map((notification, index) => (
        <div className="notification" key={index}>
          <div className="avatar">{notification.avatar}</div>
          <div className="details">{notification.details}</div>
          <div className="time">{notification.time}</div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
