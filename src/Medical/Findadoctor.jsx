import React, { useEffect, useState, useRef } from "react";
import { categories } from "./categories.js";
import { Link } from "react-router-dom";
import ChatBotWidget from "../Food & Med Page/ChatBotWidget.jsx";
import LoadingDots from "../AuthenticationContext/LoadingDots.jsx";

function Findadoctor() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);


  const userEmail = localStorage.getItem('userEmail');

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
        const res = await fetch("https://foodmed-firstserver-backup.onrender.com/doctors");
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


// Hnadle booking and payment

async function handleBooking(id) {
   setBookingDoctor(id);
   try {
    // First request payment link from the backend
    const res = await fetch('https://foodmed-firstserver-backup.onrender.com/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        doctorId: id,
        email: userEmail,
        amount: 1
      })
    });



    const data = await res.json();

    if(data.paymentLink){
        // Redirect to flutterwave payment page
        window.location.href =data.paymentLink;
    }
    else{
      alert('Error initializing payment')
    }
   } catch (err) {
     console.error('Error booking appointment:', err);
     alert('Something went wrong. Try again')
   } finally{
    setBookingDoctor(null)
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
      const ratingDiff = (b.stars ?? 0) - (a.stars ?? 0);
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

  if (loading) return <LoadingDots center size={12} color="orange" />


  return (
    <main style={styles.main}>
      <h1 style={styles.ask}>Ask A Doctor</h1>

      {/* Doctor Carousel */}
      {filteredDoctors.length > 0 && (
        <div style={styles.container}>
          <Link
            style={{ textDecoration: "none", color: "black"}}
            to="/doctor-profile"
            state={{ doctor: filteredDoctors[current] }}
          >
            <div style={styles.card}>
              <div style={styles.doctordetails}>
                <h2 style={styles.name}>{filteredDoctors[current].name}</h2>
                <p style={styles.specialty}>
                  {filteredDoctors[current].specialty}
                </p>
                <p style={{ fontSize: '1.0rem' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>
                      {i < Math.min(Math.floor((filteredDoctors[current].patientsCount ?? 0) / 10), 5) ? '⭐' : '☆'}
                    </span>
                  ))}
                  ({filteredDoctors[current].patientsCount ?? 0} patients)
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
          <div
              onClick={() => setShowAllCategories(!showAllCategories)}
              style={{
                ...styles.category,
                backgroundColor: "#fff", // keep background white
                cursor: "pointer",
                textAlign: "center",
                boxShadow: "none" 
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "black", // 👈 make text grey
                }}
              >
                {showAllCategories ? "▲ Less" : "▼ More"}
              </p>
            </div>

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
          {(showAllCategories ? categories : categories.slice(0, 4)).map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category.name)}
            style={{
              backgroundColor: selectedCategory === category.name ? "#f0ad4e" : "#fff",
              color: selectedCategory === category.name ? "#fff" : "#000",
              cursor: "pointer",
              padding: 5,
              borderRadius: '4px'
            }}
          >
            {category.images && (
              <img
                src={category.images}
                alt={category.name}
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              />
            )}
            <p style={{ margin: 0, fontSize: "0.9rem" }}>{category.name}</p>
          </div>
        ))}

        </div>
      </section>

      {/* Filtered Doctors List */}
      <section style={styles.categorySection}>
        <div style={{ display: 'flex',    justifyContent: 'space-between' }}>
          <p>Top rated doctor</p>
          <p
            onClick={() => setSelectedCategory("All")}
            style={{
              fontSize: '1.0rem',
              fontWeight: '700',
              cursor: 'pointer',
              color: selectedCategory === "All" ? "orange" : "black"
            }}
          >
            All
          </p>
        </div>

        {filteredDoctors.length === 0 && <p>No doctors found in this category.</p>}
       
        {filteredDoctors.map((doc) => {
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
                  <h3 style={{ margin: 0, fontSize: '0.9rem' }}>{doc.name}</h3>
                  <p style={{ margin: "5px 0" }}>{doc.specialty}</p>
                  {/* Stars + patient count */}
                   <p style={{ margin: 0 }}>
                    {"⭐".repeat(Math.min(Math.floor((patients ?? 0) / 10), 5))}
                    {"☆".repeat(5 - Math.min(Math.floor((patients ?? 0) / 10), 5))}
                    ({patients ?? 0} patients)
                  </p>

                </div>
              </div>

              <button
                onClick={() => handleBooking(doc._id)}
                disabled={bookingDoctor === doc._id}
                style={{
                  padding: '10px 5px',
                  backgroundColor: bookingDoctor === doc._id ? "#ddd" : "orange",
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: bookingDoctor === doc._id ? "not-allowed" : "pointer"
                }}
              >
                {bookingDoctor === doc._id ? <LoadingDots size={6} color="white" /> : "Book Appointment"}
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
  card: { display: "flex"},
  doctordetails: { flexBasis: "39%", marginTop: '-30px' },
  image: { width: 230, height: 250, marginBottom: 15, flexBasis: "61%", position: "absolute", right: -6, bottom: -15 },
  arrowButton: { position: "absolute", left: 0, bottom: 0, width: "70px", backgroundColor: "white", color: "orange", padding: 4, border: "none", cursor: "pointer", fontSize: 18, borderBottomLeftRadius: 20, borderTopRightRadius: 20, boxShadow: "0 2px 5px rgba(0,0,0,0.2)" },
  dotsContainer: { display: "flex", justifyContent: "center", marginTop: 15, gap: 6 },
  dot: { height: 4, borderRadius: 2, backgroundColor: "#fff4", transition: "all 0.3s ease" },
  activeDot: { width: 28, backgroundColor: "orange" },
  inactiveDot: { width: 8, backgroundColor: "#f1909040" },
  categorySection: { display: "flex", flexDirection: "column", marginTop: "30px", marginBottom: '20px' },
  more: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  category: { fontSize: "1rem", fontWeight: 500 },
  doctorCard: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "10px 15px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fff", transition: "all 0.3s ease", cursor: "pointer" },
  name:{ fontSize: '1.2rem' },
  specialty:{ fontSize: '1.0rem' },
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

