
import { useState } from "react"


interface SquareProps {
  // value: X | O | null
  value: string | null,
  onSquareClick: () => void
}

const Square = (props: SquareProps) => {
  const { value, onSquareClick } = props
  return (
    <button
      onClick={onSquareClick}
      className="square text-black-600 font-bold w-5 h-5 m-1 text-center text-gray-600 border border-gray-300"
    >{value}
    </button>

  )
}

const Board = () => {
  // 状态提升 
  // 将子组件的状态提升到父组件中
  const [square, setSquare] = useState<(string | null)[]>(Array(9).fill(null))

  // 交替落子
  const [xIsNext, setXIsNext] = useState<boolean>(true)

  // 更新 state 的方法
  const handleClick = (i: number) => {
    // 如果 Square 组件已经有了值
    // 或者已经有玩家获胜
    if (square[i] || calculateWinner(square)) {
      return
    }

    // nextSquare 为 square 的副本
    /**
     * .slice() 来创建 squares 数组的副本而不是修改现有数组。
     * 
     * 通常有两种更改数据的方法。
     *  - 第一种方法是通过直接更改数据的值来改变数据。
     *  - 第二种方法是使用具有所需变化的新副本替换数据。
     * 
     * 
     * 
     * 
     * 拷贝副本数据的好处
     *  - 不变性使复杂的功能更容易实现。
     *  - 跟踪数据的变化更容易。能够让我们实现“撤消”和“重做”功能。
     *  - 避免数据直接突变可以让你保持以前版本的数据完好无损
     * 
     *  - 默认情况下，当父组件的 state 发生变化时，所有子组件都会自动重新渲染。
     *    这甚至包括未受变化影响的子组件，这可能会在应用程序变得非常庞大时导致性能问题
     *    这时使用 拷贝副本数据 的好处就体现出来了
     *  
     * 
     */
    const nextSquare = square.slice()

    // 交替落子 
    if (xIsNext) {
      nextSquare[i] = 'X'

    } else {
      nextSquare[i] = 'O'
    }

    // 更新 state
    setSquare(nextSquare)

    // 更新 xIsNext
    setXIsNext(!xIsNext)
  }

  // 重置棋盘
  const clearSquare = () => {
    setSquare(Array(9).fill(null))
  }

  // 获胜玩家 的提示
  const winner: string | null = calculateWinner(square)
  let status: string;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    // 交替落子
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  return (
    <>
      <div className="font-bold">{status}</div>
      <div className="board">
        <Square value={square[0]} onSquareClick={
          // 改为 () => handleClick(0) : 为了避免在渲染时就调用 handleClick，而是在点击时才调用
          // 如果是之前的 handleClick(0) : 则会在渲染时就调用 handleClick
          () => handleClick(0)
        }
        />
        <Square value={square[1]} onSquareClick={() => handleClick(1)} />
        <Square value={square[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board">
        <Square value={square[3]} onSquareClick={() => handleClick(3)} />
        <Square value={square[4]} onSquareClick={() => handleClick(4)} />
        <Square value={square[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board">
        <Square value={square[6]} onSquareClick={() => handleClick(6)} />
        <Square value={square[7]} onSquareClick={() => handleClick(7)} />
        <Square value={square[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <div>
        <button onClick={clearSquare} className="">Rest</button>
      </div>
    </>
  )
}


// 辅助函数 - 判断是否有玩家获胜
function calculateWinner(squares: (string | null)[]) {
  // 列举所有获胜的情况
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    // 如果有玩家获胜
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 返回获胜玩家
      return squares[a];
    }
  }
  return null
}

export default Board
