import React, { useState, useEffect } from "react";
import Question from "./components/Question";
import { nanoid } from "nanoid"

export default function App() {

  //STATES

  const [intro, setIntro] = useState(true)
  const [allQuestions, setAllQeustions] = useState()
  const [questions, setQuestions] = useState()
  const [questionElems, SetQuestionElems] = useState()
  const [checked, setChecked] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  //EFFECTS

  useEffect(() => {
    async function getQuestions() {
      const res = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple")
      const data = await res.json()
      setAllQeustions(data.results)
    }
    getQuestions()
  }, [])

  useEffect (() => {
    if (allQuestions != undefined) {
      GenerateQuestions()
    }
  }, [allQuestions])

  useEffect(() => {
    if (questions != undefined) {
      SetQuestionElems(questions.map(obj => {
        return (
          <React.Fragment key={obj.id + "FRAGMENT"}>
            <Question
              key={obj.id}
              question={obj.question}
              answers={obj.answers}
              correct={obj.correct}
              id={obj.id}
              choice={obj.choice}
              styles={obj.styles}
              func={HandleChoice}
              addCorrect={AddCorrect}
            />
            <hr key={obj.id + "hrElement"} />
          </React.Fragment>
        )
      }))
    }
  }, [questions])

  // GENERATE QUESTIONS

  function GenerateNewQuestion(index) {
    //shuffle answers
    const answersArray = allQuestions[index].incorrect_answers
    answersArray.push(allQuestions[index].correct_answer)
    let shuffledAnswesrs = answersArray.sort(function () {
      return Math.random() - 0.5;
    });

    //decode question and answers  
    const deCodedQuestion = allQuestions[index].question
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&eacute;/g, "é")
      .replace(/&uuml;/g, "ü")
      .replace(/&oacute;/g, "ó")

    const DeCodedShuffledAnswesrs =  shuffledAnswesrs.map(ans => {
      return ans
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&eacute;/g, "é")
        .replace(/&uuml;/g, "ü")
        .replace(/&oacute;/g, "ó")
    })
    return (
      {
        question: deCodedQuestion,
        answers: DeCodedShuffledAnswesrs,
        correct: allQuestions[index].correct_answer,
        id: nanoid(),
        choice: null,
        styles: ["ans", "ans", "ans", "ans"]
      }
    )
  }

  function GenerateQuestions() {
    let newQuestions = []
    for (let i = 0; i < 5; i++) {
      newQuestions.push(GenerateNewQuestion(i))
    }
    setQuestions(newQuestions)
  }

  //CHANGE PAGES

  function ChangeToQuestions() {
    setIntro(!intro)
  }

  function HandleChoice(ans, id, index) {
    if (!checked) {
      setQuestions(prev => prev.map((qus) => {
        let returning
        if (qus.id == id) {
          let newStyles = []
          for (let i = 0; i < qus.styles.length; i++) {
            i == index ? newStyles.push("choice") : newStyles.push("ans")
          }
          returning = {...qus, choice: ans, styles: newStyles}
        } else {
          returning = {...qus}
        }
        return (
          returning
        )
      }))
    }
  }

  //CHECK ANSWERS
  function HandleCheck() {
    setQuestions(prev => prev.map((qus) => {
      //lets see if I can add styles to all of them
      let returning
      if (qus.choice == qus.correct) { //selected the correct answer
        AddCorrect()
        let newStyles = []
        for(let i = 0; i < qus.styles.length; i++) {
          i == qus.answers.indexOf(qus.correct) ? newStyles.push("correct") : newStyles.push("ans")
        }
        returning = {...qus, styles: newStyles}
      } else {
        let newStyles = []
        for(let i = 0; i < qus.styles.length; i++) {
          if (i == qus.answers.indexOf(qus.correct)) {
            newStyles.push("correct")
          } else if (i == qus.answers.indexOf(qus.choice)) {
            newStyles.push("incorrect")
          } else {
            newStyles.push("ans")
          }
        }
        returning = {...qus, styles: newStyles}
      }
      return returning
    }))
    setChecked(!checked)
  }

  //count correct ans
  function AddCorrect() {
    setCorrectAnswers(prev => prev += 1)
  }

  //PLAY AGAIN
  function HandleAgain() {
    window.location.reload()
  }

  return (
    <main>
      {intro ?
      <div className="intro">
        <h1 className="title">Quizzical</h1>
        <p className="desc">Some description if needed</p>
        <button onClick={ChangeToQuestions} className="start-btn">Start quiz</button>
      </div>
      :
      <div className="form-cont">
        {questionElems}
        {!checked
          ? <button onClick={HandleCheck} className="check-btn">Check answers</button>
          : <div className="footer">
              <p className="score">You scored {correctAnswers}/5 correct answers</p>
              <button onClick={HandleAgain} className="check-btn">Play again</button>
            </div>
        }
        </div>
      }
    </main>
  )
}