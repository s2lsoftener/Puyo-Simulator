<template>
  <div id="GameFieldBorder" v-bind:style="dimCSS"></div>
</template>

<script>
export default {
  name: 'GameFieldBorder',
  props: ['dimCSS']
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
