import React, { useState } from 'react'
import doc1 from '../assets/doc1.png'
import doc2 from '../assets/doc2.png'
import doc3 from '../assets/doc3.png'
import { categories } from './categories.js'

function Findadoctor() {
  const doctors = [
                    {
                      name: "Dr. Gabriella Abel",
                      specialty: "Eye specialist",
                      image: doc1
                    },
                     {
                      name: "Dr. Jane Doe",
                      specialty: "Cardiologist",
                      image: doc2
                    },
                      {
                      name: "Dr. Ahmed Musa",
                      specialty: "Pediatrician",
                      image: doc3
                    },
                  ]


  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(false)

  function nextSlide(){
    setFade(false)
    setTimeout(()=>{
      setCurrent(prevSlide => (prevSlide + 1) % doctors.length)
      setFade(true)
    }, 300)
  }

      // categories for more doctors

    const moreDoctors = categories.map((cat)=>{
      const catStyles = {
        backgroundColor: cat.backgroundColor,
        color: cat.color,
        width: '85px',
        height: '85px',
        padding: '1.2rem',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative'
      }
      return (
        <div
         key={cat.name}
         style={catStyles}
        >
            <span style={{
                          fontSize: '0.8rem',
                          marginTop: '-10px',
                          marginLeft: -10
                         }}
            >
              {cat.name}
            </span>
            <img style={{
                  width: 30, 
                  position: 'absolute', 
                  bottom: 5,
                  right: 5,
                  color: '#fff'
                  }} 
                  src={cat.images} 
            />
        </div>
         )
    })

  return (
    <main style={styles.main}>
      <h1 style={styles.ask}>Ask A doctor</h1>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.doctordetails}>
            <h2 style={styles.name}>{doctors[current].name}</h2>
            <p style={styles.specialty}>{doctors[current].specialty}</p>
          </div>
          <img 
            src={doctors[current].image}
            alt={doctors[current].name}
            style={styles.image} 
          />
        </div>
        <button onClick={nextSlide} style={styles.arrowButton}>➜</button>
      </div>
      <div style={styles.dotsContainer}>
          {doctors.map((_, index)=>{
            return <span
                    key={index}
                    style={{
                      ...styles.dot,
                      ...(index === current ? styles.activeDot : styles.inactiveDot)
                    }}
                   ></span>
          })}
        </div>

        <section style={styles.categorySection}>
          <div style={styles.more}>
            <p style={styles.category}>Categories</p>
            <p>More</p>
          </div>
          <div 
            style={{
            overflowX: 'auto',
            display: 'flex',
            gap: '1rem',
            marginBottom: '0.2rem',
            paddingBottom: '0.5rem',
          }}
          >
            {moreDoctors}
          </div>
        </section>

        <section style={styles.categorySection}>
          <div style={styles.more}>
            <p style={styles.category}>Top Rated Doctor</p>
            <p>More</p>
          </div>
        </section>
  </main>
  )
}

export default Findadoctor

const styles = {
  main:{
     display: 'flex',
     flexDirection: 'column',
     padding: '1.7rem',
    //  position: 'relative'
  },
  ask:{
   marginBottom: '30px',
   width: '100px',
   fontSize: '2.25rem',
   fontWeight: 500,
   lineHeight: 1.2,
  },
  container: {
    width: '100%',
    margin: '0 auto',
    backgroundColor: 'orange',
    color: 'white',
    borderRadius: 20,
    position: 'relative',
    padding: 20,
    height: 200,
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  card:{
    display: 'flex',
    alignItems: 'center',
  },
  doctordetails:{
    flexBasis: '39%'
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 15,
    flexBasis: '61%',
    position: 'absolute',
    right: 0,
    bottom: -15
  },
  name: {
    fontSize: '1.875rem',
    fontWeight: 400,
    margin: 0
  },
  specialty: {
    fontSize: '1.06rem',
    margin: '5px 0 15px 0',
  },
  arrowButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '70px',
    backgroundColor: 'white',
    color: 'orange',
    padding: 4,
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    borderBottomLeftRadius: 20, 
    borderTopRightRadius: 20, 
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  dotsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
    gap: 6
  },
  dot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff4',
    transition: 'all 0.3s ease'
  },
  activeDot: {
    width: 28,
    backgroundColor: 'orange'
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#f1909040'
  },
  categorySection:{
    display: 'flex',
    flexDirection: 'column',
    marginTop: '30px'
  },
  more:{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }, 
  category:{
    fontSize: '1rem',
    fontWeight: 500,
  }
};
