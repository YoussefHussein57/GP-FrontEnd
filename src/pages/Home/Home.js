import React from "react";
import "./Home.css";
import Notifications from "../../components/Notifications/Notifications";
import FavBar from "../../components/Dashboard/Favourites";
import AI from "../../components/AIModelState/AI";

function Home() {
  return (
    <div className="home">
      <main className="Container">
        <div className="row">
          <div className="column-2">
            <Notifications />
            <AI />
          </div>
          <div className="column-1">
            <FavBar />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
