<template>
<div class="px-2" id="EditorSettings">
  <h5>Edit Puyo Colors</h5>
  <b-row align-v="center">
    <b-card no-body style="width: 100%;">
      <b-tabs card>
        <b-tab active>
          <template slot="title">
            <div class="puyo red" :style="redSettingsCSS"></div>
          </template>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Hue:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{red.hue}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="red.hue" type="range" min="0" max="360" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Contrast:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{red.contrast}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="red.contrast" type="range" min="0" max="200" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Saturation:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{red.saturation}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="red.saturation" type="range" min="0" max="800" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Brightness:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{red.brightness}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="red.brightness" type="range" min="0" max="300" />
            </b-col>
          </b-row>
        </b-tab>
        <b-tab>
          <template slot="title">
            <div class="puyo green" :style="greenSettingsCSS"></div>
          </template>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Hue:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{green.hue}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="green.hue" type="range" min="0" max="360" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Contrast:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{green.contrast}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="green.contrast" type="range" min="0" max="200" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Saturation:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{green.saturation}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="green.saturation" type="range" min="0" max="800" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Brightness:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{green.brightness}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="green.brightness" type="range" min="0" max="300" />
            </b-col>
          </b-row>
        </b-tab>
        <b-tab>
          <template slot="title">
            <div class="puyo blue" :style="blueSettingsCSS"></div>
          </template>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Hue:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{blue.hue}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="blue.hue" type="range" min="0" max="360" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Contrast:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{blue.contrast}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="blue.contrast" type="range" min="0" max="200" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Saturation:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{blue.saturation}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="blue.saturation" type="range" min="0" max="800" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Brightness:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{blue.brightness}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="blue.brightness" type="range" min="0" max="300" />
            </b-col>
          </b-row>
        </b-tab>
        <b-tab>
          <template slot="title">
            <div class="puyo yellow" :style="yellowSettingsCSS"></div>
          </template>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Hue:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{yellow.hue}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="yellow.hue" type="range" min="0" max="360" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Contrast:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{yellow.contrast}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="yellow.contrast" type="range" min="0" max="200" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Saturation:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{yellow.saturation}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="yellow.saturation" type="range" min="0" max="800" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Brightness:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{yellow.brightness}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="yellow.brightness" type="range" min="0" max="300" />
            </b-col>
          </b-row>
        </b-tab>
        <b-tab>
          <template slot="title">
            <div class="puyo purple" :style="purpleSettingsCSS"></div>
          </template>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Hue:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{purple.hue}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="purple.hue" type="range" min="0" max="360" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Contrast:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{purple.contrast}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="purple.contrast" type="range" min="0" max="200" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Saturation:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{purple.saturation}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="purple.saturation" type="range" min="0" max="800" />
            </b-col>
          </b-row>
          <b-row align-v="center" align-h="between">
            <b-col sm="3" md="3" lg="3">Brightness:</b-col>
            <b-col sm="auto" md="auto" lg="auto">{{purple.brightness}}</b-col>
            <b-col sm="7" md="7" lg="7">
              <b-form-input v-model="purple.brightness" type="range" min="0" max="300" />
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-row>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditorSettings',
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
  computed: {
    ...mapState(['PuyoSettings']),
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
  watch: {
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
#EditorSettings {
  width: 100%;
}

.puyo {
  background-image: url('../assets/puyo/32x32/aqua.png');
  width: 31px;
  height: 31px;
}

.red {
  background-position: 0px 0px !important;
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
</style>
