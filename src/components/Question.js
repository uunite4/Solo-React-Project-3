import React, { useState } from "react";

export default function Question(props) {

  return (
    <div className="ques-cont">
      <p className="ques">{props.question}</p> 
      <div className="ans-cont">
          <div onClick={() => {props.func(props.answers[0], props.id, 0)}} className={props.styles[0]}>{props.answers[0]}</div>
          <div onClick={() => {props.func(props.answers[1], props.id, 1)}} className={props.styles[1]}>{props.answers[1]}</div>
          <div onClick={() => {props.func(props.answers[2], props.id, 2)}} className={props.styles[2]}>{props.answers[2]}</div>
          <div onClick={() => {props.func(props.answers[3], props.id, 3)}} className={props.styles[3]}>{props.answers[3]}</div>
        </div>
      {/* // : <div className="ans-cont">
      //     <div style={() => CheckedStyle(0)} className="ans">{props.answers[0]}</div>
      //     <div style={() => CheckedStyle(1)} className="ans">{props.answers[1]}</div>
      //     <div style={() => CheckedStyle(2)} className="ans">{props.answers[2]}</div>
      //     <div style={() => CheckedStyle(3)} className="ans">{props.answers[3]}</div>
      //   </div>
      //  */}
    </div>
  )
}