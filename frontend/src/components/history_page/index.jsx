import { useEffect, useState } from "react"
import classes from './styles.module.css'
import axios from "axios"
import { toast } from "react-toastify"
import Notification from "../../components/notification"
import CsvDropDown from "./csv_dropdown"

export default function History() {
  const [historyResponse, setHistoryResponse] = useState({})
  const [test, setTest] = useState(["query-1-kis", "query-2-qa"])
  const [currentFileRes, setCurrentFileRes] = useState({
    request: null,
    results: [
      {
        img_path: "L01/V0001/0007.webp",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path: "L01/V0001/0007.webp",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path: "L01/V0001/0007.webp",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path: "L01/V0001/0007.webp",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path: "L01/V0001/0007.webp",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path: "L01/V0001/0007.webp",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
    ],
    query:
      "Đoạn giới thiệu về lễ hội Việt - Nhật. Trong lễ hội có các phân cảnh những chiếc lồng đèn có ảnh của chú mèo máy Doraemon khổng lồ và có những người xung quanh chụp ảnh với nó",
  })

  useEffect(() => {
    axios
      .get("https://promoted-strictly-narwhal.ngrok-free.app/get_history")
      .then((res) => {
        console.log(res)
        setHistoryResponse(JSON.parse(res.data))
        console.log("History data: ", res.data)
        // toast.success("Get history completed");
      })
      .catch((err) => {
        console.error("Search failed:", err.message)
        // toast.error(`History failed: ${err.message || "An unknown error occurred"}`);
      })
  }, [])

  function handleSubmitQuery(el) {
    axios
      .get(`https://promoted-strictly-narwhal.ngrok-free.app/${el}`)
      .then((res) => {
        console.log(res)
        setCurrentFileRes(JSON.parse(res.data))
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
            {test.map((el) => (
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
          {currentFileRes.results?.length > 0 && (
            <CsvDropDown contents={currentFileRes.results} />
          )}
        </div>
      </div>

      <Notification />
    </>
  )
}
