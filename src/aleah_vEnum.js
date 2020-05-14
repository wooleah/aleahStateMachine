const STATES = {
  sleeping: 'sleeping',
  eating: 'eating',
  playing: 'playing',
  studying: 'studying'
}

function Aleah() {
  let state = STATES.sleeping

  return {
    state() {
      return state;
    },
    toggle() {
      switch (state) {
        case STATES.studying:
          state = STATES.playing;
          break;
        case STATES.sleeping:
          state = STATES.eating;
          break;
        case STATES.eating:
          state = STATES.studying;
          break;
        case STATES.playing:
          state = STATES.sleeping;
          break;
      }
    },
    sleep() {
      state = STATES.sleeping;
    }
  }
}

const aleah = Aleah();
const log = () => console.log(aleah.state());
log();
aleah.toggle();
log();
aleah.toggle();
log();
aleah.sleep();
log();