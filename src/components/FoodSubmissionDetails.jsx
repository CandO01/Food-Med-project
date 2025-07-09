import React from 'react'
import { useParams } from 'react-router-dom'
function FoodSubmissionDetails() {
  const { id } = useParams()
  console.log(id)
  return (
    <div>FoodSubmissionDetails {id}</div>
  )
}

export default FoodSubmissionDetails