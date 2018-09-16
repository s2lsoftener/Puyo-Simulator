<template>
  <div id="GameFieldCell" v-bind:style="PuyoStyling" @mousedown="setNewPuyoOnMouseDown" @mouseover="setNewPuyoOnMove" ondragstart="return false;">
    <div class="puyo-container">
      <div class="puyo-sub-container">
        <div class="puyo"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chainsim from '../assets/js/chainsim'
import TweenMax from 'gsap'

export default {
  name: 'GameFieldCell',
  props: ['indexRow', 'indexCol', 'isMouseDown', 'Simulator', 'fieldState', 'fieldData', 'scaling', 'windowHeight',
    'simulationSpeed'],
  data () {
    return {
      check: {}
    }
  },
  methods: {
    endOfPopAnimation: function () {
      this.$emit('end-popping', { x: this.indexCol, y: this.indexRow, bool: false })
      this.Simulator.Field.map[this.indexRow][this.indexCol].toPop = false
      console.log('emitted animation end')
    },
    endOfDropAnimation: function () {
      this.$emit('end-dropping', { x: this.indexCol, y: this.indexRow, bool: false })
      console.log('emitted drop animation end')
    },
    setNewPuyoOnMouseDown: function () {
      this.$emit('edit-puyo-field', { x: this.indexCol, y: this.indexRow, puyo: this.currentTool })
    },
    setNewPuyoOnMove: function () {
      if (this.isMouseDown === true) {
        this.$emit('edit-puyo-field', { x: this.indexCol, y: this.indexRow, puyo: this.currentTool })
      }
    }
  },
  computed: {
    ...mapState(['PuyoSettings', 'currentTool']),
    PuyoType: function () {
      switch (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo) {
        case Chainsim.Constants.Puyo.Red: return 0 // Red
        case Chainsim.Constants.Puyo.Green: return -72 // Green
        case Chainsim.Constants.Puyo.Blue: return -144 // Blue
        case Chainsim.Constants.Puyo.Yellow: return -216 // Yellow
        case Chainsim.Constants.Puyo.Purple: return -288 // Purple
        case Chainsim.Constants.Puyo.Nuisance: return -72 // Garbage (oJama)
        case Chainsim.Constants.Puyo.Point: return -192 // poinT
        case Chainsim.Constants.Puyo.Sun: return -224 // Sun
        case Chainsim.Constants.Puyo.Hard: return -256 // Hard
        case Chainsim.Constants.Puyo.Iron: return -256 // Iron
        case Chainsim.Constants.Puyo.Block: return -256 // bLock
        case Chainsim.Constants.Puyo.None: return 100 // Spacer/Nothing
        case undefined: return 100
      }
    },
    Connections: function () {
      // - If it's a garbage (G), poinT (T), Sun (S), or Hard (H) Puyo, set the pixel offset to 0.
      // - If it's an Iron Puyo (I), set the offset to -32.
      // - If it's a Block (L), set the offset to -64.
      // - If it's NOT a puyo, then the only thing left it could be is nothing... hopefully. So, return 32 (out of spritesheet bound)
      if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Point || this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Sun ||
          this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Hard) {
        return 100
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Nuisance) {
        return -1296
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Iron) {
        return -32
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Block) {
        return -64
      } else if ((this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Red || this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Green ||
           this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Blue || this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Yellow ||
           this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Purple) === false) {
        return 32 // Basically, make the cell display nothing, because 32 pushes the spritesheet away from the viewport.
      }

      // If this Puyo is in the hidden rows, don't give it a connection
      if (this.indexRow < this.Simulator.Field.hiddenRows) {
        return 0
      }

      // If this Puyo is in the middle of a dropping animation, then don't give it connections
      if (this.Simulator.droppingCells[this.indexRow][this.indexCol] === true) {
        return 0
      }

      this.check = {}
      // this.check up
      if (this.indexRow <= this.Simulator.Field.hiddenRows) { // Don't look into the hidden row
        this.check.up = false
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === this.Simulator.Field.map[this.indexRow - 1][this.indexCol].puyo) {
        // Don't connect to Puyos that are dropping.
        if (this.Simulator.droppingCells[this.indexRow - 1][this.indexCol] === true) {
          this.check.up = false
        } else {
          this.check.up = true
        }
      } else {
        this.check.up = false
      }

      // this.check left
      if (this.indexCol === 0) { // Don't look into the wall
        this.check.left = false
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === this.Simulator.Field.map[this.indexRow][this.indexCol - 1].puyo) {
        // Don't connect to Puyos that are dropping.
        if (this.Simulator.droppingCells[this.indexRow][this.indexCol - 1] === true) {
          this.check.left = false
        } else {
          this.check.left = true
        }
      } else {
        this.check.left = false
      }

      // this.check right
      if (this.indexCol === (this.Simulator.Field.columns - 1)) { // Don't look into the wall
        this.check.right = false
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === this.Simulator.Field.map[this.indexRow][this.indexCol + 1].puyo) {
        // Don't connect to Puyos that are dropping.
        if (this.Simulator.droppingCells[this.indexRow][this.indexCol + 1] === true) {
          this.check.right = false
        } else {
          this.check.right = true
        }
      } else {
        this.check.right = false
      }

      // this.check down
      if (this.indexRow === (this.Simulator.Field.visibleRows + this.Simulator.Field.hiddenRows - 1)) { // Don't look into the floor
        this.check.down = false
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === this.Simulator.Field.map[this.indexRow + 1][this.indexCol].puyo) {
        if (this.Simulator.droppingCells[this.indexRow + 1][this.indexCol] === true) {
          this.check.down = false
        } else {
          this.check.down = true
        }
      } else {
        this.check.down = false
      }

      // Decide connection
      if (this.check.up === false && this.check.left === false && this.check.right === false && this.check.down === false) {
        return 0
      } else if (this.check.up === false && this.check.left === false && this.check.right === false && this.check.down === true) {
        return -72
      } else if (this.check.up === true && this.check.left === false && this.check.right === false && this.check.down === false) {
        return -144
      } else if (this.check.up === true && this.check.left === false && this.check.right === false && this.check.down === true) {
        return -216
      } else if (this.check.up === false && this.check.left === false && this.check.right === true && this.check.down === false) {
        return -288
      } else if (this.check.up === false && this.check.left === false && this.check.right === true && this.check.down === true) {
        return -360
      } else if (this.check.up === true && this.check.left === false && this.check.right === true && this.check.down === false) {
        return -432
      } else if (this.check.up === true && this.check.left === false && this.check.right === true && this.check.down === true) {
        return -504
      } else if (this.check.up === false && this.check.left === true && this.check.right === false && this.check.down === false) {
        return -576
      } else if (this.check.up === false && this.check.left === true && this.check.right === false && this.check.down === true) {
        return -648
      } else if (this.check.up === true && this.check.left === true && this.check.right === false && this.check.down === false) {
        return -720
      } else if (this.check.up === true && this.check.left === true && this.check.right === false && this.check.down === true) {
        return -792
      } else if (this.check.up === false && this.check.left === true && this.check.right === true && this.check.down === false) {
        return -864
      } else if (this.check.up === false && this.check.left === true && this.check.right === true && this.check.down === true) {
        return -936
      } else if (this.check.up === true && this.check.left === true && this.check.right === true && this.check.down === false) {
        return -1008
      } else if (this.check.up === true && this.check.left === true && this.check.right === true && this.check.down === true) {
        return -1080
      } else {
        return 32 // Error...
      }
    },
    colorSettings: function () {
      if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Red) {
        return {
          '-webkit-filter': `hue-rotate(${this.PuyoSettings.red.hue}deg) contrast(${this.PuyoSettings.red.contrast}%) saturate(${this.PuyoSettings.red.saturation}%) brightness(${this.PuyoSettings.red.brightness}%)`,
          'filter': `hue-rotate(${this.PuyoSettings.red.hue}deg) contrast(${this.PuyoSettings.red.contrast}%) saturate(${this.PuyoSettings.red.saturation}%) brightness(${this.PuyoSettings.red.brightness}%)`
        }
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Green) {
        return {
          '-webkit-filter': `hue-rotate(${this.PuyoSettings.green.hue}deg) contrast(${this.PuyoSettings.green.contrast}%) saturate(${this.PuyoSettings.green.saturation}%) brightness(${this.PuyoSettings.green.brightness}%)`,
          'filter': `hue-rotate(${this.PuyoSettings.green.hue}deg) contrast(${this.PuyoSettings.green.contrast}%) saturate(${this.PuyoSettings.green.saturation}%) brightness(${this.PuyoSettings.green.brightness}%)`
        }
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Blue) {
        return {
          '-webkit-filter': `hue-rotate(${this.PuyoSettings.blue.hue}deg) contrast(${this.PuyoSettings.blue.contrast}%) saturate(${this.PuyoSettings.blue.saturation}%) brightness(${this.PuyoSettings.blue.brightness}%)`,
          'filter': `hue-rotate(${this.PuyoSettings.blue.hue}deg) contrast(${this.PuyoSettings.blue.contrast}%) saturate(${this.PuyoSettings.blue.saturation}%) brightness(${this.PuyoSettings.blue.brightness}%)`
        }
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Yellow) {
        return {
          '-webkit-filter': `hue-rotate(${this.PuyoSettings.yellow.hue}deg) contrast(${this.PuyoSettings.yellow.contrast}%) saturate(${this.PuyoSettings.yellow.saturation}%) brightness(${this.PuyoSettings.yellow.brightness}%)`,
          'filter': `hue-rotate(${this.PuyoSettings.yellow.hue}deg) contrast(${this.PuyoSettings.yellow.contrast}%) saturate(${this.PuyoSettings.yellow.saturation}%) brightness(${this.PuyoSettings.yellow.brightness}%)`
        }
      } else if (this.Simulator.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Purple) {
        return {
          '-webkit-filter': `hue-rotate(${this.PuyoSettings.purple.hue}deg) contrast(${this.PuyoSettings.purple.contrast}%) saturate(${this.PuyoSettings.purple.saturation}%) brightness(${this.PuyoSettings.purple.brightness}%)`,
          'filter': `hue-rotate(${this.PuyoSettings.purple.hue}deg) contrast(${this.PuyoSettings.purple.contrast}%) saturate(${this.PuyoSettings.purple.saturation}%) brightness(${this.PuyoSettings.purple.brightness}%)`
        }
      } else {
        return {
          '-webkit-filter': `hue-rotate(0deg) contrast(100%) saturate(100%) brightness(100%)`,
          'filter': `hue-rotate(0deg) contrast(100%) saturate(100%) brightness(100%)`
        }
      }
    },
    requireBufferPixelsDown: function () {
      // Puyos that extend right and/or down need a couple extra pixels to ensure nice looking connections
      // when the user rescales their screen.
      if ([-72, -216, -360, -504, -648, -792, -936, -1080].includes(this.Connections)) {
        return '64px'
      } else {
        return '60px'
      }
    },
    requireBufferPixelsRight: function () {
      if ([-288, -360, -432, -504, -864, -936, -1008, -1080].includes(this.Connections)) {
        return '68px'
      } else {
        return '64px'
      }
    },
    PuyoStyling: function () {
      return {
        '-webkit-filter': this.colorSettings['-webkit-filter'],
        'filter': this.colorSettings['filter'],
        // '--rescale': this.Simulator.Field.scaling,
        '--rescale': this.scaling,
        '--colorOffset': this.PuyoType + 'px',
        '--cnxOffset': this.Connections + 'px',
        '--bufferRight': this.requireBufferPixelsRight,
        '--bufferDown': this.requireBufferPixelsDown
      }
    },
    needsPopping: function () {
      if (this.Simulator.poppingCells.length === this.Simulator.Field.totalRows) {
        if (this.Simulator.poppingCells[0].length === this.Simulator.Field.columns) {
          return this.Simulator.poppingCells[this.indexRow][this.indexCol]
        }
      } else {
        return false
      }
    },
    cellsToDrop: function () {
      return this.Simulator.dropDistances[this.indexRow][this.indexCol]
    },
    needsDropping: function () {
      if (this.Simulator.droppingCells.length === this.Simulator.Field.totalRows) {
        if (this.Simulator.droppingCells[0].length === this.Simulator.Field.columns) {
          return this.Simulator.droppingCells[this.indexRow][this.indexCol]
        }
      } else {
        return false
      }
    }
  },
  watch: {
    fieldState: function () {
      if (this.fieldState === 'idle') {
        TweenMax.to(this.$el.childNodes[0], 0, {useFrames: true, y: 0, opacity: 1, scaleX: 1, scaleY: 1, overwrite: 'concurrent'})
      } else if (this.fieldState === 'popping' && this.needsPopping === true) {
        let me = this
        let flashRate = Math.round(2 / this.simulationSpeed)
        let flashSpeed = 1
        if (this.simulationSpeed > 4) {
          flashSpeed = 0
        }

        // Escape function in case the animation needs to end.
        let checkForFieldStateChange = function () {
          if (me.fieldState === 'idle') {
            TweenMax.to(me.$el.childNodes[0], 0, {useFrames: true, y: 0, opacity: 1, scaleX: 1, scaleY: 1, overwrite: 'concurrent', onOverwrite: me.endOfPopAnimation})
          }
        }
        // Define popping animation
        let popPuyos = function () {
          TweenMax.to(me.$el.childNodes[0], flashSpeed, {opacity: 0, useFrames: true, yoyo: true, repeat: 10, repeatDelay: flashRate, onOverwrite: me.endOfPopAnimation, onUpdate: checkForFieldStateChange, onComplete: me.endOfPopAnimation})
        }
        // Reset transforms, then pop.
        TweenMax.to(this.$el.childNodes[0], 0, {useFrames: true, y: 0, opacity: 1, scaleX: 1, scaleY: 1, onComplete: popPuyos})
      } else if (this.fieldState === 'dropping' && this.needsDropping === true) {
        let maxDistance = (this.cellsToDrop) * 60 * this.scaling
        let me = this
        let frame = 0
        let speed = this.simulationSpeed
        let accelConst = 0.1875 / 16 * (68 * this.scaling)
        let distance = 0
        let speedstring = ''
        let checkForFieldStateChange = function () {
          if (me.fieldState === 'idle') {
            TweenMax.to(me.$el.childNodes[0], 0, {useFrames: true, y: 0, opacity: 1, scaleX: 1, scaleY: 1, overwrite: 'concurrent', onOverwrite: me.endOfDropAnimation})
          }
        }
        let accelerate = function () {
          if (distance < maxDistance) {
            frame += 1
            speed += accelConst * frame * (me.simulationSpeed ** 2)
            distance += speed
            speedstring = '+=' + speed + 'px'
            TweenMax.to(me.$el.childNodes[0], 1, {useFrames: true, y: speedstring, onOverwrite: me.endOfDropAnimation, onUpdate: checkForFieldStateChange, onComplete: accelerate})
          } else {
            TweenMax.to(me.$el.childNodes[0], 0, {useFrames: true, y: maxDistance, onOverwrite: me.endOfDropAnimation, onUpdate: checkForFieldStateChange, onComplete: bounce})
          }
        }
        let bounce = function () {
          let yChange = '+=' + (0.1 * 60 * me.Simulator.Field.scaling) + 'px'
          let bounceSpeed = Math.round(8 / me.simulationSpeed)
          TweenMax.to(me.$el.childNodes[0], bounceSpeed, {useFrames: true, scaleX: '1.2', scaleY: '0.8', y: yChange, yoyo: true, repeat: 1, onUpdate: checkForFieldStateChange, onOverwrite: me.endOfDropAnimation, onComplete: me.endOfDropAnimation})
        }
        let puyoFall = function () {
          TweenMax.to(me.$el.childNodes[0], 1, {useFrames: true, y: '+=' + speed + 'px', onOverwrite: me.endOfDropAnimation, onUpdate: checkForFieldStateChange, onComplete: accelerate})
        }
        // Reset transforms, then drop.
        TweenMax.to(this.$el.childNodes[0], 0, {useFrames: true, y: 0, opacity: 1, scaleX: 1, scaleY: 1, onUpdate: checkForFieldStateChange, overwrite: 'concurrent', onComplete: puyoFall})
      }
    },
    fieldData: {
      handler: function () {
        TweenMax.to(this.$el.childNodes[0], 0, {useFrames: true, y: 0, opacity: 1, scaleX: 1, scaleY: 1, overwrite: 'concurrent'})
      },
      deep: true
    }
  }
}
</script>

<style scoped>
#GameFieldCell {
  width: calc(64px * var(--rescale));
  height: calc(60px * var(--rescale));
  display: inline-block;
  position: relative;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  font-size: 0;
}

.puyo-container {
  width: calc(64px * var(--rescale));
  height: calc(60px * var(--rescale));
  position: relative;
}

.puyo-sub-container {
  width: calc(var(--bufferRight) * var(--rescale));
  height: calc(var(--bufferDown) * var(--rescale));
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.puyo {
  background-image: url('../assets/puyo/puyo_aqua.png');
  width: calc(72px * var(--rescale));
  height: calc(68px * var(--rescale));
  --multiplyposition: calc(var(--cnxOffset) * var(--rescale));
  --multiplycolor: calc(var(--colorOffset) * var(--rescale));
  background-position: var(--multiplyposition) var(--multiplycolor);
  position: absolute;
  background-size: 2844.4444%;
  left: 0;
  top: 0;
}

</style>
