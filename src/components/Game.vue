<template>
  <v-layout id="Game" row wrap justify-center fill-height>
    <v-flex xs6 fill-height>
      <v-layout row justify-center fill-height>
        <v-flex>
          <game-field v-on:update-field-state="updateFieldState" v-on:unset-reset-field="resetField" :fieldState="fieldState" :chainAutoPlay="chainAutoPlay"
          :togglePlayStep="togglePlayStep" :togglePlayChain="togglePlayChain" :toggleClearField="toggleClearField"
          :toggleResetField="toggleResetField" :simulationSpeed="simulationSpeed"></game-field>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs6 fill-height>
      <v-layout column wrap justify-start>
        <v-flex class="mb-2">
          <v-card>
              <v-layout row wrap justify-center>
                <v-btn flat @click="resetField(true)"><v-icon>replay</v-icon></v-btn>
                <v-btn style="display: none;" flat @click=""><v-icon>skip_previous</v-icon></v-btn>
                <v-btn flat @click="pauseChain" v-show="fieldState !== 'idle'"><v-icon>pause</v-icon></v-btn>
                <v-btn flat @click="playChain" v-show="fieldState === 'idle'"><v-icon>play_arrow</v-icon></v-btn>
                <v-btn flat @click="playStep"><v-icon>skip_next</v-icon></v-btn>
                <v-btn flat @click="fastforwardChain"><v-icon>fast_forward</v-icon></v-btn>
              </v-layout>
          </v-card>
        </v-flex>
        <v-flex>
          <v-card>
              <v-layout row wrap justify-center>
                <game-toolbox></game-toolbox>
              </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
    
    <!-- <v-layout class="mt-2" row wrap justify-center>
        <v-flex d-flex>
          <v-layout row justify-center align-start>
            <v-flex style="padding: 0;" xs8>
                <game-field v-on:update-field-state="updateFieldState" v-on:unset-reset-field="resetField" :fieldState="fieldState" :chainAutoPlay="chainAutoPlay"
                :togglePlayStep="togglePlayStep" :togglePlayChain="togglePlayChain" :toggleClearField="toggleClearField"
                :toggleResetField="toggleResetField" :simulationSpeed="simulationSpeed"></game-field>
            </v-flex>
            <v-flex>
                  <v-flex d-flex>
                    <v-card>
                      <v-btn small @click="resetField(true)">Reset</v-btn>
                      <v-btn small @click="pauseChain">Pause</v-btn>
                      <v-btn small @click="playStep">Step</v-btn>
                      <v-icon @click="playChain" >play_arrow</v-icon>
                    </v-card>
                  </v-flex>
                  <v-flex d-flex>
                    <v-card>
                      <v-btn small @click="clearField">Clear</v-btn>
                    </v-card>
                  </v-flex>
            </v-flex>
          </v-layout>
        </v-flex> -->
        <!-- <game-field v-on:update-field-state="updateFieldState" v-on:unset-reset-field="resetField" :fieldState="fieldState" :chainAutoPlay="chainAutoPlay"
      :togglePlayStep="togglePlayStep" :togglePlayChain="togglePlayChain" :toggleClearField="toggleClearField"
      :toggleResetField="toggleResetField" :simulationSpeed="simulationSpeed"></game-field> -->
        <!-- <v-flex d-flex>
          <v-layout column wrap>
            <v-flex d-flex>
              <v-card>
                  Next Windows
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-card>
                  <v-btn @click="resetField(true)">Reset</v-btn>
                  <v-btn @click="pauseChain">Pause</v-btn>
                  <v-btn @click="playStep">Step</v-btn>
                  <v-btn @click="playChain">Play</v-btn>
                  <v-btn @click="clearField">Clear All</v-btn>
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-card>
                  <game-toolbox></game-toolbox>
              </v-card>
            </v-flex>
            <v-spacer></v-spacer>
          </v-layout>
        </v-flex> -->
    <!-- </v-layout>
  </v-container> -->
  <!-- <v-card-actions >
        <v-btn class="my-1" @click="playStep">Step</v-btn>
        <v-btn class="my-1" @click="playChain">Play</v-btn>
        <v-btn class="my-1">Clear All</v-btn>
      </v-card-actions> -->
</template>

<script>
import GameField from './GameField'
import GameToolbox from './GameToolbox'

export default {
  name: 'Game',
  components: {
    GameField,
    GameToolbox
  },
  data () {
    return {
      fieldState: 'idle', // idle: Nothing can pop or drop, or not started yet >> dropping: applying gravity >> popping: clearing groups >> idle/dropping
      chainAutoPlay: false, // false: Play by chain steps | true: play the whole chain automatically
      togglePlayStep: false,
      togglePlayChain: false,
      toggleClearField: false,
      toggleResetField: false,
      simulationSpeed: 1
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
      this.simulationSpeed = 1
    },
    playChain: function () {
      this.togglePlayChain = !this.togglePlayChain
      this.chainAutoPlay = true
      this.simulationSpeed = 1
    },
    fastforwardChain: function () {
      this.togglePlayChain = !this.togglePlayChain
      this.chainAutoPlay = true
      this.simulationSpeed = 16
    },
    clearField: function () {
      this.toggleClearField = !this.toggleClearField
      this.chainAutoPlay = false
    },
    resetField: function (bool) {
      this.toggleResetField = bool
      this.chainAutoPlay = false
    },
    pauseChain: function () {
      this.fieldState = 'idle'
      this.chainAutoPlay = false
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>