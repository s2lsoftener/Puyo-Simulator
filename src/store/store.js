import Vuex from 'vuex'

export const store = new Vuex.Store({
  state: {
    scaling: 1,
    chainAutoPlay: false,
    editingEnabled: true,
    currentTool: '0', // 0, R, G, B, Y, P, J
    PuyoSettings: {
      red: {
        hue: 0,
        contrast: 100,
        saturation: 100,
        brightness: 100
      },
      green: {
        hue: 0,
        contrast: 100,
        saturation: 100,
        brightness: 100
      },
      blue: {
        hue: 0,
        contrast: 100,
        saturation: 100,
        brightness: 100
      },
      yellow: {
        hue: 0,
        contrast: 100,
        saturation: 100,
        brightness: 100
      },
      purple: {
        hue: 0,
        contrast: 100,
        saturation: 100,
        brightness: 100
      }
    }
  },
  mutations: {
    setTool (state, tool) {
      state.currentTool = tool
    },
    setChainAutoPlay (state, bool) {
      state.chainAutoPlay = bool
    },
    updatePuyoColorSettings (state, settings) {
      state.PuyoSettings = settings
    }
  }
})
