import { useParams } from "react-router-dom"

const GuidePage = () => {
    const { id } = useParams()

  return (
    <div>GuidePage {id}</div>
  )
}

export default GuidePage