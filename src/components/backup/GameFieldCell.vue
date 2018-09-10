<template>
  <div id="GameFieldCell" v-bind:style="PuyoStyling" @mousedown="setNewPuyoOnMouseDown" @mouseover="setNewPuyoOnMove" ondragstart="return false;">
    <div class="puyo"></div>
  </div>
</template>

<script>
// import TweenMax from 'gsap/TweenMax'
import { mapGetters, mapState, mapMutations } from 'vuex'
import Chainsim from '../assets/js/chainsim'
import TweenMax from 'gsap'

export default {
  name: 'GameFieldCell',
  props: ['indexRow', 'indexCol', 'isMouseDown'],
  data () {
    return {
      check: {}
    }
  },
  methods: {
    ...mapMutations(['editPopAnimationArray', 'editDistanceDropArray',
      'editDropAnimationArray', 'setNewField']),
    endOfPopAnimation: function () {
      this.editPopAnimationArray({
        indexRow: this.indexRow,
        indexCol: this.indexCol,
        bool: false
      })
    },
    endOfDropAnimation: function () {
      this.editDropAnimationArray({
        indexRow: this.indexRow,
        indexCol: this.indexCol,
        bool: false
      })
    },
    setNewPuyoOnMouseDown: function () {
      let newField = JSON.parse(JSON.stringify(this.fieldTextArray))
      newField[this.indexRow][this.indexCol] = this.currentTool
      this.setNewField(newField)
    },
    setNewPuyoOnMove: function () {
      if (this.isMouseDown === true) {
        let newField = JSON.parse(JSON.stringify(this.fieldTextArray))
        newField[this.indexRow][this.indexCol] = this.currentTool
        this.setNewField(newField)
      }
    }
  },
  computed: {
    ...mapState(['scaling', 'fieldState', 'popAnimationArray', 'distanceDropArray',
      'dropAnimationArray', 'needToResetTransforms', 'needToResetField',
      'currentTool', 'fieldTextArray', 'PuyoSettings']),
    ...mapGetters(['Field']),
    PuyoType: function () {
      switch (this.Field.map[this.indexRow][this.indexCol].puyo) {
        case Chainsim.Constants.Puyo.Red: return 0 // Red
        case Chainsim.Constants.Puyo.Green: return -32 // Green
        case Chainsim.Constants.Puyo.Blue: return -64 // Blue
        case Chainsim.Constants.Puyo.Yellow: return -96 // Yellow
        case Chainsim.Constants.Puyo.Purple: return -128 // Purple
        case Chainsim.Constants.Puyo.Nuisance: return -160 // Garbage (oJama)
        case Chainsim.Constants.Puyo.Point: return -192 // poinT
        case Chainsim.Constants.Puyo.Sun: return -224 // Sun
        case Chainsim.Constants.Puyo.Hard: return -256 // Hard
        case Chainsim.Constants.Puyo.Iron: return -256 // Iron
        case Chainsim.Constants.Puyo.Block: return -256 // bLock
        case Chainsim.Constants.Puyo.None: return 32 // Spacer/Nothing
        case undefined: return 32
      }
    },
    Connections: function () {
      // - If it's a garbage (G), poinT (T), Sun (S), or Hard (H) Puyo, set the pixel offset to 0.
      // - If it's an Iron Puyo (I), set the offset to -32.
      // - If it's a Block (L), set the offset to -64.
      // - If it's NOT a puyo, then the only thing left it could be is nothing... hopefully. So, return 32 (out of spritesheet bound)
      if (this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Nuisance || this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Point || this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Sun ||
          this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Hard) {
        return 0
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Iron) {
        return -32
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Block) {
        return -64
      } else if ((this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Red || this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Green ||
           this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Blue || this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Yellow ||
           this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Purple) === false) {
        return 32 // Basically, make the cell display nothing, because 32 pushes the spritesheet away from the viewport.
      }

      // If this Puyo is in the hidden rows, don't give it a connection
      if (this.indexRow < this.Field.hiddenRows) {
        return 0
      }

      // If this Puyo is in the middle of a dropping animation, then don't give it connections
      if (this.dropAnimationArray.length === this.Field.totalRows) {
        if (this.dropAnimationArray[0].length === this.Field.columns) {
          if (this.dropAnimationArray[this.indexRow][this.indexCol] === true) {
            return 0
          }
        }
      }

      this.check = {}
      // this.check up
      if (this.indexRow <= this.Field.hiddenRows) { // Don't look into the hidden row
        this.check.up = false
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === this.Field.map[this.indexRow - 1][this.indexCol].puyo) {
        // Don't connect to Puyos that are dropping.
        if (this.dropAnimationArray.length === this.Field.totalRows) {
          if (this.dropAnimationArray[0].length === this.Field.columns) {
            if (this.dropAnimationArray[this.indexRow - 1][this.indexCol] === true) {
              this.check.up = false
            } else {
              this.check.up = true
            }
          }
        } else {
          this.check.up = true
        }
      } else {
        this.check.up = false
      }

      // this.check left
      if (this.indexCol === 0) { // Don't look into the wall
        this.check.left = false
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === this.Field.map[this.indexRow][this.indexCol - 1].puyo) {
        // Don't connect to Puyos that are dropping.
        if (this.dropAnimationArray.length === this.Field.totalRows) {
          if (this.dropAnimationArray[0].length === this.Field.columns) {
            if (this.dropAnimationArray[this.indexRow][this.indexCol - 1] === true) {
              this.check.left = false
            } else {
              this.check.left = true
            }
          }
        } else {
          this.check.left = true
        }
      } else {
        this.check.left = false
      }

      // this.check right
      if (this.indexCol === (this.Field.columns - 1)) { // Don't look into the wall
        this.check.right = false
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === this.Field.map[this.indexRow][this.indexCol + 1].puyo) {
        // Don't connect to Puyos that are dropping.
        if (this.dropAnimationArray.length === this.Field.totalRows) {
          if (this.dropAnimationArray[0].length === this.Field.columns) {
            if (this.dropAnimationArray[this.indexRow][this.indexCol + 1] === true) {
              this.check.right = false
            } else {
              this.check.right = true
            }
          }
        } else {
          this.check.right = true
        }
      } else {
        this.check.right = false
      }

      // this.check down
      if (this.indexRow === (this.Field.visibleRows + this.Field.hiddenRows - 1)) { // Don't look into the floor
        this.check.down = false
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === this.Field.map[this.indexRow + 1][this.indexCol].puyo) {
        if (this.dropAnimationArray.length === this.Field.totalRows) {
          if (this.dropAnimationArray[0].length === this.Field.columns) {
            if (this.dropAnimationArray[this.indexRow + 1][this.indexCol] === true) {
              this.check.down = false
            } else {
              this.check.down = true
            }
          }
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
        return -32
      } else if (this.check.up === true && this.check.left === false && this.check.right === false && this.check.down === false) {
        return -64
      } else if (this.check.up === true && this.check.left === false && this.check.right === false && this.check.down === true) {
        return -96
      } else if (this.check.up === false && this.check.left === false && this.check.right === true && this.check.down === false) {
        return -128
      } else if (this.check.up === false && this.check.left === false && this.check.right === true && this.check.down === true) {
        return -160
      } else if (this.check.up === true && this.check.left === false && this.check.right === true && this.check.down === false) {
        return -192
      } else if (this.check.up === true && this.check.left === false && this.check.right === true && this.check.down === true) {
        return -224
      } else if (this.check.up === false && this.check.left === true && this.check.right === false && this.check.down === false) {
        return -256
      } else if (this.check.up === false && this.check.left === true && this.check.right === false && this.check.down === true) {
        return -288
      } else if (this.check.up === true && this.check.left === true && this.check.right === false && this.check.down === false) {
        return -320
      } else if (this.check.up === true && this.check.left === true && this.check.right === false && this.check.down === true) {
        return -352
      } else if (this.check.up === false && this.check.left === true && this.check.right === true && this.check.down === false) {
        return -384
      } else if (this.check.up === false && this.check.left === true && this.check.right === true && this.check.down === true) {
        return -416
      } else if (this.check.up === true && this.check.left === true && this.check.right === true && this.check.down === false) {
        return -448
      } else if (this.check.up === true && this.check.left === true && this.check.right === true && this.check.down === true) {
        return -480
      } else {
        return 32 // Error...
      }
    },
    colorSettings: function () {
      if (this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Red) {
        return {
          '-webkit-filter': `hue-rotate(${this.PuyoSettings.red.hue}deg) contrast(${this.PuyoSettings.red.contrast}%) saturate(${this.PuyoSettings.red.saturation}%) brightness(${this.PuyoSettings.red.brightness}%)`,
          'filter': `hue-rotate(${this.PuyoSettings.red.hue}deg) contrast(${this.PuyoSettings.red.contrast}%) saturate(${this.PuyoSettings.red.saturation}%) brightness(${this.PuyoSettings.red.brightness}%)`
        }
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Green) {
        return {
          '-webkit-filter': `hue-rotate(${this.PuyoSettings.green.hue}deg) contrast(${this.PuyoSettings.green.contrast}%) saturate(${this.PuyoSettings.green.saturation}%) brightness(${this.PuyoSettings.green.brightness}%)`,
          'filter': `hue-rotate(${this.PuyoSettings.green.hue}deg) contrast(${this.PuyoSettings.green.contrast}%) saturate(${this.PuyoSettings.green.saturation}%) brightness(${this.PuyoSettings.green.brightness}%)`
        }
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Blue) {
        return {
          '-webkit-filter': `hue-rotate(${this.PuyoSettings.blue.hue}deg) contrast(${this.PuyoSettings.blue.contrast}%) saturate(${this.PuyoSettings.blue.saturation}%) brightness(${this.PuyoSettings.blue.brightness}%)`,
          'filter': `hue-rotate(${this.PuyoSettings.blue.hue}deg) contrast(${this.PuyoSettings.blue.contrast}%) saturate(${this.PuyoSettings.blue.saturation}%) brightness(${this.PuyoSettings.blue.brightness}%)`
        }
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Yellow) {
        return {
          '-webkit-filter': `hue-rotate(${this.PuyoSettings.yellow.hue}deg) contrast(${this.PuyoSettings.yellow.contrast}%) saturate(${this.PuyoSettings.yellow.saturation}%) brightness(${this.PuyoSettings.yellow.brightness}%)`,
          'filter': `hue-rotate(${this.PuyoSettings.yellow.hue}deg) contrast(${this.PuyoSettings.yellow.contrast}%) saturate(${this.PuyoSettings.yellow.saturation}%) brightness(${this.PuyoSettings.yellow.brightness}%)`
        }
      } else if (this.Field.map[this.indexRow][this.indexCol].puyo === Chainsim.Constants.Puyo.Purple) {
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
    PuyoStyling: function () {
      return {
        '-webkit-filter': this.colorSettings['-webkit-filter'],
        'filter': this.colorSettings['filter'],
        '--rescale': this.scaling,
        '--colorOffset': this.PuyoType + 'px',
        '--cnxOffset': this.Connections + 'px'
      }
    },
    popActive: function () {
      if (this.popAnimationArray.length === this.Field.totalRows) {
        if (this.popAnimationArray[0].length === this.Field.columns) {
          return this.popAnimationArray[this.indexRow][this.indexCol]
        }
      } else {
        return false
      }
    },
    cellsToDrop: function () {
      if (this.distanceDropArray.length === this.Field.totalRows) {
        if (this.distanceDropArray[0].length === this.Field.columns) {
          return this.distanceDropArray[this.indexRow][this.indexCol]
        }
      } else {
        return 0
      }
    },
    needsDropping: function () {
      // if (this.cellsToDrop > 0) {
      //   return true
      // } else {
      //   return false
      // }
      if (this.dropAnimationArray.length === this.Field.totalRows) {
        if (this.dropAnimationArray[0].length === this.Field.columns) {
          return this.dropAnimationArray[this.indexRow][this.indexCol]
        }
      } else {
        return false
      }
    }
  },
  watch: {
    popActive: function () {
      if (this.needToResetField === false) {
        if (this.popActive === true && this.fieldState === 'popping') {
          TweenMax.to(this.$el.childNodes[0], 3, {opacity: 0, useFrames: true, yoyo: true, repeat: 10, onOverwrite: this.endOfPopAnimation, onComplete: this.endOfPopAnimation})
        } else {
          TweenMax.to(this.$el.childNodes[0], 0, {opacity: 1, useFrames: true, onOverwrite: this.endOfPopAnimation})
        }
      }
    },
    needsDropping: function () {
      if (this.needToResetField === false) {
        let maxDistance = this.cellsToDrop * 31 * this.scaling
        if (this.needsDropping === true && this.fieldState === 'dropping') {
          let me = this
          let frame = 0
          let speed = 1
          let distance = 0
          let speedstring = ''
          let accelerate = function () {
            if (distance < maxDistance) {
              frame += 1
              speed += 0.375 * frame
              distance += speed
              speedstring = '+=' + speed + 'px'
              TweenMax.to(me.$el.childNodes[0], 1, {useFrames: true, y: speedstring, onOverwrite: me.endOfDropAnimation, onComplete: accelerate})
            } else {
              TweenMax.to(me.$el.childNodes[0], 0, {useFrames: true, y: maxDistance, onOverwrite: me.endOfDropAnimation, onComplete: bounce})
            }
          }
          let bounce = function () {
            let yChange = '+=' + (0.2 * 31 * me.scaling) + 'px'
            TweenMax.to(me.$el.childNodes[0], 8, {useFrames: true, scaleX: '1.2', scaleY: '0.8', y: yChange, yoyo: true, repeat: 1, onOverwrite: me.endOfDropAnimation, onComplete: me.endOfDropAnimation})
          }
          // Initiate drop
          // Change Puyo to use no connections
          TweenMax.to(this.$el.childNodes[0], 1, {useFrames: true, y: '+=' + speed + 'px', onOverwrite: me.endOfDropAnimation, onComplete: accelerate})
        }
      }
    },
    needToResetTransforms: function (newVal, oldVal) {
      // When store.state.needToResetTransforms switches from false to true...
      if (newVal === true && oldVal === false) {
        TweenMax.to(this.$el.childNodes[0], 0, {useFrames: true, y: 0, opacity: 1, scaleX: 1, scaleY: 1, overwrite: 'concurrent'})
      }
    }
  }
}
</script>

<style scoped>
#GameFieldCell {
  width: calc(32px * var(--rescale));
  height: calc(32px * var(--rescale));
  display: inline-block;
  position: relative;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
.puyo {
  background-image: url('../assets/puyo/32x32/aqua.png');
  width: calc(32px * var(--rescale));
  height: calc(32px * var(--rescale));
  --multiplyposition: calc(var(--cnxOffset) * var(--rescale));
  --multiplycolor: calc(var(--colorOffset) * var(--rescale));
  background-position: var(--multiplyposition) var(--multiplycolor);
  background-size: 1600%;
  position: absolute;
}

</style>
