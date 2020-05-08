const {Machine, interpret} = require('xstate');

const sleeping = {
  on: {
    ALARM: 'idle'
  }
}
const idle = {
  on: {
    HUNGRY: 'eating',
    TIRED: 'sleeping',
    BORED: 'playing',
    STUDY: 'studying'
  }
}
const eating = {
  on: {
    TIMER: 'idle'
  }
}
const studying = {
  on: {
    TIMER: 'idle'
  }
}
const playing = {
  on: {
    TIMER: 'idle'
  }
}

const states = {sleeping, idle, eating, studying, playing}

const initial = 'sleeping'

const config = {
  id: 'Aleah',
  initial,
  states,
  strict: true
}

const AleahMachine = Machine(config)
// console.log(AleahMachine.transition('eating', 'STUDY').value)

const service = interpret(AleahMachine).start();

service.onTransition(state => {
  if (state.matches('sleeping')) {
    console.log('zzz')
    return;
  }

  if (state.changed) {
    console.log(state.value);
  }
})

service.send('ALARM')
service.send('HUNGRY')
service.send('TIMER')
service.send('TIRED')
