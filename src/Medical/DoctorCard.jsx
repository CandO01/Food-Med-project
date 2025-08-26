import React from "react";
import { useLocation } from "react-router-dom";

const DoctorProfileCard = () => {
  const { state } = useLocation();
  const doctor = state?.doctor;
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
          <div style={styles.ratings}>
            <span style={styles.specialty}>{doctor?.specialty}</span>
            <p style={{ margin: 0 }}>
              {"⭐".repeat(Math.min(Math.floor((doctor?.patientsCount ?? 0) / 10), 5))}
              {"☆".repeat(5 - Math.min(Math.floor((doctor?.patientsCount ?? 0) / 10), 5))}
              ({doctor?.patientsCount ?? 0} patients)
            </p>
          </div>
          <p style={styles.overview}>{doctor?.overview}</p>
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
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: "20px",
    fontSize: "1.5rem",
  },
  overview: {
  marginTop: "12px",
  fontSize: "1rem",
  color: "#444",
  lineHeight: "1.5",
  padding: '0 16px'
},
  askText: {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    color: "gray",
    fontSize: "1.5rem",
  },
  imageContainer: {
    flexBasis: "80%",
    backgroundColor: "#4CAF50", // purple background
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
    background: "#d7f9d8ff",
    color: "green",
    height: "36px",
    padding: "5px 10px",
    width: "fit-content",
    borderRadius: "8px",
    marginTop: "10px",
    fontSize: "1.06rem"
  },
  ratings:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};

export default DoctorProfileCard;
