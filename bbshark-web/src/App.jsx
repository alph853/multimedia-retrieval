import { useContext, useState } from 'react'
import './App.css'
import Navbar from './components/navbar'
import Left from './components/left'
import Right from './components/right'
import SideBar from './components/side-bar'
import DrawingBoard from './components/left/draw-input/pop-up'
import { GlobalContext } from './context'
import { CSSTransition } from "react-transition-group"


function App() {
  const {closeBoard, setCloseBoard} = useContext(GlobalContext);

  return (
    <div className="app">
      <Navbar></Navbar>
      <div style={{ marginTop: "20px", display: "flex" }}>
        <Left></Left>
        <Right></Right>
      </div>
      <SideBar></SideBar>
      <CSSTransition
        in={!closeBoard}
        timeout={300}
        classNames="drawing-board"
        unmountOnExit
      >
        <DrawingBoard></DrawingBoard>
      </CSSTransition>
    </div>
  )
}

export default App
