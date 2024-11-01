import { useState, useEffect } from "react";
import './App.css'

function App() {
  useEffect(() => {
    console.log("初回のみ実行");
  }, []);
  const [num, setNum] = useState(-1);

  const MakeRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const onClick = () => {
    setNum(MakeRandomNumber(0, 200));
  }

  return (
    <>
      <div className="bg-yellow-100 h-screen font-mono">
        <div className="bg-amber-500 sticky top-0 h-15 p-2 text-xl">
          <h1 className="text-white font-semibold italic">OVER THE SUNエピソードおみくじ</h1>
        </div>
        <div className="flex items-center justify-center h-80">
          <div className="flex flex-col items-center space-y-6">
            { num < 0 ? 
              <p className="text-2xl text-slate-500">ボタンを押してください</p>
              : 
              <><p className="text-xl">あなたへのおすすめは... </p>
                <p className="text-2xl text-slate-500">Ep.{num}</p>
              </> 
            }
            <button className="px-4 py-2 bg-emerald-600 text-white rounded" onClick={onClick}>Click Me</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App