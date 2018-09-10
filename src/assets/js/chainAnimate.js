import { TweenMax } from 'gsap'

const PuyoAnimation = {
  popColoredPuyo: function (identifier) { // pass in "#id" or ".class"
    this.puyoFlash(identifier)
  },
  puyoFlash: function (identifier) {
    TweenMax.to(identifier, 0, {opacity: 0, useFrames: true,
                yoyo: true, repeat: 6, repeatDelay: 2,
                onComplete: this.puyoBurst})
  },
  puyoBurst: function (identifier, nextFunction) {
    TweenMax.to(identifier, 10, {scale: 1.5, opacity: 0,
                useFrames: true,
                onComplete: this.popComplete})
  },
  popComplete: function () {
    return true
  }
}

export default PuyoAnimation
