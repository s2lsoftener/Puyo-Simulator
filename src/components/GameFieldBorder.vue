<template>
  <div id="GameFieldBorder" v-bind:style="[dimCSS, hideCell]"></div>
</template>

<script>
export default {
  name: 'GameFieldBorder',
  props: ['dimCSS', 'indexRow', 'indexCol', 'FieldSettings', 'bottom'],
  computed: {
    hideCell: function () {
      // Stylistic function. If this border cell coincides with a hidden row, set opacity to 0.
      if (this.bottom) {
        return {'opacity': 1}
      } else if (this.indexRow < this.FieldSettings.hiddenRows) {
        return {'opacity': 0}
      } else {
        return {'opacity': 1}
      }
    }
  }
}
</script>

<style>
#GameFieldBorder {
  all: unset;
  display: inline-block;
  background-image: url('../assets/puyo/32x32/block-border.png');
  padding: 0;
  margin: 0;
}
</style>
