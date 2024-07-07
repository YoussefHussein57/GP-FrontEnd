import React from "react";
import "./Home.css";
import Notifications from "../../components/Notifications/Notifications";
import FavBar from "../../components/Dashboard/Favourites";
import AI from "../../components/AIModelState/AI";

function Home() {
  return (
    <div className="home h-4/5">
      <div className="flex gap-8 max-w-full p-8 h-full">
        <div className="column-2">
          <Notifications />
          <AI />
        </div>
        <div className="column-1">
          <FavBar />
        </div>
      </div>
    </div>
  );
}

export default Home;
