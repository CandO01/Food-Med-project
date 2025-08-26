import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const doctorId = searchParams.get("doctorId");
  const email = searchParams.get("email");
  const txRef = searchParams.get("tx_ref");
  const userName = localStorage.getItem("userName");

  return (
    <div style={styles.container}>
      <h1 style={{ color: status === "completed" ? "green" : "red" }}>
        Payment {status}
      </h1>
      <div style={styles.box}>
        <p style={styles.para}><strong>Doctor ID:</strong> {doctorId}</p>
        <p style={styles.para}><strong>Patient Name:</strong> {userName}</p>
        <p style={styles.para}><strong>Patient Email:</strong> {email}</p>
        <p style={{ ...styles.para, color: "green" }}>
          <strong>Reference No:</strong> {txRef}
        </p>
      </div>

      {status === "completed" ? (
        <button onClick={() => navigate("/medical")} style={styles.buttons}>
          Continue
        </button>
      ) : (
        <button onClick={() => navigate("/medical")} style={styles.buttons}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default PaymentSuccess;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",

  },
  para: {
    margin: 10,
    fontSize: "1.1rem",
  },
  buttons: {
    backgroundColor: "#4CAF50",
    border: "none",
    padding: "10px 12px",
    fontSize: "1.0rem",
    borderRadius: "6px",
    color: "white",
    fontWeight: "700",
  },
  box: {
    backgroundColor: "#c8fbcaff",
    padding: "10px",
    borderLeft: "4px solid #3aaa3dff",
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
    borderBottomRightRadius: "12px",
    borderTopRightRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
};
