import logo from "../../assets/logo.png"
import classes from './styles.module.css'
import { FaHistory } from "react-icons/fa"

export default function Navbar() {
  return (
    <div className={classes.navbar}>
      <div>
        <a href="/">
          <img src={logo} alt="logo" name="logo" className={classes.image} />
        </a>
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <ul className={classes.list}>
          <li>Media retrieval</li>
          <li>Getting Started</li>
          <li>Publication</li>
          <li>About us</li>
        </ul>
      </div>
    </div>
  )
}
