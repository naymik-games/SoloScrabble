let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 75,
  offsetY: 300,
  rows: 10,
  cols: 8,
  gameMode: 'time', //moves, challenge
  defaultTime: 60,



}
let gameLoad = 'new'
var starterWordsString = 'first twist dog falcon faster quake beach solo house lazy xenial lucid zebras board tile mouse catch witch auto famine cat jumbo table abroad news school guilty simple water hunter'
var starterWords = []
let loadedGame;
let save = {
  score: null,
  totalScore: null,
  boardNum: null,
  rack: [],
  board: [],
  words: [],
  notWords: [],
  bag: []
}
let gameSettings;
var defaultValues = {
  topScore: 0,
  lastScore: 0,
  mostWordsFound: 0
}
// the tiles in scrabble
// NAME : [count, score]
const scrabbleLettersDict = {
  "*": [2, 0],
  "a": [9, 1],
  "b": [2, 3],
  "c": [2, 3],
  "d": [4, 2],
  "e": [12, 1],
  "f": [2, 4],
  "g": [3, 2],
  "h": [2, 4],
  "i": [9, 1],
  "j": [1, 8],
  "k": [1, 5],
  "l": [4, 1],
  "m": [2, 3],
  "n": [6, 1],
  "o": [8, 1],
  "p": [2, 3],
  "q": [1, 10],
  "r": [6, 1],
  "s": [4, 1],
  "t": [6, 1],
  "u": [4, 1],
  "v": [2, 4],
  "w": [2, 4],
  "x": [1, 8],
  "y": [2, 4],
  "z": [1, 10]
} 
