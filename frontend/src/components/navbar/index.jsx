import logo from "../../assets/logo.png"
import classes from './styles.module.css'
import { FaHistory } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate();
  
  return (
    <div className={classes.navbar}>
      <div>
        <a href="/">
          <img src={logo} alt="logo" name="logo" className={classes.image} />
        </a>
      </div>
      <div style={{ display: "flex"}}>
        <ul className={classes.list}>
          <li>Media retrieval</li>
          <li>Getting Started</li>
          <li>Publication</li>
          <li onClick={()=>navigate('/history')}>Get Search History</li>
        </ul>
      </div>
    </div>
  )
}
