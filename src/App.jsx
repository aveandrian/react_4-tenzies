import { useEffect, useState } from 'react'
import './App.css'
import Dice from './components/Dice'
import Confetti from 'react-confetti'
import { nanoid } from 'nanoid'

function App() {
  const [dice, setDice] = useState(allnewDice());
  const [tenzies, setTenzies] = useState(false);
  const [bestScore, setBestScore] = useState(localStorage.getItem('bestScore'))
  const [rollsNumber, setRollsNumber] = useState(0)

  useEffect(()=>{
    let firstValue = dice[0].value;
    if(dice.every(die => die.isHeld && die.value === firstValue)){
      setTenzies(true)
      console.log("You won!")
    }
  }, [dice])

  function allnewDice(){
    let diceArray = []
    for(let i = 0; i < 10; i++){
      diceArray.push( generateNewDie())
    }
    return diceArray;
  }
  
  function generateNewDie(){
    return {
      value: Math.ceil(Math.random() * 6 ),
      isHeld: false,
      id: nanoid()
    }
  }

  function rollDice(){
    setRollsNumber(prevRollsNumber => prevRollsNumber+1)
    if(tenzies){
      setDice(allnewDice())
      setTenzies(false)
      setRollsNumber(0)
      if(rollsNumber < bestScore || bestScore == null)
        setNewBestScore(rollsNumber)
    }
    else
      setDice(prevDiceArr => prevDiceArr.map(dice => {
        return dice.isHeld ? 
          dice : 
          generateNewDie()
      }))
  }

  function setNewBestScore(score){
    localStorage.setItem('bestScore', score)
    setBestScore(score)
  }

  function holdDice(id){
    setDice(prevDiceArr => prevDiceArr.map(prevDice => {
        return prevDice.id === id ? {...prevDice, isHeld: !prevDice.isHeld} : prevDice 
    }))
  }

  const diceElements = dice.map(dice=> <Dice  
    key={dice.id}
    value={dice.value} 
    isHeld={dice.isHeld} 
    holdDice={() => holdDice(dice.id)}
    />)

  return (
    <>
    {tenzies && <Confetti />}
    <main>
      <h1 className='title'>Tenzies</h1>
      <p className='description'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-grid'>
        {diceElements}
      </div>
      <button className='roll-btn' onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
    </main>
    <div className='scoreboard'>
      <h1 className='title'>Rolls number: {rollsNumber}</h1>
      {bestScore && <h1 className='title'>Best score: {bestScore}</h1>}
    </div>
    </>
  )
}

export default App
