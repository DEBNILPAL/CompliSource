import { useNavigate } from 'react-router-dom'

export default function BackBar() {
  const navigate = useNavigate()

  const goBack = (e) => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <div className="back-bar">
      <div className="container">
        <a className="btn btn-back" href="#" onClick={goBack}>
          ← Back
        </a>
      </div>
    </div>
  )
}
