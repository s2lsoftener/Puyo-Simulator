const Constants = {}
Constants.Puyo = {
  None: '0',
  Red: 'R',
  Green: 'G',
  Blue: 'B',
  Yellow: 'Y',
  Purple: 'P',
  Nuisance: 'J',
  Point: 'T',
  Sun: 'S',
  Hard: 'H',
  Iron: 'I',
  Block: 'L'
}

// Turn text array into an object array containing Puyo objects
// function chainTextToObject (text_array) {
//   let obj_array = []
//   for (let y = 0; y < text_array.length; y++) {
//     obj_array[y] = []
//     for (let x = 0; x < text_array[y].length; x++) {
//       obj_array[y][x] = {puyo: text_array[y][x], x: x, y: y}
//     }
//   }
//   return obj_array
// }

// Define Puyo object constructor
const Puyo = function (color, x, y) {
  this.puyo = color
  this.x = x
  this.y = y
  this.newY = y
  this.yDiff = this.newY - this.y
  this.toPop = false
  this.toDrop = false
}

Puyo.prototype = {
  isColoredPuyo: function () { // Puyo object. Return this puyo's validity if no args are supplied
    return (this.puyo === Constants.Puyo.Red ||
            this.puyo === Constants.Puyo.Green ||
            this.puyo === Constants.Puyo.Blue ||
            this.puyo === Constants.Puyo.Yellow ||
            this.puyo === Constants.Puyo.Purple)
  },
  checkSides: function (field) {
    let sides = []

    // Check left
    if (this.x > 0) {
      if (field.map[this.y][this.x].puyo === field.map[this.y][this.x - 1].puyo) {
        sides.push(field.map[this.y][this.x - 1])
      }
    }

    // Check up
    if (this.y > field.hiddenRows) { // Edit this later to account for SEGA vs COMPILE hidden row behavior
      if (field.map[this.y][this.x].puyo === field.map[this.y - 1][this.x].puyo) {
        sides.push(field.map[this.y - 1][this.x])
      }
    }

    // Check right
    if (this.x < field.columns - 1) {
      if (field.map[this.y][this.x].puyo === field.map[this.y][this.x + 1].puyo) {
        sides.push(field.map[this.y][this.x + 1])
      }
    }

    // check down
    if (this.y < field.totalRows - 1) {
      if (field.map[this.y][this.x].puyo === field.map[this.y + 1][this.x].puyo) {
        sides.push(field.map[this.y + 1][this.x])
      }
    }
    return sides
  },
  adjacentPuyos: function (field) {
    let sides = this.checkSides(field)
    let puyos = []
    for (let s = 0; s < sides.length; s++) {
      if (sides[s].puyo === Constants.Puyo.Red || sides[s].puyo === Constants.Puyo.Green ||
          sides[s].puyo === Constants.Puyo.Blue || sides[s].puyo === Constants.Puyo.Yellow ||
          sides[s].puyo === Constants.Puyo.Purple) {
        puyos.push(sides[s])
      }
    }
    return puyos
  },
  adjacentNuisance: function (field) {
    let sides = this.checkSides(field)
    let nuisance = []
    for (let s = 0; s < sides.length; s++) {
      if (sides[s].puyo === Constants.Puyo.Nuisance) {
        nuisance.push(sides[s])
      }
    }
    return nuisance
  }
}

const Field = function (settings, textArray) {
  this.visibleRows = settings.visibleRows
  this.columns = settings.columns
  this.hiddenRows = settings.hiddenRows
  this.totalRows = settings.visibleRows + settings.hiddenRows
  this.cellWidth = 32 // pixels
  this.cellHeight = 32 // pixels
  this.puyoToClear = 4
  this.fieldWidthPx = this.cellWidth * (this.columns + 2)
  this.fieldHeightPx = this.cellHeight * (this.visibleRows + this.hiddenRows + 2)
  this.scaling = settings.scaling

  let yMax, xMax
  if (textArray.length >= this.totalRows) {
    yMax = this.totalRows
  } else {
    yMax = textArray.length
  }
  if (textArray[0].length >= this.columns) {
    xMax = this.columns
  } else {
    xMax = textArray[0].length
  }
  let rowDiff = textArray.length - this.totalRows

  if (textArray !== undefined) {
    // Empty matrix of proper width & height
    this.map = []
    for (let y = 0; y < textArray.length; y++) {
      this.map[y] = []
      for (let x = 0; x < textArray[y].length; x++) {
        this.map[y][x] = new Puyo(Constants.Puyo.None, x, y)
      }
    }

    for (let y = yMax - 1; y >= rowDiff || y >= 0; y--) {
      for (let x = 0; x < xMax; x++) {
        this.map[y][x] = new Puyo(textArray[y][x], x, y)
      }
    }
  } else {
    this.map = []
    for (let y = 0; y < textArray.length; y++) {
      this.map[y] = []
      for (let x = 0; x < textArray[y].length; x++) {
        this.map[y][x] = new Puyo(Constants.Puyo.None, x, y)
      }
    }
  }
}

const Simulate = {
  filterColors: function (value, index, self) {
    return self.indexOf(value === index)
  },
  checkPops: function (field) { // field = Field obj
    // Create a matrix that tracks which cells have already been checked
    let checkMatrix = []
    for (let y = 0; y < field.totalRows; y++) {
      checkMatrix[y] = []
      for (let x = 0; x < field.columns; x++) {
        checkMatrix[y][x] = false
      }
    }

    // Return variables for later.
    let poppingGroups = [] // Each separate group that's popping
    let colors = [] // Each color currently popping (max 5)

    // Loop through the matrix.
    // If the loop comes across a puyo, start a "group search".
    for (let y = field.hiddenRows; y < field.totalRows; y++) {
      for (let x = 0; x < field.columns; x++) {
        if (field.map[y][x].isColoredPuyo() && checkMatrix[y][x] === false) {
          checkMatrix[y][x] = true // Mark the current cell as checked
          // Using the current Puyo, initialize a group
          let group = [] // Expects {puyo:_, x:_, y:_}

          group.push(field.map[y][x])
          for (let i = 0; i < group.length; i++) {
            // Get Puyos around this Puyo (group[i])
            let puyosAround = group[i].checkSides(field) // returns [{}] array of objects

            // Check this list of adjacent Puyos to see if they're the same color.
            // Only push them to "group" if they haven't been checked yet.
            for (let s = 0; s < puyosAround.length; s++) {
              let currentPuyo = puyosAround[s]

              if (currentPuyo.puyo === group[i].puyo && checkMatrix[currentPuyo.y][currentPuyo.x] === false) {
                checkMatrix[currentPuyo.y][currentPuyo.x] = true
                group.push(currentPuyo)
              }
            }
          }
          if (group.length >= field.puyoToClear) {
            poppingGroups.push(group)
            colors.push(group[0].puyo) // Push a color code
          }
        }
      }
    }

    // Get set of colors popping without duplicates
    let poppingColors = colors.filter(this.filterColors)

    return {poppingGroups, poppingColors}
  },
  checkGarbagePops: function (field, popData) {
    let check = []
    for (let y = 0; y < field.totalRows; y++) {
      check[y] = []
      for (let x = 0; x < field.columns; x++) {
        check[y][x] = false
      }
    }

    if (popData.poppingGroups.length > 0) {
      let groupData = popData.poppingGroups // alias
      let garbageToClear = [] // Initialize return variable

      for (let group in groupData) {
        for (let puyo in groupData[group]) {
          let x = groupData[group][puyo].x
          let y = groupData[group][puyo].y

          if (y > 0) { // Check up
            if (field.map[y - 1][x].puyo === Constants.Puyo.Nuisance && check[y - 1][x] === false) {
              check[y - 1][x] = true
              garbageToClear.push(field.map[y - 1][x])
            }
          }
          if (x > 0) { // Check left
            if (field.map[y][x - 1].puyo === Constants.Puyo.Nuisance && check[y][x - 1] === false) {
              check[y][x - 1] = true
              garbageToClear.push(field.map[y][x - 1])
            }
          }
          if (x < field.columns - 1) { // Check right
            if (field.map[y][x + 1].puyo === Constants.Puyo.Nuisance && check[y][x + 1] === false) {
              check[y][x + 1] = true
              garbageToClear.push(field.map[y][x + 1])
            }
          }
          if (y < (field.visibleRows + field.hiddenRows) - 1) {
            if (field.map[y + 1][x].puyo === Constants.Puyo.Nuisance && check[y + 1][x] === false) {
              check[y + 1][x] = true
              garbageToClear.push(field.map[y + 1][x])
            }
          }
        }
      }
      return garbageToClear
    } else {
      return []
    }
  },
  clearPuyos: function (field) {
    let newField = JSON.parse(JSON.stringify(field)) // Deep copy the field
    let popData = this.checkPops(field)
    let garbageToClear = this.checkGarbagePops(field, popData)

    let animationMatrix = []
    for (let y = 0; y < field.totalRows; y++) {
      animationMatrix[y] = []
      for (let x = 0; x < field.columns; x++) {
        animationMatrix[y][x] = false
      }
    }

    if (popData.poppingGroups.length > 0) {
      let groupData = popData.poppingGroups // alias

      for (let group in groupData) {
        for (let puyo in groupData[group]) {
          let x = groupData[group][puyo].x
          let y = groupData[group][puyo].y

          groupData[group][puyo].toPop = true // Set the animation state of the puyo that will disappear.

          newField.map[y][x] = new Puyo(Constants.Puyo.None, x, y)
          animationMatrix[y][x] = true
        }
      }
    }

    if (garbageToClear.length > 0) {
      for (let garbage in garbageToClear) {
        let x = garbageToClear[garbage].x
        let y = garbageToClear[garbage].y

        garbageToClear[garbage].toPop = true // Set animation state of garbage to clear

        newField.map[y][x] = new Puyo(Constants.Puyo.None, x, y)
        animationMatrix[y][x] = true
      }
    }
    return {newField, popData, garbageToClear, animationMatrix}
  },
  dropPuyos: function (field) {
    let dropMatrix = [] // Initialize matrix that will have the Puyos in their positions after they fall. Holds objects

    for (let y = 0; y < field.totalRows; y++) {
      dropMatrix[y] = []
    }

    for (let x = 0; x < field.columns; x++) {
      // Get a 1D array with the current column, but from bottom to top.
      let currentColumn = []
      for (let y = field.totalRows - 1; y >= 0; y--) {
        currentColumn.push(field.map[y][x]) // Push Puyo objects to this column
      }

      // Get an array that contains the real Puyo objects (i.e., not Constants.Puyo.None)
      let realPuyos = []
      for (let i = 0; i < currentColumn.length; i++) {
        if (currentColumn[i].puyo !== Constants.Puyo.None) {
          realPuyos.push(currentColumn[i])
        }
      }

      // Push the realPuyos one by one into a new array.
      // However, if the next puyo is a bLock, check if the length of the new array matches where the block should be inserted at.
      // If it doesn't, push an empty cell instead.
      let droppedCol = []
      for (let i = 0; i < realPuyos.length; i++) {
        if (realPuyos[i].puyo === Constants.Puyo.Block) {
          let neededLength = (field.totalRows - 1) - realPuyos[i].y
          if (droppedCol.length < neededLength) {
            let emptyCell = new Puyo(Constants.Puyo.None, x, (field.totalRows - 1) - droppedCol.length)
            droppedCol.push(emptyCell)
            i -= 1 // Step back once in the loop and try to add the Block again at the right row.
          } else {
            droppedCol.push(realPuyos[i]) // Push the block Puyo
          }
        } else {
          droppedCol.push(realPuyos[i]) // Push the normal Puyos.
        }
      }

      // Add in empty cells to make sure the length of this column matches field.totalRows
      for (let i = droppedCol.length; i < field.totalRows; i++) {
        let emptyCell = new Puyo(Constants.Puyo.None, x, (field.totalRows - 1) - droppedCol.length)
        droppedCol.push(emptyCell)
      }

      // Reverse the array so the column goes from top to bottom again.
      droppedCol.reverse()

      // Add the dropped column to the dropMatrix.
      for (let y = 0; y < droppedCol.length; y++) {
        dropMatrix[y][x] = droppedCol[y]
      }
    }

    // Loop through the dropMatrix and assign the Puyo objects their new Y position to newY.
    for (let y = 0; y < dropMatrix.length; y++) {
      for (let x = 0; x < dropMatrix[y].length; x++) {
        dropMatrix[y][x].newY = y
        dropMatrix[y][x].yDiff = dropMatrix[y][x].newY - dropMatrix[y][x].y
      }
    }

    // Create a matrix that'll hold a string representation of dropMatrix
    // Also, create a matrix that has the drop distances (based on yDiff)
    let dropResult = []
    let dropDistances = []

    for (let y = 0; y < field.totalRows; y++) {
      dropResult[y] = []
      dropDistances[y] = []
      for (let x = 0; x < field.columns; x++) {
        dropResult[y][x] = dropMatrix[y][x]
        dropDistances[y][x] = field.map[y][x].yDiff
      }
    }
    return {dropResult: dropResult, dropDistances: dropDistances}
  }
}

const mapToStringArray = function (map) {
  // Turn a chain object map to a 2D array with strings.
  let newMap = []
  for (let y = 0; y < map.length; y++) {
    newMap[y] = []
    for (let x = 0; x < map[0].length; x++) {
      newMap[y][x] = map[y][x].puyo
    }
  }
  return newMap
}

// export {Constants, Puyo, Field, Simulate}
const Chainsim = {
  Constants: Constants,
  Puyo: Puyo,
  Field: Field,
  Simulate: Simulate,
  mapToStringArray: mapToStringArray
}

export default Chainsim
