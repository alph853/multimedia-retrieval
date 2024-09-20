import { useEffect, useState } from "react"
import classes from "./styles.module.css"
import axios from "axios"
import { toast } from "react-toastify"
import Notification from "../../components/notification"
import CsvDropDown from "./csv_dropdown"

export default function History() {
  const [historyResponse, setHistoryResponse] = useState([])
  const [currentFileRes, setCurrentFileRes] = useState({
    request: null,
    results: [],
    query: "",
  })

  useEffect(() => {
    axios
      .post("https://amazed-seasnail-uniformly.ngrok-free.app/get_history")
      .then((res) => {
        console.log("History data: ", res.data)
        setHistoryResponse(res.data)
      })
      .catch((err) => {
        console.error("Search failed:", err.message)
      })
  }, [])

  function handleSubmitQuery(el) {
    axios
      .post(
        `https://amazed-seasnail-uniformly.ngrok-free.app/history?filename=${el}`,
        { request: {} }
      )
      .then((res) => {
        console.log(res.data)
        setCurrentFileRes(res.data) // Assuming you want to set this to state
      })
      .catch((err) => {
        console.log(err.message)
      })
  }
  return (
    <>
      <div className={classes.historyContainer}>
        <div className={classes.historyLeft}>
          <p style={{ fontSize: "20px" }}>File results</p>
          <ul>
            {historyResponse?.map((el) => (
              <li key={el} onClick={() => handleSubmitQuery(el)}>
                {el}
              </li>
            ))}
          </ul>
        </div>

        <div className={classes.historyRight}>
          <p>
            <span style={{ fontSize: "20px" }}>
              <b>Query: </b>
            </span>
            {currentFileRes.query}
          </p>
          <br />
          {currentFileRes.results?.length > 0 && (
            <CsvDropDown contents={currentFileRes.results.map((jsonString) => JSON.parse(jsonString))} />
          )}
          <div className={classes.imageContainer}>
            {currentFileRes.results?.map((jsonString) => JSON.parse(jsonString)).map((res, index) => (
              <div className={classes.imG} key={index}>
                <img src={res.img_path} alt={res.img_path} />
                <p>{res.format}</p>
                {res.answer !== undefined && (
                  <input
                    value={res.answer || ""} // Use an empty string if answer is undefined
                    onChange={(e) => {
                      // Handle input change if necessary
                      // Example: update state or call a function to manage the answer
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Notification />
    </>
  )
}
