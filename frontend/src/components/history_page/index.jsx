import { useEffect, useState } from "react"
import classes from './styles.module.css'
import axios from "axios"
import { toast } from "react-toastify"
import Notification from "../../components/notification"
import CsvDropDown from "./csv_dropdown"

export default function History() {
  const [historyResponse, setHistoryResponse] = useState([])
  const [test, setTest] = useState(["query-1-kis", "query-2-qa"])
  const [currentFileRes, setCurrentFileRes] = useState({
    request: null,
    results: [
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
        scene_id: "/L01/V001/2",
        frm_number: 7,
        format: "L01_V001, 229",
        timeframe: 9,
        publish_date: "31/10/2023",
        watch_url: "https://youtube.com/watch?v=1yHIy8dYh...",
        answer: "244550",
      },
      {
        img_path:
          "https://i.pinimg.com/736x/53/fb/f4/53fbf4e08a0116cbb0200a61c08f15e6.jpg",
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
      .post("https://localhost:8000/get_history")
      .then((res) => {
        console.log(res)
        
        console.log("History data: ", res.data)
        setHistoryResponse(res.data)
        // toast.success("Get history completed");
      })
      .catch((err) => {
        console.error("Search failed:", err.message)
        // toast.error(`History failed: ${err.message || "An unknown error occurred"}`);
      })
  }, [])

  function handleSubmitQuery(el) {
    axios
      .post(`https://localhost:8000/history/${el}`)
      .then((res) => {
        console.log(res)
        setCurrentFileRes(res.data)
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
            <CsvDropDown contents={currentFileRes.results} />
          )}
          <div className={classes.imageContainer}>
            {currentFileRes.results?.map((res) => (
              <div className={classes.imG}>
                <img src={res.img_path} alt={res.img_path}/>
                <p>{res.format}</p>
                {
                  res.answer === ""?null:<input value={res.answer} />
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      <Notification />
    </>
  )
}
