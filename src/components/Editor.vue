<template>
  <b-container id="Editor">
      <b-row align-h="center" no-gutters>
        <b-col class="mt-2" >
          <b-card no-body class="text-center">
            <b-card-header>
              <b-row align-h="between" align-v="center">
                <b-button>&#x25c1;</b-button>
                Slide {{slide}}
                <b-button>&#x25B7;</b-button>
              </b-row>
            </b-card-header>
            <b-card-body>  
              <game></game>
            </b-card-body>
          </b-card>
        </b-col>
        <div style="width: 1%;" class="d-none d-lg-block d-xl-block"></div>
        <div class="w-100 d-none d-md-block d-lg-none"></div>
        <b-col class="mt-2" lg=6>
          <b-card no-body class="text-center">
            <b-tabs card>
              <b-tab title="[History]">
                <p></p>
              </b-tab>
              <b-tab title="[Share]" >
                <p></p>
              </b-tab>
              <b-tab title="[Saved Chains]" >
                <p></p>
              </b-tab>
              <b-tab title="[Simulator]" >
                <p></p>
              </b-tab>
              <b-tab title="Settings" active>
                <b-row>
                  <b-col align-h="start" class="text-left">
                    <editor-settings></editor-settings>
                    
                  </b-col>
                </b-row>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import Game from './Game'
import EditorSettings from './EditorSettings'

export default {
  name: 'Editor',
  components: {
    Game,
    EditorSettings
  },
  data () {
    return {
      slide: 1
    }
  }
}
</script>


<style scoped>
</style>
