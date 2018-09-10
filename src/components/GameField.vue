<template>
  <div id="GameField" v-bind:style="fieldStyling" @mousedown="setMouseDown(true)" @mouseup="setMouseDown(false)">
    <div align-h="center" class="game-container">
      <div class="field-spacer-top"></div>
      <b-row no-gutters>
        <b-col><div class="border-hiddenrow-spacer"></div><div class="border-block-sides"></div></b-col>
        <b-col>
          <div class="field-container"><div class="fieldrow" v-for="(row, indexRow) in Simulator.Field.map" v-bind:key="indexRow"><game-field-cell v-for="(col, indexCol) in row" v-bind:key="indexCol" :indexRow="indexRow" :indexCol="indexCol" :isMouseDown="isMouseDown" :Simulator="Simulator" :fieldState="fieldState" :fieldData="fieldData" v-on:end-popping="togglePoppingCell" v-on:end-dropping="toggleDroppingCell"></game-field-cell></div></div>
        </b-col>
        <b-col><div class="border-hiddenrow-spacer"></div><div class="border-block-sides"></div></b-col>
      </b-row>
      <div class="border-block-bottom"></div>
    </div>
  </div>
</template>

<script>
import GameFieldCell from './GameFieldCell'
import Chainsim from '../assets/js/chainsim'

export default {
  name: 'GameField',
  props: ['fieldState', 'chainAutoPlay', 'togglePlayStep', 'togglePlayChain'],
  components: {
    GameFieldCell
  },
  data () {
    return {
      isMouseDown: false,
      fieldSettings: {}, // Editable field settings, imports from URL or loads defaults on app load.
      fieldData: [['0', '0', '0', '0', '0', '0'], // Placeholder field data for testing purposes
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0'],
                  ['0', '0', '0', '0', '0', '0']], // On app load, this gets set to a field provided via URL. Otherwise, loads a blank field.
      originalField: [],
      poppingCells: [], // boolean 2D matrix that tracks which cells are currently popping
      droppingCells: [], // boolean 2D matrix that tracks which cells are currently dropping
      dropDistances: [], // numeric 2D matrix that contains how far Puyos need to drop during their drop animations
      clearPuyosResult: [],
      dropPuyosResult: []
    }
  },
  methods: {
    setMouseDown: function (bool) {
      this.isMouseDown = bool // true, false
    },
    togglePoppingCell: function (cell) { // expects object of form: {x:int, y:int, bool:boolean}
      this.poppingCells[cell.y].splice(cell.x, 1, cell.bool) // Have to use array methods or this won't be reactive.
    },
    toggleDroppingCell: function (cell) { // expects object of form: {x:int, y:int, bool:boolean}
      this.droppingCells[cell.y].splice(cell.x, 1, cell.bool) // Have to use array methods or this won't be reactive.
    },
    dropPuyos: function () {
      let dropResult = Chainsim.Simulate.dropPuyos(this.Field)
      let anyToDrop = false

      // Create an array that tracks which cells are in their drop animations.
      let dropAnimationArray = []
      for (let y = 0; y < this.Field.totalRows; y++) {
        dropAnimationArray[y] = []
        for (let x = 0; x < this.Field.columns; x++) {
          if (dropResult.dropDistances[y][x] > 0) {
            dropAnimationArray[y][x] = true
            anyToDrop = true
          } else {
            dropAnimationArray[y][x] = false
          }
        }
      }

      this.droppingCells = dropAnimationArray
      this.dropDistances = dropResult.dropDistances
      this.dropPuyosResult = Chainsim.mapToStringArray(dropResult.dropResult)

      if (anyToDrop === false) {
        this.clearPuyos()
      } else {
        this.$emit('update-field-state', 'dropping') // When child component hears 'dropping', it'll trigger drop animations.
        console.log('Set fieldState to "dropping"')
      }
    },
    clearPuyos: function () {
      let clearResult = Chainsim.Simulate.clearPuyos(this.Field)

      // Create an array in the Vuex Store that tracks which cells are animating.
      let popAnimationArray = []
      for (let y = 0; y < this.Field.totalRows; y++) {
        popAnimationArray[y] = []
        for (let x = 0; x < this.Field.columns; x++) {
          if (this.Field.map[y][x].toPop === true) {
            popAnimationArray[y][x] = true
          } else {
            popAnimationArray[y][x] = false
          }
        }
      }
      this.poppingCells = popAnimationArray
      this.clearPuyosResult = Chainsim.mapToStringArray(clearResult.newField.map)

      // If there's no pops to do, set fieldState to 'idle'. Otherwise, set 'popping'
      if (clearResult.popData.poppingGroups.length === 0) {
        this.$emit('update-field-state', 'idle')
        console.log('Set fieldState to "idle"')
      } else {
        this.$emit('update-field-state', 'popping')
        console.log('Set fieldState to "popping"')
      }
    },
    resetField: function () {
      let poppingCells = []
      let droppingCells = []
      let dropDistances = []
      for (let y = 0; y < this.Field.totalRows; y++) {
        poppingCells[y] = []
        droppingCells[y] = []
        dropDistances[y] = []
        for (let x = 0; x < this.Field.columns; x++) {
          poppingCells[y][x] = false
          droppingCells[y][x] = false
          dropDistances[y][x] = false
        }
      }
      this.poppingCells = poppingCells
      this.droppingCells = droppingCells
      this.dropDistances = dropDistances
    },
    playStep: function () {
      if (this.fieldState === 'idle') {
        this.dropPuyos()
      }
    },
    playChain: function () {
      if (this.fieldState === 'idle') {
        this.dropPuyos()
      }
    }
  },
  computed: {
    fieldStyling: function () {
      return {
        '--rescale': 1,
        '--board-columns': this.Field.columns,
        '--board-visiblerows': this.Field.visibleRows,
        '--board-hiddenrows': this.Field.hiddenRows,
        '--board-totalrows': this.Field.totalRows}
    },
    Field: function () {
      return new Chainsim.Field(this.fieldSettings, this.fieldData)
    },
    isPopping: function () {
      if (this.poppingCells.length === this.Field.totalRows) {
        if (this.poppingCells[0].length === this.Field.columns) {
          for (let y = 0; y < this.Field.totalRows; y++) {
            for (let x = 0; x < this.Field.columns; x++) {
              if (this.poppingCells[y][x] === true) {
                return true // If just one cell is still popping, return true. Animations are ongoing.
              }
            }
          }
        }
      }
      return false // If none of the cells are popping, return false. Animations complete.
    },
    isDropping: function () {
      for (let y = 0; y < this.Field.totalRows; y++) {
        for (let x = 0; x < this.Field.columns; x++) {
          if (this.droppingCells[y][x] === true) {
            return true // If just one cell is still dropping, return true. Animations are ongoing.
          }
        }
      }
      return false // If none of the cells are dropping, return false. Animations complete.
    },
    Simulator: function () { // Contains simulator state data to pass on to child components
      return {
        fieldState: this.fieldState,
        Field: this.Field,
        poppingCells: this.poppingCells,
        droppingCells: this.droppingCells,
        dropDistances: this.dropDistances
      }
    }
  },
  watch: {
    isPopping: function (newVal, oldVal) {
      if (newVal === false && oldVal === true) {
        this.fieldData = this.clearPuyosResult
        console.log('set cleared puyo field')
        this.dropPuyos()
      }
    },
    isDropping: function (newVal, oldVal) {
      if (newVal === false && oldVal === true) {
        this.fieldData = this.dropPuyosResult
        console.log('Dropped the new puyo field')
        if (this.chainAutoPlay === true) {
          this.clearPuyos()
        } else {
          this.$emit('update-field-state', 'idle')
        }
      }
    },
    togglePlayStep: function () {
      this.playStep()
    },
    togglePlayChain: function () {
      this.playChain()
    }
  },
  created () {
    // Later on, the app should read in a string from a URL or something.
    // But for now, it'll just load a test field.

    this.fieldSettings = {
      columns: 6,
      visibleRows: 12,
      hiddenRows: 1,
      cellWidth: 32, // pixels
      cellHeight: 32, // pixels
      puyoToClear: 4,
      scaling: 1
    }
    this.fieldData = [['0', '0', '0', '0', '0', '0'],
                      ['0', '0', '0', '0', '0', '0'],
                      ['0', '0', '0', '0', '0', '0'],
                      ['0', '0', '0', '0', '0', '0'],
                      ['0', '0', '0', '0', '0', '0'],
                      ['Y', '0', '0', '0', '0', '0'],
                      ['G', 'Y', '0', '0', '0', '0'],
                      ['G', 'Y', 'P', '0', '0', 'R'],
                      ['Y', 'P', 'P', 'R', '0', 'R'],
                      ['Y', 'Y', 'P', 'J', 'R', 'Y'],
                      ['G', 'R', 'B', 'G', 'Y', 'Y'],
                      ['G', 'G', 'R', 'B', 'G', 'G'],
                      ['R', 'R', 'B', 'B', 'G', 'Y']]
    console.log('Set default field.')
    console.log('Default settings:')
    console.log(this.fieldSettings)

    for (let y = 0; y < this.fieldData.length; y++) {
      this.poppingCells[y] = []
      this.droppingCells[y] = []
      this.dropDistances[y] = []
      this.clearPuyosResult[y] = []
      this.dropPuyosResult[y] = []
      for (let x = 0; x < this.fieldData[0].length; x++) {
        this.poppingCells[y][x] = false
        this.droppingCells[y][x] = false
        this.dropDistances[y][x] = 0
        this.clearPuyosResult[y][x] = '0'
        this.dropPuyosResult[y][x] = '0'
      }
    }
  }
}
</script>

<style scoped>
#GameField {
  position: relative;
  line-height: 0;
  width: calc(calc(var(--board-columns) + 2) * calc(32px * var(--rescale)));
  height: calc(calc(var(--board-totalrows) + 2) * calc(32px * var(--rescale)));
}

.game-container {
  position: absolute;
  top: 0;
  left: 0;
}

.field-spacer-top {
  width: calc(calc(var(--board-columns) + 2) * calc(32px * var(--rescale)));
  height: calc(32px * var(--rescale));
  display: block;
}

.border-hiddenrow-spacer {
  width: calc(32px * var(--rescale));
  height: calc(calc(var(--board-hiddenrows)) * calc(32px * var(--rescale)));
  background-color: rgb(60,60,60);
}

.border-block-sides {
  background-image: url('../assets/puyo/block-border.png');
  width: calc(32px * var(--rescale));
  height: calc(calc(var(--board-visiblerows)) * calc(32px * var(--rescale)));
  background-size: 100%;
}

.border-block-bottom {
  background-image: url('../assets/puyo/block-border.png');
  width: calc(calc(var(--board-columns) + 2) * calc(32px * var(--rescale)));
  height: calc(32px * var(--rescale));
}

.field-container {
  width: calc(calc(var(--board-columns)) * calc(32px * var(--rescale)));
  height: calc(calc(var(--board-totalrows)) * calc(32px * var(--rescale)));
  background-color: rgb(60,60,60);
}
</style>
