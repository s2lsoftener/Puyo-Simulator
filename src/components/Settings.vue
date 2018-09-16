<template>
<v-layout row justify-center>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-btn slot="activator" color="primary" flat icon><v-icon>settings</v-icon></v-btn>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.native="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark flat @click.native="dialog = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-title>
          <v-layout column>
            <h3 class="grey--text text--lighten-1">Adjust Puyo Colors</h3>
            <p>Edit the hue, contrast, saturation, and brightness of each Puyo color and type.</p>
            <v-layout row justify-start>
                <v-flex shrink v-for="(color, index) in colors" :key="index">
                  <div :class="['puyo-tab', colors[index] === puyotab ? 'active' : '']" @click="puyotab = colors[index]" v-ripple>
                    <div class="puyo-container" :style="colorSettingsCSS[index]">
                      <div class="puyo-sub-container">
                        <div :class="['puyo', `${colors[index]}puyo`]"></div>
                      </div>
                    </div>
                  </div>
                </v-flex>
            </v-layout>
            <v-flex>
              <v-card>
                <v-container fluid grid-list-lg>
                  <v-layout ref="spacer" :style="{'height': puyoCardHeight + 'px'}"></v-layout>
                  <v-layout>
                    <transition-group name="switch-puyo-tab">
                    <v-flex v-for="(color, index) in colors" :key="colors[index]" style="position: absolute; top: 0px; margin: auto;"
                     v-show="puyotab === colors[index]">
                      <v-layout ref="editPuyoColor" row wrap align-center>
                        <v-flex style="width: 25%;" align-center>
                          <p style="margin: auto;"><strong>Hue</strong></p>
                        </v-flex>
                        <v-flex style="width: 55%;">
                          <v-slider v-model="colorSettings[index].hue" :min="0" :max="360"></v-slider>
                        </v-flex>
                        <v-flex style="width: 20%;">
                          <v-text-field v-model="colorSettings[index].hue" class="mt-0" type="number" style="width: 85%;"></v-text-field>
                        </v-flex>

                        <v-flex style="width: 25%;" align-center>
                          <p style="margin: auto;"><strong>Contrast</strong></p>
                        </v-flex>
                        <v-flex style="width: 55%;">
                          <v-slider v-model="colorSettings[index].contrast" :max="300"></v-slider>
                        </v-flex>
                        <v-flex style="width: 20%;">
                          <v-text-field v-model="colorSettings[index].contrast" class="mt-0" type="number" style="width: 85%;"></v-text-field>
                        </v-flex>

                        <v-flex style="width: 25%;" align-center>
                          <p style="margin: auto;"><strong>Saturation</strong></p>
                        </v-flex>
                        <v-flex style="width: 55%;">
                          <v-slider v-model="colorSettings[index].saturation" :max="300"></v-slider>
                        </v-flex>
                        <v-flex style="width: 20%;">
                          <v-text-field v-model="colorSettings[index].saturation" class="mt-0" type="number" style="width: 85%;"></v-text-field>
                        </v-flex>

                        <v-flex style="width: 25%;" align-center>
                          <p style="margin: auto;"><strong>Brightness</strong></p>
                        </v-flex>
                        <v-flex style="width: 55%;">
                          <v-slider v-model="colorSettings[index].brightness" :max="300"></v-slider>
                        </v-flex>
                        <v-flex style="width: 20%;">
                          <v-text-field v-model="colorSettings[index].brightness" class="mt-0" type="number" style="width: 85%;"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    </transition-group>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
      </v-card-title>

      <v-divider></v-divider>
      
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      puyotab: 'red',
      puyoCardHeight: 0,
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
      },
      colors: ['red', 'green', 'blue', 'yellow', 'purple'], // Make sure to edit computed property "colorSettings" too
      colorClass: ['redpuyo', 'greenpuyo', 'bluepuyo', 'yellowpuyo', 'purplepuyo']
    }
  },
  computed: {
    ...mapState(['PuyoSettings']),
    colorSettings: function () {
      return [this.red, this.green, this.blue, this.yellow, this.purple]
    },
    colorSettingsCSS: function () {
      return [this.redSettingsCSS, this.greenSettingsCSS, this.blueSettingsCSS, this.yellowSettingsCSS, this.purpleSettingsCSS]
    },
    redSettings: function () {
      return {
        hue: parseInt(this.red.hue),
        contrast: parseInt(this.red.contrast),
        saturation: parseInt(this.red.saturation),
        brightness: parseInt(this.red.brightness)
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
        hue: parseInt(this.green.hue),
        contrast: parseInt(this.green.contrast),
        saturation: parseInt(this.green.saturation),
        brightness: parseInt(this.green.brightness)
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
        hue: parseInt(this.blue.hue),
        contrast: parseInt(this.blue.contrast),
        saturation: parseInt(this.blue.saturation),
        brightness: parseInt(this.blue.brightness)
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
        hue: parseInt(this.yellow.hue),
        contrast: parseInt(this.yellow.contrast),
        saturation: parseInt(this.yellow.saturation),
        brightness: parseInt(this.yellow.brightness)
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
        hue: parseInt(this.purple.hue),
        contrast: parseInt(this.purple.contrast),
        saturation: parseInt(this.purple.saturation),
        brightness: parseInt(this.purple.brightness)
      }
    },
    purpleSettingsCSS: function () {
      return {
        '-webkit-filter': `hue-rotate(${this.purpleSettings.hue}deg) contrast(${this.purpleSettings.contrast}%) saturate(${this.purpleSettings.saturation}%) brightness(${this.purpleSettings.brightness}%)`,
        'filter': `hue-rotate(${this.purpleSettings.hue}deg) contrast(${this.purpleSettings.contrast}%) saturate(${this.purpleSettings.saturation}%) brightness(${this.purpleSettings.brightness}%)`
      }
    }
  },
  methods: {
    ...mapMutations(['updatePuyoColorSettings'])
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
  },
  mounted () {
    this.puyoCardHeight = this.$refs.editPuyoColor[this.colors.indexOf(this.puyotab)].clientHeight
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.puyoCardHeight = this.$refs.editPuyoColor[this.colors.indexOf(this.puyotab)].clientHeight
      })
    })
  },
  watch: {
    dialog: function () {
      this.$nextTick(() => {
        this.puyoCardHeight = this.$refs.editPuyoColor[this.colors.indexOf(this.puyotab)].clientHeight
      })
    },
    redSettings: function () {
      let settings = {
        red: this.redSettings,
        green: this.greenSettings,
        blue: this.blueSettings,
        yellow: this.yellowSettings,
        purple: this.purpleSettings
      }
      this.updatePuyoColorSettings(settings)
    },
    greenSettings: function () {
      let settings = {
        red: this.redSettings,
        green: this.greenSettings,
        blue: this.blueSettings,
        yellow: this.yellowSettings,
        purple: this.purpleSettings
      }
      this.updatePuyoColorSettings(settings)
    },
    blueSettings: function () {
      let settings = {
        red: this.redSettings,
        green: this.greenSettings,
        blue: this.blueSettings,
        yellow: this.yellowSettings,
        purple: this.purpleSettings
      }
      this.updatePuyoColorSettings(settings)
    },
    yellowSettings: function () {
      let settings = {
        red: this.redSettings,
        green: this.greenSettings,
        blue: this.blueSettings,
        yellow: this.yellowSettings,
        purple: this.purpleSettings
      }
      this.updatePuyoColorSettings(settings)
    },
    purpleSettings: function () {
      let settings = {
        red: this.redSettings,
        green: this.greenSettings,
        blue: this.blueSettings,
        yellow: this.yellowSettings,
        purple: this.purpleSettings
      }
      this.updatePuyoColorSettings(settings)
    }
  }
}
</script>

<style scoped>
.switch-puyo-tab-enter-active, .switch-puyo-tab-leave-active {
  transition: all .5s;
}
.switch-puyo-tab-enter, .switch-puyo-tab-leave-to {
  opacity: 0;
}

.puyo-tab {
  box-sizing: border-box;
  padding: 8px;
  display: inline-block;
}

.active {
  border-bottom: 3px solid #4CAF50;
}

.puyo-container {
  --rescale: 0.5;
  width: calc(64px * var(--rescale));
  height: calc(60px * var(--rescale));
  position: relative;
}

.puyo-sub-container {
  width: calc(64px * var(--rescale));
  height: calc(64px * var(--rescale));
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.puyo {
  background-image: url('../assets/puyo/puyo_aqua.png');
  display: inline-block;
  background-image: url('../assets/puyo/puyo_aqua.png');
  width: calc(72px * var(--rescale));
  height: calc(68px * var(--rescale));
  --multiplyposition: calc(var(--cnxOffset) * var(--rescale));
  --multiplycolor: calc(var(--colorOffset) * var(--rescale));
  background-position: var(--multiplyposition) var(--multiplycolor);
  background-size: 2844.4444%;
  position: absolute;
  left: 0;
  top: 0;
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
</style>
