import React from "react";
import "./Notifications.css";
import Card from "../Card/Card";
const Notifications = () => {
  const [notifications, setNotifications] = React.useState([
    {
      avatar: "S",
      details: "Selena submitted new order",
      time: "20 minutes ago",
    },
    {
      avatar: "S",
      details: "Order No.123515 is delivered successfully",
      time: "Yesterday",
    },
    {
      avatar: "A",
      details: "Order No.125632 is delivered successfully",
      time: "Yesterday",
    },
  ]);

  return (
    <Card className="flex-1 py-6 gap-20">
      {notifications.map((notification, index) => (
        <div className="notification text-text flex gap-4" key={index}>
          <div className="avatar">{notification.avatar}</div>
          <div className="details font-semibold ">{notification.details}</div>
          <div className="time">{notification.time}</div>
        </div>
      ))}
    </Card>
  );
};

export default Notifications;
