import React, { useEffect, useState, useRef } from "react";
import { categories } from "./categories.js";
import { Link } from "react-router-dom";
import ChatBotWidget from "../Food & Med Page/ChatBotWidget.jsx";

function Findadoctor() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookingDoctor, setBookingDoctor] = useState(null);

  // Ref to the category container
  const categoryContainerRef = useRef(null);

  // Carousel next slide
  function nextSlide() {
    if (filteredDoctors.length === 0) return;
    setCurrent((prev) => (prev + 1) % filteredDoctors.length);
  }

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5223/doctors");
        const data = await res.json();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Handle booking
  async function handleBooking(id) {
    setBookingDoctor(id);
    setFilteredDoctors((prevDoctors)=>
      prevDoctors.map((doc)=>
        doc._id === id
        ? { ...doc, patientsCount: (doc.patientsCount ?? 0) + 1 }
        : doc
      )
    );
    try {
      const res = await fetch(`http://localhost:5223/doctors/${id}/book`, {
        method: "PATCH",
      });
      await res.json();
      // Refresh doctors list
      const refreshRes = await fetch("http://localhost:5223/doctors");
      const refreshedData = await refreshRes.json();
      setDoctors(refreshedData);
    } catch (err) {
      console.error("Error booking appointment:", err);
         // Rollback in case of error
    setFilteredDoctors((prevDoctors) =>
      prevDoctors.map((doc) =>
        doc._id === id
          ? { ...doc, patientsCount: (doc.patientsCount ?? 1) - 1 }
          : doc
      )
    );

    } finally {
      setBookingDoctor(null);
    }
  }

  // Filter and sort doctors by category and rating
  useEffect(() => {
    let filtered = [...doctors];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((doc) => {
        const specialty = (doc.specialty || "").toLowerCase();
        return specialty.includes(selectedCategory.toLowerCase());
      });
    }

    filtered.sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;
      return (b.patientsCount ?? 0) - (a.patientsCount ?? 0);
    });

    setFilteredDoctors(filtered);
    setCurrent(0);
  }, [selectedCategory, doctors]);

  // Scroll active category into view
  useEffect(() => {
    if (!categoryContainerRef.current) return;
    const activeCat = categoryContainerRef.current.querySelector(".activeCategory");
    if (activeCat) {
      activeCat.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [selectedCategory]);

  if (loading) return <p>Loading doctors...</p>;

  return (
    <main style={styles.main}>
      <h1 style={styles.ask}>Ask A Doctor</h1>

      {/* Doctor Carousel */}
      {filteredDoctors.length > 0 && (
        <div style={styles.container}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/doctor-profile"
            state={{ doctor: filteredDoctors[current] }}
          >
            <div style={styles.card}>
              <div style={styles.doctordetails}>
                <h2 style={styles.name}>{filteredDoctors[current].name}</h2>
                <p style={styles.specialty}>
                  {filteredDoctors[current].specialty}
                </p>
                <p>
                  ⭐ {filteredDoctors[current].rating ?? 0} (
                  {filteredDoctors[current].patientsCount ?? 0} patients)
                </p>
              </div>
              <img
                src={filteredDoctors[current].image}
                alt={filteredDoctors[current].name}
                style={styles.image}
              />
            </div>
          </Link>
          <button onClick={nextSlide} style={styles.arrowButton}>
            ➜
          </button>
        </div>
      )}

      {/* Dots */}
      <div style={styles.dotsContainer}>
        {filteredDoctors.map((_, idx) => (
          <span
            key={idx}
            style={{
              ...styles.dot,
              ...(idx === current ? styles.activeDot : styles.inactiveDot),
            }}
          ></span>
        ))}
      </div>

      {/* Categories */}
      <section style={styles.categorySection}>
        <div style={styles.more}>
          <p style={styles.category}>Categories</p>
          <p>More</p>
        </div>
        <div
          ref={categoryContainerRef}
          style={{
            overflowX: "auto",
            display: "flex",
            gap: "1rem",
            marginBottom: "0.2rem",
            paddingBottom: "0.5rem",
          }}
        >
          {[{ name: "All", backgroundColor: "#f0ad4e", color: "#fff", images: "" }, ...categories].map(
            (cat) => {
              const isActive = selectedCategory === cat.name;
              const catStyles = {
                backgroundColor: isActive ? "#ff8c00" : cat.backgroundColor,
                color: isActive ? "#fff" : cat.color,
                width: "85px",
                height: "85px",
                padding: "1.2rem",
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                position: "relative",
                cursor: "pointer",
                border: isActive ? "2px solid #e69500" : "none",
                fontWeight: cat.name === "All" ? "600" : "normal",
              };
              return (
                <div
                  key={cat.name}
                  style={catStyles}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={isActive ? "activeCategory" : ""}
                >
                  <span style={{ fontSize: "0.8rem", marginTop: "-10px", marginLeft: -10 }}>
                    {cat.name}
                  </span>
                  {cat.images && (
                    <img
                      style={{ width: 30, position: "absolute", bottom: 5, right: 5 }}
                      src={cat.images}
                      alt={cat.name}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Filtered Doctors List */}
      <section style={styles.categorySection}>
        {filteredDoctors.length === 0 && <p>No doctors found in this category.</p>}

        {filteredDoctors.map((doc) => {
          const rating = doc.rating ?? 0;
          const patients = doc.patientsCount ?? 0;

          return (
            <div
              key={doc._id}
              style={styles.doctorCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img
                  src={doc.image}
                  alt={doc.name}
                  style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{doc.name}</h3>
                  <p style={{ margin: "5px 0" }}>{doc.specialty}</p>
                  <p style={{ margin: 0 }}>⭐ {rating} ({patients} patients)</p>
                </div>
              </div>

              <button
                onClick={() => handleBooking(doc._id)}
                style={styles.bookButton}
                disabled={bookingDoctor === doc._id}
              >
                {bookingDoctor === doc._id ? "Booking..." : "Book Appointment"}
              </button>
            </div>
          );
        })}
      </section>

      <ChatBotWidget />
    </main>
  );
}

export default Findadoctor;


const styles = {
  main: { display: "flex", flexDirection: "column", padding: "1.7rem" },
  ask: { marginBottom: "30px", width: "100px", fontSize: "2.25rem", fontWeight: 500, lineHeight: 1.2 },
  container: { width: "100%", margin: "0 auto", backgroundColor: "orange", color: "white", borderRadius: 20, position: "relative", padding: 20, height: 200, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" },
  card: { display: "flex", alignItems: "center" },
  doctordetails: { flexBasis: "39%" },
  image: { width: 250, height: 250, marginBottom: 15, flexBasis: "61%", position: "absolute", right: 0, bottom: -15 },
  arrowButton: { position: "absolute", left: 0, bottom: 0, width: "70px", backgroundColor: "white", color: "orange", padding: 4, border: "none", cursor: "pointer", fontSize: 18, borderBottomLeftRadius: 20, borderTopRightRadius: 20, boxShadow: "0 2px 5px rgba(0,0,0,0.2)" },
  dotsContainer: { display: "flex", justifyContent: "center", marginTop: 15, gap: 6 },
  dot: { height: 4, borderRadius: 2, backgroundColor: "#fff4", transition: "all 0.3s ease" },
  activeDot: { width: 28, backgroundColor: "orange" },
  inactiveDot: { width: 8, backgroundColor: "#f1909040" },
  categorySection: { display: "flex", flexDirection: "column", marginTop: "30px", marginBottom: '20px' },
  more: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  category: { fontSize: "1rem", fontWeight: 500 },
  doctorCard: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "10px 15px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fff", transition: "all 0.3s ease", cursor: "pointer" },
  bookButton: { background: "orange", color: "#fff", padding: "10px 15px", border: "none", borderRadius: "5px", cursor: "pointer", transition: "background 0.3s ease" },
};






// import React, { useEffect, useState } from "react";
// import { categories } from "./categories.js";
// import { Link } from "react-router-dom";
// import ChatBotWidget from "../Food & Med Page/ChatBotWidget.jsx";

// function Findadoctor() {
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [current, setCurrent] = useState(0);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [bookingDoctor, setBookingDoctor] = useState(null);

//   // Carousel next slide
//   function nextSlide() {
//     if (filteredDoctors.length === 0) return;
//     setCurrent((prev) => (prev + 1) % filteredDoctors.length);
//   }

//   // Fetch doctors
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await fetch("http://localhost:5223/doctors");
//         const data = await res.json();
//         setDoctors(data);
//         setFilteredDoctors(data);
//       } catch (err) {
//         console.error("Error fetching doctors:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   // Handle booking
//   async function handleBooking(id) {
//     setBookingDoctor(id);
//     try {
//       const res = await fetch(`http://localhost:5223/doctors/${id}/book`, {
//         method: "PATCH",
//       });
//       const result = await res.json();
//       console.log(result);
//       // Refresh doctors list
//       const refreshRes = await fetch("http://localhost:5223/doctors");
//       const refreshedData = await refreshRes.json();
//       setDoctors(refreshedData);
//     } catch (err) {
//       console.error("Error booking appointment:", err);
//     } finally {
//       setBookingDoctor(null);
//     }
//   }

//   // Filter and sort doctors by category and rating
//   useEffect(() => {
//     let filtered = [...doctors];

//     if (selectedCategory !== "All") {
//       filtered = filtered.filter((doc) => {
//         const specialty = (doc.specialty || "").toLowerCase();
//         return specialty.includes(selectedCategory.toLowerCase());
//       });
//     }

//     // Sort by rating descending
//     filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

//     setFilteredDoctors(filtered);
//     setCurrent(0); // Reset carousel
//   }, [selectedCategory, doctors]);

//   if (loading) return <p>Loading doctors...</p>;

//   return (
//     <main style={styles.main}>
//       <h1 style={styles.ask}>Ask A Doctor</h1>

//       {/* Doctor Carousel */}
//       {filteredDoctors.length > 0 && (
//         <div style={styles.container}>
//           <Link
//             style={{ textDecoration: "none", color: "black" }}
//             to="/doctor-profile"
//             state={{ doctor: filteredDoctors[current] }}
//           >
//             <div style={styles.card}>
//               <div style={styles.doctordetails}>
//                 <h2 style={styles.name}>{filteredDoctors[current].name}</h2>
//                 <p style={styles.specialty}>
//                   {filteredDoctors[current].specialty}
//                 </p>
//                 <p>
//                   ⭐ {filteredDoctors[current].rating ?? 0} (
//                   {filteredDoctors[current].patientsCount ?? 0} patients)
//                 </p>
//               </div>
//               <img
//                 src={filteredDoctors[current].image}
//                 alt={filteredDoctors[current].name}
//                 style={styles.image}
//               />
//             </div>
//           </Link>
//           <button onClick={nextSlide} style={styles.arrowButton}>
//             ➜
//           </button>
//         </div>
//       )}

//       {/* Dots */}
//       <div style={styles.dotsContainer}>
//         {filteredDoctors.map((_, idx) => (
//           <span
//             key={idx}
//             style={{
//               ...styles.dot,
//               ...(idx === current ? styles.activeDot : styles.inactiveDot),
//             }}
//           ></span>
//         ))}
//       </div>

//       {/* Categories */}
//       <section style={styles.categorySection}>
//         <div style={styles.more}>
//           <p style={styles.category}>Categories</p>
//           <p>More</p>
//         </div>
//         <div
//           style={{
//             overflowX: "auto",
//             display: "flex",
//             gap: "1rem",
//             marginBottom: "0.2rem",
//             paddingBottom: "0.5rem",
//           }}
//         >
//           {categories.map((cat) => {
//             const isActive = selectedCategory === cat.name;
//             const catStyles = {
//               backgroundColor: isActive ? "#007bff" : cat.backgroundColor,
//               color: isActive ? "#fff" : cat.color,
//               width: "85px",
//               height: "85px",
//               padding: "1.2rem",
//               borderRadius: "15px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "flex-start",
//               justifyContent: "flex-start",
//               position: "relative",
//               cursor: "pointer",
//               border: isActive ? "2px solid #0056b3" : "none",
//             };

//             return (
//               <div
//                 key={cat.name}
//                 style={catStyles}
//                 onClick={() => setSelectedCategory(cat.name)}
//               >
//                 <span
//                   style={{
//                     fontSize: "0.8rem",
//                     marginTop: "-10px",
//                     marginLeft: -10,
//                   }}
//                 >
//                   {cat.name}
//                 </span>
//                 <img
//                   style={{
//                     width: 30,
//                     position: "absolute",
//                     bottom: 5,
//                     right: 5,
//                   }}
//                   src={cat.images}
//                   alt={cat.name}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </section>

//       {/* Filtered Doctors List */}
//       <section style={styles.categorySection}>
//         {filteredDoctors.length === 0 && <p>No doctors found in this category.</p>}

//         {filteredDoctors.map((doc) => {
//           const rating = doc.rating ?? 0;
//           const patients = doc.patientsCount ?? 0;

//           return (
//             <div
//               key={doc._id}
//               style={styles.doctorCard}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
//                 e.currentTarget.style.transform = "translateY(-3px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.boxShadow = "none";
//                 e.currentTarget.style.transform = "translateY(0)";
//               }}
//             >
//               {/* Left: Image + Info */}
//               <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//                 <img
//                   src={doc.image}
//                   alt={doc.name}
//                   style={{ width: "80px", height: "80px", borderRadius: "50%" }}
//                 />
//                 <div>
//                   <h3 style={{ margin: 0 }}>{doc.name}</h3>
//                   <p style={{ margin: "5px 0" }}>{doc.specialty}</p>
//                   <p style={{ margin: 0 }}>⭐ {rating} ({patients} patients)</p>
//                 </div>
//               </div>

//               {/* Right: Booking Button */}
//               <button
//                 onClick={() => handleBooking(doc._id)}
//                 style={styles.bookButton}
//                 disabled={bookingDoctor === doc._id}
//               >
//                 {bookingDoctor === doc._id ? "Booking..." : "Book Appointment"}
//               </button>
//             </div>
//           );
//         })}
//       </section>

//       <ChatBotWidget />
//     </main>
//   );
// }

// export default Findadoctor;

// const styles = {
//   main: {
//     display: "flex",
//     flexDirection: "column",
//     padding: "1.7rem",
//   },
//   ask: {
//     marginBottom: "30px",
//     width: "100px",
//     fontSize: "2.25rem",
//     fontWeight: 500,
//     lineHeight: 1.2,
//   },
//   container: {
//     width: "100%",
//     margin: "0 auto",
//     backgroundColor: "orange",
//     color: "white",
//     borderRadius: 20,
//     position: "relative",
//     padding: 20,
//     height: 200,
//     boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//   },
//   card: {
//     display: "flex",
//     alignItems: "center",
//   },
//   doctordetails: {
//     flexBasis: "39%",
//   },
//   image: {
//     width: 250,
//     height: 250,
//     marginBottom: 15,
//     flexBasis: "61%",
//     position: "absolute",
//     right: 0,
//     bottom: -15,
//   },
//   arrowButton: {
//     position: "absolute",
//     left: 0,
//     bottom: 0,
//     width: "70px",
//     backgroundColor: "white",
//     color: "orange",
//     padding: 4,
//     border: "none",
//     cursor: "pointer",
//     fontSize: 18,
//     borderBottomLeftRadius: 20,
//     borderTopRightRadius: 20,
//     boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//   },
//   dotsContainer: {
//     display: "flex",
//     justifyContent: "center",
//     marginTop: 15,
//     gap: 6,
//   },
//   dot: {
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "#fff4",
//     transition: "all 0.3s ease",
//   },
//   activeDot: {
//     width: 28,
//     backgroundColor: "orange",
//   },
//   inactiveDot: {
//     width: 8,
//     backgroundColor: "#f1909040",
//   },
//   categorySection: {
//     display: "flex",
//     flexDirection: "column",
//     marginTop: "30px",
//   },
//   more: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   category: {
//     fontSize: "1rem",
//     fontWeight: 500,
//   },
//   doctorCard: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "1rem",
//     padding: "10px 15px",
//     border: "1px solid #ddd",
//     borderRadius: "10px",
//     backgroundColor: "#fff",
//     transition: "all 0.3s ease",
//     cursor: "pointer",
//   },
//   bookButton: {
//     background: "#007bff",
//     color: "#fff",
//     padding: "10px 15px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "background 0.3s ease",
//   },
// };


// import React, { useEffect, useState } from "react";
// import { categories } from "./categories.js";
// import { Link } from "react-router-dom";
// import ChatBotWidget from "../Food & Med Page/ChatBotWidget.jsx";

// function Findadoctor() {
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [current, setCurrent] = useState(0);
//   const [fade, setFade] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [bookingDoctor, setBookingDoctor] = useState(null);

//   function nextSlide() {
//     if (doctors.length === 0) return;
//     setFade(false);
//     setTimeout(() => {
//       setCurrent((prevSlide) => (prevSlide + 1) % doctors.length);
//       setFade(true);
//     }, 300);
//   }

//   // fetch doctors from backend
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await fetch("http://localhost:5223/doctors");
//         const data = await res.json();
//         setDoctors(data);
//         setFilteredDoctors(data); // initially show all
//       } catch (err) {
//         console.error("Error fetching doctors:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   // handle bookings
//   async function handleBooking(id){
//     setBookingDoctor(id);

//     try {
//       const res = await fetch(`http://localhost:5223/doctors/${id}/book`, {
//         method: 'PATCH'
//       });
//       const result = await res.json();
//       console.log(result)
//       // Refresh doctors list
//       const refreshRes = await fetch('http://localhost:5223/doctors');
//       const refreshedData = await refreshRes.json();
//       setDoctors(refreshedData)
//     } catch (err) {
//       console.error('Error booking appointment:', err)
//     } finally{
//       setBookingDoctor(null);
//     }
//   }

//   // filter doctors whenever category changes
// useEffect(() => {
//   let filtered = [...doctors]
//   if (selectedCategory === "All") {
//     filtered = filtered.filter((doc)=>{
//       const specialty = (doc.specialty || "").toLowerCase();
//       return specialty.includes(selectedCategory.toLowerCase());
//     });
//   } 
//   // Sorting by rating descending
//   filtered.sort((a, b)=> (b.rating ?? 0) - (a.rating ?? 0));
//   setFilteredDoctors(filtered);
//   setCurrent(0)
// }, [selectedCategory, doctors]);


//   if (loading) {
//     return <p>Loading doctors...</p>;
//   }

//   return (
//     <main style={styles.main}>
//       <h1 style={styles.ask}>Ask A Doctor</h1>

//       {/* doctor card carousel */}
//       {filteredDoctors.length > 0 && (
//         <div style={styles.container}>
//           <Link
//             style={{ textDecoration: "none", color: "black" }}
//             to="/doctor-profile"
//             state={{ doctor: filteredDoctors[current] }}
//           >
//             <div style={styles.card}>
//               <div style={styles.doctordetails}>
//                 <h2 style={styles.name}>{filteredDoctors[current].name}</h2>
//                 <p style={styles.specialty}>
//                   {filteredDoctors[current].specialty}
//                 </p>
//               </div>
//               <img
//                 src={filteredDoctors[current].image}
//                 alt={filteredDoctors[current].name}
//                 style={styles.image}
//               />
//             </div>
//           </Link>
//           <button onClick={nextSlide} style={styles.arrowButton}>
//             ➜
//           </button>
//         </div>
//       )}

//       {/* dots indicator */}
//       <div style={styles.dotsContainer}>
//         {filteredDoctors.map((_, index) => (
//           <span
//             key={index}
//             style={{
//               ...styles.dot,
//               ...(index === current
//                 ? styles.activeDot
//                 : styles.inactiveDot),
//             }}
//           ></span>
//         ))}
//       </div>

//       {/* categories */}
//       <section style={styles.categorySection}>
//         <div style={styles.more}>
//           <p style={styles.category}>Categories</p>
//           <p>More</p>
//         </div>
//         <div
//           style={{
//             overflowX: "auto",
//             display: "flex",
//             gap: "1rem",
//             marginBottom: "0.2rem",
//             paddingBottom: "0.5rem",
//           }}
//         >
//           {categories.map((cat) => {
//             const catStyles = {
//               backgroundColor: cat.backgroundColor,
//               color: cat.color,
//               width: "85px",
//               height: "85px",
//               padding: "1.2rem",
//               borderRadius: "15px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "flex-start",
//               justifyContent: "flex-start",
//               position: "relative",
//               cursor: "pointer",
             
//             };

//             return (
//               <div
//                 key={cat.name}
//                 style={catStyles}
//                 onClick={() => setSelectedCategory(cat.name)}
//               >
//                 <span
//                   style={{
//                     fontSize: "0.8rem",
//                     marginTop: "-10px",
//                     marginLeft: -10,
//                   }}
//                 >
//                   {cat.name}
//                 </span>
//                 <img
//                   style={{
//                     width: 30,
//                     position: "absolute",
//                     bottom: 5,
//                     right: 5,
//                     color: "#fff",
//                   }}
//                   src={cat.images}
//                   alt={cat.name}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </section>

//        {/* Top Rated Doctors Section */}
//     <section style={styles.categorySection}>
//       <div style={styles.more}>
//         <p style={styles.category}>Top Rated Doctors</p>
//         <p>More</p>
//       </div>

//       {doctors.map((doc) => {
//           const rating = doc.rating ?? 0;
//           const patients = doc.patientsCount ?? 0;

//           return (
//             <div
//               key={doc._id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "1rem",
//                 padding: "10px 15px",
//                 border: "1px solid #ddd",
//                 borderRadius: "10px",
//                 backgroundColor: "#fff",
//                 transition: "all 0.3s ease",
//                 cursor: "pointer",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
//                 e.currentTarget.style.transform = "translateY(-3px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.boxShadow = "none";
//                 e.currentTarget.style.transform = "translateY(0)";
//               }}
//             >
//               {/* Left side: Image and Info */}
//               <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//                 <img
//                   src={doc.image}
//                   alt={doc.name}
//                   style={{ width: "80px", height: "80px", borderRadius: "50%" }}
//                 />
//                 <div>
//                   <h3 style={{ margin: 0 }}>{doc.name}</h3>
//                   <p style={{ margin: "5px 0" }}>{doc.specialty}</p>
//                   <p style={{ margin: 0 }}>⭐ {rating} ({patients} patients)</p>
//                 </div>
//               </div>

//               {/* Right side: Booking Button */}
//               <button
//                 onClick={() => handleBooking(doc._id)}
//                 style={{
//                   background: "#007bff",
//                   color: "#fff",
//                   padding: "10px 15px",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                   transition: "background 0.3s ease",
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.background = "#0056b3")}
//                 onMouseLeave={(e) => (e.currentTarget.style.background = "#007bff")}
//                 disabled={bookingDoctor === doc._id}
//               >
//                 {bookingDoctor === doc._id ? "Booking..." : "Book Appointment"}
//               </button>
//             </div>
//           );
//         })}

//     </section>

          

//       <ChatBotWidget />
//     </main>
//   );
// }

// export default Findadoctor;

// const styles = {
//   main: {
//     display: "flex",
//     flexDirection: "column",
//     padding: "1.7rem",
//   },
//   ask: {
//     marginBottom: "30px",
//     width: "100px",
//     fontSize: "2.25rem",
//     fontWeight: 500,
//     lineHeight: 1.2,
//   },
//   container: {
//     width: "100%",
//     margin: "0 auto",
//     backgroundColor: "orange",
//     color: "white",
//     borderRadius: 20,
//     position: "relative",
//     padding: 20,
//     height: 200,
//     boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//   },
//   card: {
//     display: "flex",
//     alignItems: "center",
//   },
//   doctordetails: {
//     flexBasis: "39%",
//   },
//   image: {
//     width: 250,
//     height: 250,
//     marginBottom: 15,
//     flexBasis: "61%",
//     position: "absolute",
//     right: 0,
//     bottom: -15,
//   },
//   name: {
//     fontSize: "1.875rem",
//     fontWeight: 400,
//     margin: 0,
//   },
//   specialty: {
//     fontSize: "1.06rem",
//     margin: "5px 0 15px 0",
//   },
//   arrowButton: {
//     position: "absolute",
//     left: 0,
//     bottom: 0,
//     width: "70px",
//     backgroundColor: "white",
//     color: "orange",
//     padding: 4,
//     border: "none",
//     cursor: "pointer",
//     fontSize: 18,
//     borderBottomLeftRadius: 20,
//     borderTopRightRadius: 20,
//     boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//   },
//   dotsContainer: {
//     display: "flex",
//     justifyContent: "center",
//     marginTop: 15,
//     gap: 6,
//   },
//   dot: {
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "#fff4",
//     transition: "all 0.3s ease",
//   },
//   activeDot: {
//     width: 28,
//     backgroundColor: "orange",
//   },
//   inactiveDot: {
//     width: 8,
//     backgroundColor: "#f1909040",
//   },
//   categorySection: {
//     display: "flex",
//     flexDirection: "column",
//     marginTop: "10px",
//     marginBottom: '40px'
//   },
//   more: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   category: {
//     fontSize: "1rem",
//     fontWeight: 500,
//   },
// };

