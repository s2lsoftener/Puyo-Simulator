<template>
  <div id="GameField" v-bind:style="fieldStyling" @mousedown="setMouseDown(true)" @mouseup="setMouseDown(false)">
    <div align-h="center" class="game-container">
      <div class="field-spacer-top"></div>
      <b-row no-gutters>
        <b-col><div class="border-hiddenrow-spacer"></div><div class="border-block-sides"></div></b-col>
        <b-col>
          <div class="field-container"><div class="fieldrow" v-for="(row, indexRow) in $store.getters.Field.map" v-bind:key="indexRow"><game-field-cell v-for="(col, indexCol) in row" v-bind:key="indexCol" :indexRow="indexRow" :indexCol="indexCol" :isMouseDown="isMouseDown"></game-field-cell></div></div>
        </b-col>
        <b-col><div class="border-hiddenrow-spacer"></div><div class="border-block-sides"></div></b-col>
      </b-row>
      <div class="border-block-bottom"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GameFieldCell from './GameFieldCell'

export default {
  name: 'GameField',
  data () {
    return {
      isMouseDown: false
    }
  },
  methods: {
    setMouseDown: function (bool) {
      this.isMouseDown = bool // true, false
    }
  },
  components: {
    GameFieldCell
  },
  computed: {
    ...mapGetters(['FieldSettings', 'Field']),
    fieldStyling: function () {
      return {
        '--rescale': 1,
        '--board-columns': this.FieldSettings.columns,
        '--board-visiblerows': this.FieldSettings.visibleRows,
        '--board-hiddenrows': this.FieldSettings.hiddenRows,
        '--board-totalrows': this.FieldSettings.totalRows}
    }
  }
}
</script>

<style scoped>
#GameField {
  position: relative;
  line-height: 0;
  width: calc(calc(var(--board-columns) + 2) * calc(32px * var(--rescale)));
  height: calc(calc(var(--board-totalrows) + 2) * calc(32px * var(--rescale)));
}

.game-container {
  position: absolute;
  top: 0;
  left: 0;
}

.field-spacer-top {
  width: calc(calc(var(--board-columns) + 2) * calc(32px * var(--rescale)));
  height: calc(32px * var(--rescale));
  display: block;
}

.border-hiddenrow-spacer {
  width: calc(32px * var(--rescale));
  height: calc(calc(var(--board-hiddenrows)) * calc(32px * var(--rescale)));
  background-color: rgb(60,60,60);
}

.border-block-sides {
  background-image: url('../assets/puyo/block-border.png');
  width: calc(32px * var(--rescale));
  height: calc(calc(var(--board-visiblerows)) * calc(32px * var(--rescale)));
  background-size: 100%;
}

.border-block-bottom {
  background-image: url('../assets/puyo/block-border.png');
  width: calc(calc(var(--board-columns) + 2) * calc(32px * var(--rescale)));
  height: calc(32px * var(--rescale));
}

.field-container {
  width: calc(calc(var(--board-columns)) * calc(32px * var(--rescale)));
  height: calc(calc(var(--board-totalrows)) * calc(32px * var(--rescale)));
  background-color: rgb(60,60,60);
}
</style>
