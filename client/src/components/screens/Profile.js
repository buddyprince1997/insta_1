import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        console.log("Fetched data:", result);
        if (result && result.mypost) {
          setPics(result.mypost);
        } else {
          console.error("Error: No posts found in response");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  console.log("Current state data:", mypics);

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src="https://images.unsplash.com/photo-1615920606214-6428b3324c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDh8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D"
            alt="profile"
          />
        </div>
        <div>
          <h4>{state ? state.name : "loading"}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>40 posts</h6>
            <h6>40 followers</h6>
            <h6>40 following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {Array.isArray(mypics) && mypics.length > 0 ? (
          mypics.map((item) => (
            <img
              key={item._id}
              className="item"
              src={item.photo}
              alt={item.title}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
