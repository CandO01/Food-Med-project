import React from "react";
import { useLocation } from "react-router-dom";

const DoctorProfileCard = () => {
  const { state } = useLocation();
  const doctor = state?.doctor
  return (
    <div style={styles.cardContainer}>
      <div style={styles.container}>
      {/* Left vertical text */}
      <div style={styles.sideTextContainer}>
        <span style={styles.askText}>Ask</span>
        <span style={styles.overviewText}>Overview</span>
      </div>

      {/* Image section */}
      <div style={styles.imageContainer}>
        <img
          src={doctor?.image} // Replace with doctor image
          alt="Doctor"
          style={styles.image}
          />
      </div>
    </div>

      {/* Info section */}
      <div style={styles.infoContainer}>
        <h3 style={styles.doctorName}>{doctor?.name}</h3>
        <span style={styles.specialty}>{doctor?.specialty}</span>
      </div>
    </div>
  );
};

const styles = {
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderRadius: "8px",
    // overflow: "hidden",
    width: "100%",
    fontFamily: "sans-serif"
  },
  sideTextContainer: {
    display: "flex",
    flexDirection: "column",
     flexBasis: "20%",
    justifyContent: "space-around",
    padding: "10px",
    background: "#fff",
    alignItems: "center",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  overviewText: {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    color: "orange",
    fontWeight: "bold",
    marginBottom: "20px",
    fontSize: "1.5rem",
  },
  askText: {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    color: "gray",
    fontSize: "1.5rem",
  },
  imageContainer: {
    flexBasis: "80%",
    backgroundColor: "#705BDF", // purple background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: "30px",
  },
  image: {
    width: "80%",
    height: "auto",
    borderRadius: "8px"
  },
  infoContainer: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  doctorName: {
    margin: 0,
    fontSize: "1.2rem"
  },
  specialty: {
    display: "inline-block",
    background: "#FFA50033",
    color: "#FFA500",
    height: "36px",
    padding: "5px 10px",
    width: "fit-content",
    borderRadius: "8px",
    marginTop: "10px",
    fontSize: "1.06rem"
  }
};

export default DoctorProfileCard;
