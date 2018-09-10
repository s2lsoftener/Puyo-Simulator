<template>
  <div id="Game">
    <b-row align-h="center">
      <b-col class="fieldTest" align-h="center">
        <b-row align-h="center" no-gutters>
          <b-card>
            <game-field v-on:update-field-state="updateFieldState" :fieldState="fieldState" :chainAutoPlay="chainAutoPlay"
            :togglePlayStep="togglePlayStep" :togglePlayChain="togglePlayChain"></game-field>
          </b-card>
        </b-row>
      </b-col>
      <b-col class="fieldTest">
        <b-card><b-button>Change opacity</b-button></b-card>
        <!-- <b-card class="mt-3"><game-toolbox></game-toolbox></b-card> -->
        <b-card class="mt-3">
          <b-button class="my-1" @click="playStep">Step</b-button>
          <b-button class="my-1" @click="playChain">Play</b-button>
          <b-button class="my-1" @click="">Clear All</b-button>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import GameField from './GameField'
// import GameToolbox from './GameToolbox'

export default {
  name: 'Game',
  components: {
    GameField
  },
  data () {
    return {
      fieldState: 'idle', // idle: Nothing can pop or drop, or not started yet >> dropping: applying gravity >> popping: clearing groups >> idle/dropping
      chainAutoPlay: false, // false: Play by chain steps | true: play the whole chain automatically
      togglePlayStep: false,
      togglePlayChain: false
    }
  },
  methods: {
    updateFieldState: function (state) {
      this.fieldState = state
    },
    updateAutoPlay: function (state) {
      this.chainAutoPlay = state
    },
    playStep: function () {
      this.togglePlayStep = !this.togglePlayStep
      this.chainAutoPlay = false
    },
    playChain: function () {
      this.togglePlayChain = !this.togglePlayChain
      this.chainAutoPlay = true
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
