<template>
  <v-card id="GameField">
    <v-layout class="game" row justify-center align-center v-bind:style="fieldStyling" @mousedown="setMouseDown(true)" @mouseup="setMouseDown(false)">
      <div class="game-container pa-2 flex justify-center align-center">
        <div class="field-spacer-top"></div>
        <div class="field-container">
          <div class="field-container-bg"></div>
          <div class="fieldrow" v-for="(row, indexRow) in Simulator.Field.map" v-bind:key="indexRow">
            <game-field-cell v-for="(col, indexCol) in row" v-bind:key="indexCol" :indexRow="indexRow"
            :indexCol="indexCol" :isMouseDown="isMouseDown" :Simulator="Simulator" :fieldState="fieldState"
            :fieldData="fieldData" :scaling="scaling" :windowHeight="windowHeight" :simulationSpeed="simulationSpeed"
            v-on:end-popping="togglePoppingCell" v-on:end-dropping="toggleDroppingCell" v-on:edit-puyo-field="editFieldData"></game-field-cell>
          </div>
        </div>
      </div>
    </v-layout>
  </v-card>
</template>

<script>
import GameFieldCell from './GameFieldCell'
import Chainsim from '../assets/js/chainsim'

export default {
  name: 'GameField',
  props: ['fieldState', 'chainAutoPlay', 'togglePlayStep', 'togglePlayChain', 'toggleClearField',
    'simulationSpeed', 'toggleResetField'],
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
      originalField: [['0', '0', '0', '0', '0', '0'], // Placeholder field data for testing purposes
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
        ['0', '0', '0', '0', '0', '0']],
      poppingCells: [], // boolean 2D matrix that tracks which cells are currently popping
      droppingCells: [], // boolean 2D matrix that tracks which cells are currently dropping
      dropDistances: [], // numeric 2D matrix that contains how far Puyos need to drop during their drop animations
      clearPuyosResult: [],
      dropPuyosResult: [],
      windowHeight: 0,
      scaling: 1,
      puyoToPageHeightRatio: 0.035 // 0.054
    }
  },
  methods: {
    setMouseDown: function (bool) {
      this.isMouseDown = bool // true, false
    },
    editFieldData: function (cell) {
      this.fieldData[cell.y].splice(cell.x, 1, cell.puyo)
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
    clearField: function () {
      let poppingCells = []
      let droppingCells = []
      let dropDistances = []
      let originalField = []
      let emptyField = []
      for (let y = 0; y < this.Field.totalRows; y++) {
        poppingCells[y] = []
        droppingCells[y] = []
        dropDistances[y] = []
        originalField[y] = []
        emptyField[y] = []
        for (let x = 0; x < this.Field.columns; x++) {
          poppingCells[y][x] = false
          droppingCells[y][x] = false
          dropDistances[y][x] = false
          originalField[y][x] = '0'
          emptyField[y][x] = '0'
        }
      }
      this.poppingCells = poppingCells
      this.droppingCells = droppingCells
      this.dropDistances = dropDistances
      this.originalField = originalField
      this.fieldData = emptyField
      this.$emit('update-field-state', 'idle')
    },
    playStep: function () {
      if (this.fieldState === 'idle') {
        this.originalField = JSON.parse(JSON.stringify(this.fieldData))
        this.dropPuyos()
      }
    },
    playChain: function () {
      if (this.fieldState === 'idle') {
        this.originalField = JSON.parse(JSON.stringify(this.fieldData))
        this.dropPuyos()
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
      this.$emit('update-field-state', 'idle')
      this.$emit('unset-reset-field', false)
      this.$nextTick(() => {
        this.fieldData = this.originalField
      })
    }
  },
  computed: {
    fieldStyling: function () {
      return {
        '--rescale': this.scaling,
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
        if (this.toggleResetField === true) {
          console.log('Resetting field to prior state.')
          this.resetField()
        } else {
          this.fieldData = this.clearPuyosResult
          console.log('set cleared puyo field')
          this.dropPuyos()
        }
      }
    },
    isDropping: function (newVal, oldVal) {
      if (newVal === false && oldVal === true) {
        if (this.toggleResetField === true) {
          console.log('Resetting field to prior state.')
          this.resetField()
        } else {
          this.fieldData = this.dropPuyosResult
          console.log('Dropped the new puyo field')
          if (this.chainAutoPlay === true) {
            this.clearPuyos()
          } else {
            this.$emit('update-field-state', 'idle')
          }
        }
      }
    },
    togglePlayStep: function () {
      this.playStep()
    },
    togglePlayChain: function () {
      this.playChain()
    },
    toggleClearField: function () {
      this.clearField()
    },
    toggleResetField: function () { // Even though isDropping and isPopping check for this, this still needs to be here so the update appears instant.
      this.resetField()
    },
    windowHeight (newHeight, oldHeight) {
      this.scaling = (this.puyoToPageHeightRatio * this.windowHeight) / 60
    }
  },
  created () {
    // Later on, the app should read in a string from a URL or something.
    // But for now, it'll just load a test field.

    this.fieldSettings = {
      columns: 6,
      visibleRows: 12,
      hiddenRows: 1,
      cellWidth: 72, // pixels
      cellHeight: 68, // pixels
      puyoToClear: 4,
      scaling: 1
    }
    this.fieldData = [['R', '0', '0', '0', '0', '0'],
      ['P', '0', '0', '0', '0', '0'],
      ['G', '0', '0', '0', '0', '0'],
      ['B', '0', '0', '0', '0', '0'],
      ['R', '0', '0', '0', '0', '0'],
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
  },
  mounted () {
    this.windowHeight = window.innerHeight
    this.scaling = (this.puyoToPageHeightRatio * this.windowHeight) / 60
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
      })
    })
  }
}
</script>

<style scoped>
#GameField {
  /* width: calc(var(--board-columns) * calc(64px * var(--rescale))); */
  width: calc(calc(var(--board-columns) + 1) * calc(64px * var(--rescale)));
  height: calc(calc(var(--board-totalrows) + 2) * calc(60px * var(--rescale)));
  font-size: 0;
}

.game {
  font-size: 0;
}

.game-container {
  width: calc(calc(var(--board-columns) + 1) * calc(64px * var(--rescale)));
  height: calc(calc(var(--board-totalrows) + 2) * calc(60px * var(--rescale)));
  display: block;
  position: relative;
  font-size: 0;
  margin: 0;
}

.field-spacer-top {
  width: calc(calc(var(--board-columns)) * calc(64px * var(--rescale)));
  height: calc(60px * var(--rescale));
  margin: 0;
  padding: 0;
}

.border-hiddenrow-spacer {
  width: calc(64px * var(--rescale));
  height: calc(calc(var(--board-hiddenrows)) * calc(60px * var(--rescale)));
  background-color: rgb(35, 35, 35);
}

.border-block-sides {
  background-image: url('../assets/puyo/block-border.png');
  width: calc(64px * var(--rescale));
  height: calc(calc(var(--board-visiblerows)) * calc(60px * var(--rescale)));
  background-repeat: repeat-y;
  background-size: 100%;
}

.field-container {
  width: calc(calc(var(--board-columns)) * calc(64px * var(--rescale)));
  height: calc(calc(var(--board-totalrows)) * calc(60px * var(--rescale)));
  position: relative;
  margin: auto;
  padding: 0;
}

.field-container-bg {
  width: calc(calc(var(--board-columns)) * calc(64px * var(--rescale)));
  height: calc(calc(var(--board-visiblerows)) * calc(60px * var(--rescale)));
  background-color: rgb(35, 35, 35);
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
