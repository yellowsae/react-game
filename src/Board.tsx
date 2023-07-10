
import { useState } from "react"


interface SquareProps {
  // value: X | O | null
  value: string | null,
  onSquareClick: () => void,
  isWinnerSquare: boolean | null
}

const Square = (props: SquareProps) => {
  const { value, onSquareClick, isWinnerSquare } = props

  const winnerClassName = isWinnerSquare ? 'text-red-600' : ''

  return (
    <button
      onClick={onSquareClick}
      className={`square text-black-600 font-bold w-5 h-5 m-1 text-center text-gray-600 border border-gray-300 ${winnerClassName}`}
    >{value}
    </button>

  )
}

interface BoardProps {
  squares: (string | null)[],
  xIsNext: boolean,
  onPlay: (nextSquares: (string | null)[]) => void
}

const Board = (props: BoardProps) => {

  const { xIsNext, squares, onPlay } = props

  // 状态提升 
  // 将子组件的状态提升到父组件中
  // const [square, setSquare] = useState<(string | null)[]>(Array(9).fill(null))

  // 交替落子
  // const [xIsNext, setXIsNext] = useState<boolean>(true)

  // 更新 state 的方法
  const handleClick = (i: number) => {
    // 如果 Square 组件已经有了值
    // 或者已经有玩家获胜
    if (squares[i] || calculateWinner(squares)) {
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
    const nextSquare = squares.slice()

    // 交替落子 
    if (xIsNext) {
      nextSquare[i] = 'X'

    } else {
      nextSquare[i] = 'O'
    }

    // 使用 onPlay 方法来更新 state
    onPlay(nextSquare)

    // 更新 state
    // setSquare(nextSquare)

    // 更新 xIsNext
    // setXIsNext(!xIsNext)
  }


  // 获胜玩家 的提示
  // const winner: string | null = calculateWinner(squares)
  const winner: any = calculateWinner(squares)
  let status: string;



  if (winner?.length > 0) {
    // 获胜玩家 的提示
    status = 'Winner: ' + squares[winner[0]];
  } else if (squares.every(item => item !== null)) {
    // 平局 的提示
    status = 'Draw'
  } else {
    // 交替落子
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }



  // 2. 重写 Board 组件，使用两个循环来制作方格，而不是在代码中写死它们。

  // 2.1 render 方法
  const renderSquare = (i: number) => {
    // 判断方块是否为获胜方块
    const isWinnerSquare = winner && winner.includes(i)
    return (
      <Square value={squares[i]} onSquareClick={() => handleClick(i)} isWinnerSquare={isWinnerSquare} />
    )
  }
  // 设置棋盘大小 
  const boardSize = 3

  // 存储 renderSquare 方法返回的 JSX 元素
  const squaresList: JSX.Element[] = []

  // 循环 
  for (let i = 0; i < boardSize; i++) {
    // 存储每一行的 JSX 元素
    const row: JSX.Element[] = []

    for (let j = 0; j < boardSize; j++) {
      // index 为每一个方格的索引
      const index = i * boardSize + j

      row.push(renderSquare(index))
    }
    // 添加每一行的 JSX 元素
    squaresList.push(<div className="board-row" key={i}>{row}</div>)
  }


  return (
    <>
      <div className="font-bold">{status}</div>
      {squaresList}
      {/* <div className="board">
        <Square value={squares[0]} onSquareClick={
          // 改为 () => handleClick(0) : 为了避免在渲染时就调用 handleClick，而是在点击时才调用
          // 如果是之前的 handleClick(0) : 则会在渲染时就调用 handleClick
          () => handleClick(0)
        }
        />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}
    </>
  )
}



const Game = () => {

  // 存储 state 玩家落子的数据
  const [history, setHistory] = useState<any>([Array(9).fill(null)])

  // 用户当前正在查看的步骤
  const [currentMove, setCurrentMove] = useState<number>(0)

  const xIsNext: boolean = (currentMove % 2) === 0

  // 取出当前的棋盘数据， 也就要渲染的数据
  // const currentSquares = history[history.length - 1]
  const currentSquares = history[currentMove]

  // 3. 添加一个切换按钮，允许您以升序或降序对历史记录进行排序。
  // 增加排序的状态
  const [isAscending, setIsAscending] = useState<boolean>(true)

  // 存储 state 历史落子的数据
  const handlePlay = (nextSquares: (string | null)[]) => {
    // TODO
    // 你现在正在使用 history state 变量来存储这些信息
    // setHistory([...history, nextSquares])

    // 修改 回到过去 的某个步骤
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)

    // 每次落子时，你都需要更新 currentMove 以指向最新的历史条目。
    setCurrentMove(nextHistory.length - 1)

    // setXIsNext(!xIsNext)
  }


  // jumpTo 方法 - 跳转到历史记录中的某一步
  const jumpTo = (nextMove: number) => {
    // 正在查看的步骤
    setCurrentMove(nextMove)

    // 如果你将 currentMove 更改为偶数，你还将设置 xIsNext 为 true。
    // setXIsNext(nextMove % 2 === 0)
  }

  // 1. 仅针对当前着手，显示“You are at move #…”而不是按钮。
  //  - 其实就是不显示按钮， 只显示文字


  // 2. 对于每个历史记录按钮，将其格式更改为（行，列）格式，而不是数字。
  // 3. 在历史记录列表中加粗当前选择的项目。
  // 4. 重写 Board 组件，使用两个循环来制作方格，而不是在代码中写死它们。
  // 5. 添加一个切换按钮，允许您以升序或降序对历史记录进行排序。
  // 6. 每当有人获胜时，高亮显示连成一线的三个方格。
  // 7. 当无人获胜时，显示一个平局的消息。



  // 显示历史记录
  const moves = history.map((_squares: (string | null)[], move: number) => {
    let description;
    if (move > 0) {
      // 提示信息
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {/* // 1. 仅针对当前着手，显示“You are at move #…”而不是按钮。 */}
        {
          move === currentMove ? (
            <strong>“You are at move  #{move}”</strong>
          ) : (<button onClick={() => jumpTo(move)} >{description}</button>)
        }
      </li>
    )
  })


  // 增加排序的状态
  if (!isAscending) {
    moves.reverse()
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="btn" onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? '降序' : '升序'}
        </button>
        <ol>
          {moves}
        </ol>
      </div>
    </div>
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
      // return squares[a];
      // 每当有人获胜时，高亮显示连成一线的三个方格。
      // - 返回获胜的三个方格的下标
      return [a, b, c]
    }
  }
  return null
}

export default Game
