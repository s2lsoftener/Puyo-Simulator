<template>
  <v-layout id="GameToolbox" class="pa-3">
    <v-flex>
      <div class="puyo redpuyo" :style="redSettingsCSS" @click="switchTool('R')" :class="{active: currentTool === 'R'}"></div>
      <div class="puyo greenpuyo" :style="greenSettingsCSS" @click="switchTool('G')" :class="{active: currentTool === 'G'}"></div>
      <div class="puyo bluepuyo" :style="blueSettingsCSS" @click="switchTool('B')" :class="{active: currentTool === 'B'}"></div>
      <div class="puyo yellowpuyo" :style="yellowSettingsCSS" @click="switchTool('Y')" :class="{active: currentTool === 'Y'}"></div>
      <div class="puyo purplepuyo" :style="purpleSettingsCSS" @click="switchTool('P')" :class="{active: currentTool === 'P'}"></div>
      <div class="puyo nuisancepuyo" @click="switchTool('J')" :class="{active: currentTool === 'J'}"></div>
      <div class="eraser" @click="switchTool('0')" :class="{active: currentTool === '0'}"></div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'GameToolbox',
  data () {
    return {
      red: {
        hue: 0,
        contrast: 0,
        saturation: 0,
        brightness: 0
      },
      green: {
        hue: 0,
        contrast: 0,
        saturation: 0,
        brightness: 0
      },
      blue: {
        hue: 0,
        contrast: 0,
        saturation: 0,
        brightness: 0
      },
      yellow: {
        hue: 0,
        contrast: 0,
        saturation: 0,
        brightness: 0
      },
      purple: {
        hue: 0,
        contrast: 0,
        saturation: 0,
        brightness: 0
      }
    }
  },
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
    ...mapState(['currentTool', 'PuyoSettings']),
    redSettings: function () {
      return {
        hue: parseInt(this.PuyoSettings.red.hue),
        contrast: parseInt(this.PuyoSettings.red.contrast),
        saturation: parseInt(this.PuyoSettings.red.saturation),
        brightness: parseInt(this.PuyoSettings.red.brightness)
      }
    },
    redSettingsCSS: function () {
      return {
        '-webkit-filter': `hue-rotate(${this.redSettings.hue}deg) contrast(${this.redSettings.contrast}%) saturate(${this.redSettings.saturation}%) brightness(${this.redSettings.brightness}%)`,
        'filter': `hue-rotate(${this.redSettings.hue}deg) contrast(${this.redSettings.contrast}%) saturate(${this.redSettings.saturation}%) brightness(${this.redSettings.brightness}%)`
      }
    },
    greenSettings: function () {
      return {
        hue: parseInt(this.PuyoSettings.green.hue),
        contrast: parseInt(this.PuyoSettings.green.contrast),
        saturation: parseInt(this.PuyoSettings.green.saturation),
        brightness: parseInt(this.PuyoSettings.green.brightness)
      }
    },
    greenSettingsCSS: function () {
      return {
        '-webkit-filter': `hue-rotate(${this.greenSettings.hue}deg) contrast(${this.greenSettings.contrast}%) saturate(${this.greenSettings.saturation}%) brightness(${this.greenSettings.brightness}%)`,
        'filter': `hue-rotate(${this.greenSettings.hue}deg) contrast(${this.greenSettings.contrast}%) saturate(${this.greenSettings.saturation}%) brightness(${this.greenSettings.brightness}%)`
      }
    },
    blueSettings: function () {
      return {
        hue: parseInt(this.PuyoSettings.blue.hue),
        contrast: parseInt(this.PuyoSettings.blue.contrast),
        saturation: parseInt(this.PuyoSettings.blue.saturation),
        brightness: parseInt(this.PuyoSettings.blue.brightness)
      }
    },
    blueSettingsCSS: function () {
      return {
        '-webkit-filter': `hue-rotate(${this.blueSettings.hue}deg) contrast(${this.blueSettings.contrast}%) saturate(${this.blueSettings.saturation}%) brightness(${this.blueSettings.brightness}%)`,
        'filter': `hue-rotate(${this.blueSettings.hue}deg) contrast(${this.blueSettings.contrast}%) saturate(${this.blueSettings.saturation}%) brightness(${this.blueSettings.brightness}%)`
      }
    },
    yellowSettings: function () {
      return {
        hue: parseInt(this.PuyoSettings.yellow.hue),
        contrast: parseInt(this.PuyoSettings.yellow.contrast),
        saturation: parseInt(this.PuyoSettings.yellow.saturation),
        brightness: parseInt(this.PuyoSettings.yellow.brightness)
      }
    },
    yellowSettingsCSS: function () {
      return {
        '-webkit-filter': `hue-rotate(${this.yellowSettings.hue}deg) contrast(${this.yellowSettings.contrast}%) saturate(${this.yellowSettings.saturation}%) brightness(${this.yellowSettings.brightness}%)`,
        'filter': `hue-rotate(${this.yellowSettings.hue}deg) contrast(${this.yellowSettings.contrast}%) saturate(${this.yellowSettings.saturation}%) brightness(${this.yellowSettings.brightness}%)`
      }
    },
    purpleSettings: function () {
      return {
        hue: parseInt(this.PuyoSettings.purple.hue),
        contrast: parseInt(this.PuyoSettings.purple.contrast),
        saturation: parseInt(this.PuyoSettings.purple.saturation),
        brightness: parseInt(this.PuyoSettings.purple.brightness)
      }
    },
    purpleSettingsCSS: function () {
      return {
        '-webkit-filter': `hue-rotate(${this.purpleSettings.hue}deg) contrast(${this.purpleSettings.contrast}%) saturate(${this.purpleSettings.saturation}%) brightness(${this.purpleSettings.brightness}%)`,
        'filter': `hue-rotate(${this.purpleSettings.hue}deg) contrast(${this.purpleSettings.contrast}%) saturate(${this.purpleSettings.saturation}%) brightness(${this.purpleSettings.brightness}%)`
      }
    }
  },
  created () {
    this.red = {
      hue: this.PuyoSettings.red.hue,
      contrast: this.PuyoSettings.red.contrast,
      saturation: this.PuyoSettings.red.saturation,
      brightness: this.PuyoSettings.red.brightness
    }
    this.green = {
      hue: this.PuyoSettings.green.hue,
      contrast: this.PuyoSettings.green.contrast,
      saturation: this.PuyoSettings.green.saturation,
      brightness: this.PuyoSettings.green.brightness
    }
    this.blue = {
      hue: this.PuyoSettings.blue.hue,
      contrast: this.PuyoSettings.blue.contrast,
      saturation: this.PuyoSettings.blue.saturation,
      brightness: this.PuyoSettings.blue.brightness
    }
    this.yellow = {
      hue: this.PuyoSettings.yellow.hue,
      contrast: this.PuyoSettings.yellow.contrast,
      saturation: this.PuyoSettings.yellow.saturation,
      brightness: this.PuyoSettings.yellow.brightness
    }
    this.purple = {
      hue: this.PuyoSettings.purple.hue,
      contrast: this.PuyoSettings.purple.contrast,
      saturation: this.PuyoSettings.purple.saturation,
      brightness: this.PuyoSettings.purple.brightness
    }
  }
}
</script>

<style scoped>
.puyo {
  --rescale: 0.5;
  background-image: url('../assets/puyo/puyo_aqua.png');
  display: inline-block;
  background-image: url('../assets/puyo/puyo_aqua.png');
  width: calc(72px * var(--rescale));
  height: calc(68px * var(--rescale));
  --multiplyposition: calc(var(--cnxOffset) * var(--rescale));
  --multiplycolor: calc(var(--colorOffset) * var(--rescale));
  background-position: var(--multiplyposition) var(--multiplycolor);
  background-size: 2844.4444%;
}

.redpuyo {
  --cnxOffset: 0px;
  --colorOffset: 0px;
}

.greenpuyo {
  --cnxOffset: 0px;
  --colorOffset: -72px;
}

.bluepuyo {
  --cnxOffset: 0px;
  --colorOffset: -144px;
}

.yellowpuyo {
  --cnxOffset: 0px;
  --colorOffset: -216px;
}

.purplepuyo {
  --cnxOffset: 0px;
  --colorOffset: -288px;
}

.nuisancepuyo {
  --cnxOffset: -1296px;
  --colorOffset: -72px;
}

.eraser {
  --rescale: 0.5;
  background-image: url('../assets/puyo/puyo_erase.png');
  width: calc(72px * var(--rescale));
  height: calc(68px * var(--rescale));
  background-size: 90%;
  display: inline-block;
}

.active {
  background-color: rgba(100, 100, 100, 0.3);
}
</style>
