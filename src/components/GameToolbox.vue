<template>
  <div id="GameToolbox">
    <div class="puyo red" @click="switchTool('R')" :class="{active: currentTool === 'R'}"></div>
    <div class="puyo green" @click="switchTool('G')" :class="{active: currentTool === 'G'}"></div>
    <div class="puyo blue" @click="switchTool('B')" :class="{active: currentTool === 'B'}"></div>
    <div class="puyo yellow" @click="switchTool('Y')" :class="{active: currentTool === 'Y'}"></div>
    <div class="puyo purple" @click="switchTool('P')" :class="{active: currentTool === 'P'}"></div>
    <div class="puyo nuisance" @click="switchTool('J')" :class="{active: currentTool === 'J'}"></div>
    <div class="eraser" @click="switchTool('0')" :class="{active: currentTool === '0'}"></div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'GameToolbox',
  methods: {
    ...mapMutations(['setTool']),
    switchTool: function (puyo) {
      switch (puyo) {
        case 'R':
          this.setTool('R')
          break
        case 'G':
          this.setTool('G')
          break
        case 'B':
          this.setTool('B')
          break
        case 'Y':
          this.setTool('Y')
          break
        case 'P':
          this.setTool('P')
          break
        case 'J':
          this.setTool('J')
          break
        case '0':
          this.setTool('0')
          break
      }
    }
  },
  computed: {
    ...mapState(['currentTool'])
  }
}
</script>

<style scoped>
.puyo {
  background-image: url('../assets/puyo/32x32/aqua.png');
  width: 31px;
  height: 31px;
  display: inline-block;
}

.red {
  background-position: 0px 0px;
}

.green {
  background-position: 0px -32px;
}

.blue {
  background-position: 0px -64px;
}

.yellow {
  background-position: 0px -96px;
}

.purple {
  background-position: 0px -128px;
}

.nuisance {
  background-position: 0px -160px;
}

.eraser {
  background-image: url('../assets/puyo/puyo_erase.png');
  width: 32px;
  height: 32px;
  display: inline-block;
}

.active {
  background-color: rgba(0,0,0,0.3);
}
</style>
