const {Machine, interpret, send, assign} = require('xstate');

const sleeping = {
  on: {
    ALARM: 'idle',
  },
  entry: ['logSleep']
}
const idle = {
  on: {
    HUNGRY: 'eating',
    TIRED: {
      target: 'sleeping',
      // actions: [(context, event) => {
      //   console.log(context, event)
      // }, 'logSleep']
    },
    BORED: 'playing',
    MOTIVATED: 'studying',
    SPEAK: 'speaking',
    COUNT: 'counting',
    DO_NOTHING: {
      target: 'idle',
      internal: true
    }
  },
  entry: [() => console.log('enter idle')],
  exit: [() => console.log('exit idle')]
}
const eating = {
  on: {
    TIMER: 'idle'
  }
}
const studying = {
  on: {
    DONE: {
      target: 'finished_studying',
      cond: 'studiedEnough'
    },
    STUDY: {
      actions: ['study']
    }
  },
  entry: ['logStudy'],
  activities: ['studying']
}
const finished_studying = {
  on: {
    REFRESH: {
      target: 'idle',
      actions: [assign({studied: context => context.studied = 0})]
    }
  }
}
const speaking = {
  on: {
    TIMER: 'idle',
    SHOUT: {
      // actions: send('ECHO')
      actions: send({type: 'ECHO'})
    },
    ECHO: {
      actions: () => console.log('echo, echo')
    },
    CHANGE_TONE: {
      actions: ['changeTone', 'logSpeaking']
    }
  },
  entry: ['logSpeaking']
}
const playing = {
  on: {
    TIMER: 'idle'
  }
}
const counting = {
  on: {
    TIMER: 'idle',
    COUNT: {
      actions: [
        context => console.log(context.prevCount), 
        // !assign actions are all merged together and batched to the next context in transition()
        'setPrevCount',
        'incCount', 
        context => console.log(context.count)
      ]
    }
  }
}

const context = {
  tone: 'calming',
  prevCount: undefined,
  count: 0,
  studied: 0
};
const states = {sleeping, idle, eating, studying, finished_studying, speaking, playing, counting}

const config = {
  id: 'Hooman',
  initial: 'sleeping',
  context,
  states,
  strict: true
}

const fetchMachine = Machine(config, {
  actions: {
    logSleep: (context, event) => {
      console.log(`Zzz sleeping in ${event.location}`);
    },
    logStudy: (context, event) => {
      console.log(`Gonna study now, Focus!`)
    },
    logSpeaking: (context, event) => {
      console.log(`Speaking in ${context.tone} tone`)
    },
    changeTone: assign({tone: (context, event) => {
      let tone = '';
      switch (context.tone) {
        case 'angry':
          tone = 'calming';
          break;
        case 'calming':
          tone = 'angry'
          break;
      }
      return tone;
    }}),
    incCount: assign({
      count: context => context.count + 1
    }),
    setPrevCount: assign({
      prevCount: context => context.count
    }),
    study: assign({
      studied: context => context.studied + 1
    })
  },
  activities: {
    // activity is an ongoing side-effect that takes non-zero amount of time
    // - this can return a function that does cleanups
    studying: (context, event) => {
      const study = () => {
        console.log('studying...')
      }
      // called in closure
      study();
      const interval = setInterval(study, 1000) // how do we clean it?
      return () => clearInterval(interval);
    }
  },
  guards: {
    studiedEnough: context => context.studied === 5
  }
});

const service = interpret(fetchMachine).start();

// service.onTransition(state => {
//   if (state.matches('sleeping')) {
//     console.log('zzz')
//     return;
//   }

//   if (state.changed) {
//     console.log(state.value);
//   }
// })

service.send('ALARM');
service.send('STUDY');
