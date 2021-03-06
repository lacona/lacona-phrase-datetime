/** @jsx createElement */
/* eslint-env mocha */

import _ from 'lodash'
import {text} from './_util'
import {createElement, compile} from 'elliptical'
import chai, { expect } from 'chai'
import chaiDateTime from 'chai-datetime'
import lolex from 'lolex'
import {DateTime} from '../src/datetime'
import moment from 'moment'

chai.use(chaiDateTime)

describe('DateTime', () => {
  let parse, clock

  function test ({input, output, decorated, length = 1}) {
    it(input, () => {
      const data = _.filter(parse(input), output => !_.some(output.words, 'placeholder'))
      expect(data).to.have.length(length)
      if (length > 0) {
        expect(text(data[0])).to.equal(decorated || input)
        expect(data[0].result).to.equalTime(output)
      }
    })
  }

  before(() => {
    clock = lolex.install(global, new Date(1990, 9, 11, 12, 0, 0, 0))
  })

  after(() => {
    clock.uninstall()
  })

  describe('default', () => {
    beforeEach(() => {
      parse = compile(<DateTime />)
    })

    const testCases = [{
      input: '2:00pm 2/3/2003',
      decorated: '2:00pm on 2/3/2003',
      output: moment({year: 2003, month: 1, day: 3, hour: 14}).toDate()
    }, {
      input: 'today at 12pm',
      decorated: 'today at 12:00pm',
      output: moment({year: 1990, month: 9, day: 11, hour: 12}).toDate()
    }, {
      input: '2/3/2003 at 2:00pm',
      decorated: '2/3/2003 at 2:00pm',
      output: moment({year: 2003, month: 1, day: 3, hour: 14}).toDate()
    }, {
      input: '2pm',
      decorated: '2:00pm',
      output: moment({year: 1990, month: 9, day: 11, hour: 14}).toDate()
    }, {
      input: '2am',
      decorated: '2:00am',
      output: moment({year: 1990, month: 9, day: 11, hour: 2}).toDate()
    }, {
      input: '15:00',
      output: moment({year: 1990, month: 9, day: 11, hour: 15}).toDate()
    }, {
      input: '15 tomorrow',
      decorated: '15:00 tomorrow',
      output: moment({year: 1990, month: 9, day: 12, hour: 15}).toDate()
    }, {
      input: '24:00',
      output: moment({year: 1990, month: 9, day: 11, hour: 0}).toDate()
    }, {
      input: 'next Tuesday at 8am',
      decorated: 'next Tuesday at 8:00am',
      output: moment({year: 1990, month: 9, day: 16, hour: 8}).toDate()
    }, {
      input: '8am next Tuesday',
      decorated: '8:00am on next Tuesday',
      output: moment({year: 1990, month: 9, day: 16, hour: 8}).toDate()
    }, {
      input: 'tonight',
      output: moment({year: 1990, month: 9, day: 11, hour: 20}).toDate()
    }, {
      input: '8am on next Tuesday',
      decorated: '8:00am on next Tuesday',
      output: moment({year: 1990, month: 9, day: 16, hour: 8}).toDate()
    }, {
      input: 'this morning',
      output: moment({year: 1990, month: 9, day: 11, hour: 8}).toDate()
    }, {
      input: 'this afternoon',
      output: moment({year: 1990, month: 9, day: 11, hour: 12}).toDate()
    }, {
      input: 'tomorrow',
      output: moment({year: 1990, month: 9, day: 12, hour: 8}).toDate()
    }, {
      input: 'tomorrow morning',
      output: moment({year: 1990, month: 9, day: 12, hour: 8}).toDate()
    }, {
      input: 'tomorrow afternoon',
      output: moment({year: 1990, month: 9, day: 12, hour: 12}).toDate()
    }, {
      input: 'tomorrow evening',
      output: moment({year: 1990, month: 9, day: 12, hour: 17}).toDate()
    }, {
      input: 'tomorrow night',
      output: moment({year: 1990, month: 9, day: 12, hour: 20}).toDate()
    }, {
      input: 'tomorrow at 3pm',
      decorated: 'tomorrow at 3:00pm',
      output: moment({year: 1990, month: 9, day: 12, hour: 15}).toDate()
    }, {
      input: 'tomorrow morning at 9',
      decorated: 'tomorrow morning at 9:00',
      output: moment({year: 1990, month: 9, day: 12, hour: 9}).toDate()
    }, {
      input: 'tomorrow afternoon at 9',
      decorated: 'tomorrow afternoon at 9:00',
      output: moment({year: 1990, month: 9, day: 12, hour: 21}).toDate()
    }, {
      input: 'tomorrow at 9 in the afternoon',
      decorated: 'tomorrow at 9:00 in the afternoon',
      output: moment({year: 1990, month: 9, day: 12, hour: 21}).toDate()
    }, {
      input: 'tomorrow evening at 9',
      decorated: 'tomorrow evening at 9:00',
      output: moment({year: 1990, month: 9, day: 12, hour: 21}).toDate()
    }, {
      input: 'tomorrow night at 9',
      decorated: 'tomorrow night at 9:00',
      output: moment({year: 1990, month: 9, day: 12, hour: 21}).toDate()
    }, {
      input: 'tomorrow morning at noon',
      length: 0
    }, {
      input: 'tomorrow afternoon at midnight',
      length: 0
    }, {
      input: 'the day after tomorrow',
      output: moment({year: 1990, month: 9, day: 13, hour: 8}).toDate()
    }, {
      input: 'the afternoon of the day after tomorrow',
      output: moment({year: 1990, month: 9, day: 13, hour: 12}).toDate()
    }, {
      input: 'the day after tomorrow in the afternoon',
      output: moment({year: 1990, month: 9, day: 13, hour: 12}).toDate()
    }, {
      input: 'this Monday morning',
      output: moment({year: 1990, month: 9, day: 8, hour: 8}).toDate()
    }, {
      input: 'tomorrow afternoon at 3pm',
      decorated: 'tomorrow afternoon at 3:00pm',
      output: moment({year: 1990, month: 9, day: 12, hour: 15}).toDate()
    }, {
      input: 'tomorrow morning at 3pm',
      length: 0
    }, {
      input: 'next Monday morning',
      output: moment({year: 1990, month: 9, day: 15, hour: 8}).toDate()
    }, {
      input: 'the afternoon of 2/3/2003',
      output: moment({year: 2003, month: 1, day: 3, hour: 12}).toDate()
    }, {
      input: 'the 12th',
      output: moment({year: 1990, month: 9, day: 12, hour: 8}).toDate()
    }, {
      input: 'the 10th',
      output: moment({year: 1990, month: 9, day: 10, hour: 8}).toDate()
    }]

    _.forEach(testCases, test)
  })

  describe ('past={false}', () => {
    beforeEach(() => {
      parse = compile(<DateTime past={false} />)
    })

    const testCases = [{
      input: '2:00pm 2/3/2003',
      decorated: '2:00pm on 2/3/2003',
      output: moment({year: 2003, month: 1, day: 3, hour: 14}).toDate()
    }, {
      input: '2:00pm 2/3/1987',
      length: 0
    }, {
      input: '2/3/2003 at 2pm',
      decorated: '2/3/2003 at 2:00pm',
      output: moment({year: 2003, month: 1, day: 3, hour: 14}).toDate()
    }, {
      input: '2/3/1987 2:00pm',
      length: 0
    }, {
      input: '2pm',
      decorated: '2:00pm',
      output: moment({year: 1990, month: 9, day: 11, hour: 14}).toDate()
    }, {
      input: '8am',
      decorated: '8:00am',
      output: moment({year: 1990, month: 9, day: 12, hour: 8}).toDate()
    }, {
      input: '2am',
      decorated: '2:00am',
      output: moment({year: 1990, month: 9, day: 12, hour: 2}).toDate()
    }, {
      input: '24:00',
      output: moment({year: 1990, month: 9, day: 12, hour: 0}).toDate()
    }, {
      input: 'next Tuesday at 8am',
      decorated: 'next Tuesday at 8:00am',
      output: moment({year: 1990, month: 9, day: 16, hour: 8}).toDate()
    }, {
      input: '8 next Tuesday',
      decorated: '8:00 on next Tuesday',
      output: moment({year: 1990, month: 9, day: 16, hour: 8}).toDate()
    }, {
      input: '8am next Tuesday',
      decorated: '8:00am on next Tuesday',
      output: moment({year: 1990, month: 9, day: 16, hour: 8}).toDate()
    }, {
      input: '8am on next Tuesday',
      decorated: '8:00am on next Tuesday',
      output: moment({year: 1990, month: 9, day: 16, hour: 8}).toDate()
    }, {
      input: 'tonight',
      output: moment({year: 1990, month: 9, day: 11, hour: 20}).toDate()
    }, {
      input: '8am last Tuesday',
      decorated: '8:00am last Tuesday',
      length: 0
    }, {
      input: 'this morning',
      length: 0
    }, {
      input: 'this afternoon',
      output: moment({year: 1990, month: 9, day: 11, hour: 12}).toDate()
    }, {
      input: 'this evening',
      output: moment({year: 1990, month: 9, day: 11, hour: 17}).toDate()
    }, {
      input: 'tomorrow',
      output: moment({year: 1990, month: 9, day: 12, hour: 8}).toDate()
    }, {
      input: 'tomorrow night',
      output: moment({year: 1990, month: 9, day: 12, hour: 20}).toDate()
    }, {
      input: 'the day after tomorrow',
      output: moment({year: 1990, month: 9, day: 13, hour: 8}).toDate()
    }, {
      input: 'the day before yesterday',
      length: 0
    }, {
      input: 'the afternoon of the day before yesterday',
      length: 0
    }, {
      input: 'this Monday morning',
      length: 0,
    }, {
      input: 'Monday morning',
      output: moment({year: 1990, month: 9, day: 15, hour: 8}).toDate()
    }, {
      input: 'Monday',
      output: moment({year: 1990, month: 9, day: 15, hour: 8}).toDate()
    }, {
      input: 'Friday morning',
      output: moment({year: 1990, month: 9, day: 12, hour: 8}).toDate()
    }, {
      input: 'this Friday morning',
      output: moment({year: 1990, month: 9, day: 12, hour: 8}).toDate()
    }, {
      input: 'tomorrow afternoon at 3pm',
      decorated: 'tomorrow afternoon at 3:00pm',
      output: moment({year: 1990, month: 9, day: 12, hour: 15}).toDate()
    }, {
      input: 'tomorrow morning at 3pm',
      decorated: 'tomorrow morning at 3:00pm',
      length: 0
    }, {
      input: 'next Monday morning',
      output: moment({year: 1990, month: 9, day: 15, hour: 8}).toDate()
    }, {
      input: 'the afternoon of 2/3/1983',
      length: 0
    }, {
      input: 'the afternoon of 2/3/03',
      output: moment({year: 2003, month: 1, day: 3, hour: 12}).toDate()
    }, {
      input: 'the afternoon of 2/3/40',
      output: moment({year: 2040, month: 1, day: 3, hour: 12}).toDate()
    }, {
      input: 'the afternoon of 2/3/2050',
      output: moment({year: 2050, month: 1, day: 3, hour: 12}).toDate()
    }, {
      input: 'the 12th',
      output: moment({year: 1990, month: 9, day: 12, hour: 8}).toDate()
    }, {
      input: 'the 10th',
      output: moment({year: 1990, month: 10, day: 10, hour: 8}).toDate()
    }]

    _.forEach(testCases, test)
  })


    describe ('future={false}', () => {
      beforeEach(() => {
        parse = compile(<DateTime future={false} />)
      })

      const testCases = [{
        input: '2:00pm 2/3/2003',
        decorated: '2:00pm on 2/3/2003',
        length: 0
      }, {
        input: '2:00pm 2/3/1987',
        decorated: '2:00pm on 2/3/1987',
        output: moment({year: 1987, month: 1, day: 3, hour: 14}).toDate()
      }, {
        input: '2/3/2003 at 2pm',
        decorated: '2/3/2003 at 2:00pm',
        length: 0
      }, {
        input: '2/3/1987 at 2:00pm',
        output: moment({year: 1987, month: 1, day: 3, hour: 14}).toDate()
      }, {
        input: '2pm',
        decorated: '2:00pm',
        output: moment({year: 1990, month: 9, day: 10, hour: 14}).toDate()
      }, {
        input: '2am',
        decorated: '2:00am',
        output: moment({year: 1990, month: 9, day: 11, hour: 2}).toDate()
      }, {
        input: 'last Tuesday at 8am',
        decorated: 'last Tuesday at 8:00am',
        output: moment({year: 1990, month: 9, day: 2, hour: 8}).toDate()
      }, {
        input: '8am last Tuesday',
        decorated: '8:00am on last Tuesday',
        output: moment({year: 1990, month: 9, day: 2, hour: 8}).toDate()
      }, {
        input: '8am on last Tuesday',
        decorated: '8:00am on last Tuesday',
        output: moment({year: 1990, month: 9, day: 2, hour: 8}).toDate()
      }, {
        input: 'tonight',
        length: 0
      }, {
        input: '8am next Tuesday',
        length: 0
      }, {
        input: 'this morning',
        output: moment({year: 1990, month: 9, day: 11, hour: 8}).toDate()
      }, {
        input: 'this afternoon',
        output: moment({year: 1990, month: 9, day: 11, hour: 12}).toDate()
      }, {
        input: 'this evening',
        length: 0
      }, {
        input: 'tomorrow',
        length: 0
      }, {
        input: 'yesterday night',
        output: moment({year: 1990, month: 9, day: 10, hour: 20}).toDate()
      }, {
        input: 'the day after tomorrow',
        length: 0
      }, {
        input: 'the day before yesterday',
        output: moment({year: 1990, month: 9, day: 9, hour: 8}).toDate()
      }, {
        input: 'the afternoon of the day before yesterday',
        output: moment({year: 1990, month: 9, day: 9, hour: 12}).toDate()
      }, {
        input: 'this Monday morning',
        output: moment({year: 1990, month: 9, day: 8, hour: 8}).toDate()
      }, {
        input: 'Monday morning',
        output: moment({year: 1990, month: 9, day: 8, hour: 8}).toDate()
      }, {
        input: 'Friday morning',
        output: moment({year: 1990, month: 9, day: 5, hour: 8}).toDate()
      }, {
        input: 'this Friday morning',
        length: 0
      }, {
        input: 'yesterday afternoon at 3pm',
        decorated: 'yesterday afternoon at 3:00pm',
        output: moment({year: 1990, month: 9, day: 10, hour: 15}).toDate()
      }, {
        input: 'yesterday morning at 3pm',
        length: 0
      }, {
        input: 'next Monday morning',
        length: 0
      }, {
        input: 'the afternoon of 2/3/1983',
        output: moment({year: 1983, month: 1, day: 3, hour: 12}).toDate()
      }, {
        input: 'the afternoon of 2/3/03',
        output: moment({year: 1903, month: 1, day: 3, hour: 12}).toDate()
      }, {
        input: 'the afternoon of 2/3/40',
        output: moment({year: 1940, month: 1, day: 3, hour: 12}).toDate()
      }, {
        input: 'the afternoon of 2/3/2050',
        length: 0
    }, {
      input: 'the 12th',
      output: moment({year: 1990, month: 8, day: 12, hour: 8}).toDate()
    }, {
      input: 'the 10th',
      output: moment({year: 1990, month: 9, day: 10, hour: 8}).toDate()
      }]

      _.forEach(testCases, test)
    })

  // describe('extended', () => {
  //   class SpecialDay extends Phrase {
  //     describe () {
  //       return (
  //         <choice>
  //           <literal text='christmas' value={{month: 11, day: 25}} />
  //           <literal text='new years' value={{month: 0, day: 1}} />
  //         </choice>
  //       )
  //     }
  //   }

  //   SpecialDay.extends = [Day]

  //   beforeEach(() => {
  //     parser.grammar = <DateTime />
  //     parser.extensions = [SpecialDay]
  //   })

  //   const testCases = [{
  //     input: 'christmas',
  //     output: moment({year: 1990, month: 11, day: 25, hour: 8}).toDate()
  //   }, {
  //     input: 'new years',
  //     output: moment({year: 1990, month: 0, day: 1, hour: 8}).toDate()
  //   }, {
  //     input: 'christmas at 2pm',
  //     output: moment({year: 1990, month: 11, day: 25, hour: 14}).toDate()
  //   }, {
  //     input: 'christmas evening',
  //     output: moment({year: 1990, month: 11, day: 25, hour: 17}).toDate()
  //   }, {
  //     input: 'christmas in the evening',
  //     output: moment({year: 1990, month: 11, day: 25, hour: 17}).toDate()
  //   }, {
  //     input: 'the evening of christmas',
  //     output: moment({year: 1990, month: 11, day: 25, hour: 17}).toDate()
  //   }, {
  //     input: '3 days before christmas',
  //     output: moment({year: 1990, month: 11, day: 22, hour: 8}).toDate()
  //   }, {
  //     input: '1 day before new years',
  //     output: moment({year: 1989, month: 11, day: 31, hour: 8}).toDate()
  //   }, {
  //     input: 'the afternoon of 1 day before new years',
  //     output: moment({year: 1989, month: 11, day: 31, hour: 12}).toDate()
  //   }, {
  //   //   input: 'new years, 2008 afternoon',
  //   //   length: 0
  //   // }, {
  //     input: 'the afternoon of new years, 2008',
  //     output: moment({year: 2008, month: 0, day: 1, hour: 12}).toDate()
  //   // }, {
  //   //   input: 'new years afternoon, 2008',
  //   //   output: moment({year: 2008, month: 0, day: 1, hour: 12}).toDate()
  //   }]

  //   _.forEach(testCases, test)
  // })

  describe('timezoneOffset', () => {
    beforeEach(() => {
      parse = compile(<DateTime timezoneOffset={-480} />) //chinast
    })

    const testCases = [{
      input: '2:00pm 2/3/2003',
      decorated: '2:00pm on 2/3/2003',
      output: moment.utc({year: 2003, month: 1, day: 3, hour: 6}).toDate()
    }, {
      input: '2/3/2003 at 2pm',
      decorated: '2/3/2003 at 2:00pm',
      output: moment.utc({year: 2003, month: 1, day: 3, hour: 6}).toDate()
    }, {
      input: '2pm',
      decorated: '2:00pm',
      output: moment.utc({year: 1990, month: 9, day: 11, hour: 6}).toDate()
    }, {
      input: '2am',
      decorated: '2:00am',
      output: moment.utc({year: 1990, month: 9, day: 10, hour: 18}).toDate()
    }, {
      input: 'next Tuesday at 8am',
      decorated: 'next Tuesday at 8:00am',
      output: moment.utc({year: 1990, month: 9, day: 16, hour: 0}).toDate()
    }, {
      input: '8am next Tuesday',
      decorated: '8:00am on next Tuesday',
      output: moment.utc({year: 1990, month: 9, day: 16, hour: 0}).toDate()
    }, {
      input: 'tonight',
      output: moment.utc({year: 1990, month: 9, day: 11, hour: 12}).toDate()
    }, {
      input: '8am on next Tuesday',
      decorated: '8:00am on next Tuesday',
      output: moment.utc({year: 1990, month: 9, day: 16, hour: 0}).toDate()
    }, {
      input: 'this morning',
      output: moment.utc({year: 1990, month: 9, day: 11, hour: 0}).toDate()
    }, {
      input: 'this afternoon',
      output: moment.utc({year: 1990, month: 9, day: 11, hour: 4}).toDate()
    }, {
      input: 'tomorrow',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 0}).toDate()
    }, {
      input: 'tomorrow morning',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 0}).toDate()
    }, {
      input: 'tomorrow afternoon',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 4}).toDate()
    }, {
      input: 'tomorrow evening',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 9}).toDate()
    }, {
      input: 'tomorrow night',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 12}).toDate()
    }, {
      input: 'tomorrow at 3pm',
      decorated: 'tomorrow at 3:00pm',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 7}).toDate()
    }, {
      input: 'tomorrow morning at 9',
      decorated: 'tomorrow morning at 9:00',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 1}).toDate()
    }, {
      input: 'tomorrow afternoon at 9',
      decorated: 'tomorrow afternoon at 9:00',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 13}).toDate()
    }, {
      input: 'tomorrow at 9 in the afternoon',
      decorated: 'tomorrow at 9:00 in the afternoon',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 13}).toDate()
    }, {
      input: 'tomorrow evening at 9',
      decorated: 'tomorrow evening at 9:00',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 13}).toDate()
    }, {
      input: 'tomorrow night at 9',
      decorated: 'tomorrow night at 9:00',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 13}).toDate()
    }, {
      input: 'tomorrow morning at noon',
      length: 0
    }, {
      input: 'tomorrow afternoon at midnight',
      length: 0
    }, {
      input: 'the day after tomorrow',
      output: moment.utc({year: 1990, month: 9, day: 13, hour: 0}).toDate()
    }, {
      input: 'the afternoon of the day after tomorrow',
      output: moment.utc({year: 1990, month: 9, day: 13, hour: 4}).toDate()
    }, {
      input: 'the day after tomorrow in the afternoon',
      output: moment.utc({year: 1990, month: 9, day: 13, hour: 4}).toDate()
    }, {
      input: 'this Monday morning',
      output: moment.utc({year: 1990, month: 9, day: 8, hour: 0}).toDate()
    }, {
      input: 'tomorrow afternoon at 3pm',
      decorated: 'tomorrow afternoon at 3:00pm',
      output: moment.utc({year: 1990, month: 9, day: 12, hour: 7}).toDate()
    }, {
      input: 'tomorrow morning at 3pm',
      length: 0
    }, {
      input: 'next Monday morning',
      output: moment.utc({year: 1990, month: 9, day: 15, hour: 0}).toDate()
    }, {
      input: 'the afternoon of 2/3/2003',
      output: moment.utc({year: 2003, month: 1, day: 3, hour: 4}).toDate()
    }]

    _.forEach(testCases, test)
  })
})
