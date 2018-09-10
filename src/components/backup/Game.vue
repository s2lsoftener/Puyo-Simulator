<template>
  <div id="Game">
    <b-row align-h="center">
      <b-col class="fieldTest" align-h="center">
        <b-row align-h="center" no-gutters>
          <b-card>
            <game-field></game-field>
          </b-card>
        </b-row>
      </b-col>
      <b-col class="fieldTest">
        <b-card>Next Windows will go here.</b-card>
        <b-card class="mt-3"><game-toolbox></game-toolbox></b-card>
        <b-card class="mt-3">
          <b-button class="my-1" @click="playChainStep">Step</b-button>
          <b-button class="my-1" @click="playFullChain">Play</b-button>
          <b-button class="my-1" @click="resetField">Clear All</b-button>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
import Chainsim from '../assets/js/chainsim'
import GameField from './GameField'
import GameToolbox from './GameToolbox'

export default {
  name: 'Game',
  components: {
    GameField,
    GameToolbox
  },
  methods: {
    ...mapMutations(['setFieldState', 'setNewField', 'setPopAnimationArray',
      'setDistanceDropArray', 'setDropAnimationArray', 'setNeedToResetTransforms',
      'toggleResetField', 'setChainAutoPlay']),
    clearPuyos: function () {
      let clearResult = Chainsim.Simulate.clearPuyos(this.Field) // {newField, popData: {poppingGroups, poppingColors, checkMatrix}, garbageToClear: []}
      this.setFieldState('popping')

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
      this.setPopAnimationArray(popAnimationArray)

      // If there's no more pops, return to idle state
      if (clearResult.popData.poppingGroups.length === 0) {
        console.log('Setting idle state')
        this.setFieldState('idle')
        return
      }
    },
    dropPuyos: function () {
      let dropResult = Chainsim.Simulate.dropPuyos(this.Field) // {dropData, dropDistances}
      let anyToDrop = false // Check variable. Is at least one cell in a pop animation?
      // Create an array in the Vuex Store that tracks which cells are in their drop animations.
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
      this.setDropAnimationArray(dropAnimationArray)

      // Create an array in the Vuex Store that tracks how much and where cells are dropping.
      this.setDistanceDropArray(dropResult.dropDistances)
      this.setFieldState('dropping')

      this.$nextTick(function () {
        this.setNeedToResetTransforms(false)
      })

      // If there's nothing to drop, call clearPuyos immediately
      if (anyToDrop === false) {
        this.clearPuyos()
      }
    },
    resetField: function () {
      this.setFieldState('idle')
      this.setPopAnimationArray([])
      this.setDropAnimationArray([])
      this.setDistanceDropArray([])
      this.setNeedToResetTransforms(true)
      this.setNewField(this.defaultTextArray)
    },
    playFullChain: function () {
      this.setChainAutoPlay(true)
      this.dropPuyos()
    },
    playChainStep: function () {
      this.setChainAutoPlay(false)
      this.dropPuyos()
    }
  },
  computed: {
    ...mapState(['defaultTextArray', 'fieldState', 'chainAutoPlay']),
    ...mapGetters(['Field', 'stillPopping', 'stillDropping'])
  },
  watch: {
    // Watch for popping state to end so dropPuyos can begin.
    stillPopping: function () {
      // Switch from true to false
      if (this.stillPopping === false && this.fieldState === 'popping') {
        this.setNewField(Chainsim.mapToStringArray(Chainsim.Simulate.clearPuyos(this.Field).newField.map))
        this.$nextTick(function () {
          this.setNeedToResetTransforms(false)
        })
        this.$nextTick(function () {
          this.dropPuyos()
        })
      }
    },
    stillDropping: function () {
      if (this.stillDropping === false && this.fieldState === 'dropping') {
        this.setNewField(Chainsim.mapToStringArray(Chainsim.Simulate.dropPuyos(this.Field).dropData))
        this.$nextTick(function () {
          this.setNeedToResetTransforms(true)
        })
        this.$nextTick(function () {
          if (this.chainAutoPlay === true) {
            this.clearPuyos()
          }
        })
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
