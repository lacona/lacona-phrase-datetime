/** @jsx createElement */
import _ from 'lodash'
import { createElement, Phrase } from 'lacona-phrase'
import { AmbiguousTime, Time } from './time'
import moment from 'moment'
import { coerceAmbiguousTime, join, relativeDate } from './helpers'
import { DateWithTimeOfDay, Date } from './date'

export class DateTime extends Phrase {
  validate (result) {
    if (!result) return true

    if (!this.props.past && moment().isAfter(result)) {
      return false
    }
    if (!this.props.future && moment().isBefore(result)) {
      return false
    }

    return true
  }


  describe () {
    return (
      <placeholder text='date and time' showForEmpty>
        <choice>
          {this.props._impliedDate ? <TimeAlone prepositions={this.props.prepositions} seconds={this.props.seconds} /> : null}

          {this.props._impliedTime ? <DateAlone time={this.props.defaultTime} /> : null}

          <DateAndTime prepositions={this.props.prepositions} seconds={this.props.seconds} />

          <DateWithTimeOfDayAndTime prepositions={this.props.prepositions} seconds={this.props.seconds} />
        </choice>
      </placeholder>
    )
  }
}

DateTime.defaultProps = {
  defaultTime: {hour: 8},
  seconds: true,
  prepositions: false,
  _impliedTime: true,
  _impliedDate: true,
  past: true,
  future: true
}

class DateAndTime extends Phrase {
  getValue (result) {
    if (!result) return

    return join(result.date, result.time)
  }

  describe () {
    return (
      <choice>
        <sequence>
          <Time id='time' seconds={this.props.seconds} relative={false} recurse={false} prepositions={this.props.prepositions} />
          <literal text=' ' />
          <Date id='date' recurse={false} prepositions />
        </sequence>

        <sequence>
          <Date id='date' recurse={false} prepositions={this.props.prepositions} />
          <literal text=' ' />
          <Time id='time' seconds={this.props.seconds} relative={false} recurse={false} prepositions />
        </sequence>
      </choice>
    )

  }
}

class DateWithTimeOfDayAndTime extends Phrase {
  getValue (result) {
    if (!result || !result.impliedTime) return

    if (result.ambiguousTime) {
      const time = coerceAmbiguousTime(result.ambiguousTime, result.impliedTime.range)
      return join(result.date, time)
    } else {
      const time = result.time || {hour: result.impliedTime.default}
      return join(result.date, time)
    }
  }

  filter (result) {
    if (result && result.time && result.impliedTime) {
      return _.inRange(result.time.hour, ...result.impliedTime.range)
    }

    return true
  }

  describe () {
    return (
      <filter function={this.filter.bind(this)}>
        <choice>
          <sequence>
            <choice merge>
              <AmbiguousTime id='ambiguousTime' prepositions={this.props.prepositions} seconds={this.props.seconds} />
              <Time id='time' seconds={this.props.seconds} relative={false} recurse={false} prepositions={this.props.prepositions} seconds={this.props.seconds} />
            </choice>
            <literal text=' ' />
            <DateWithTimeOfDay merge />
          </sequence>

          <sequence>
            <DateWithTimeOfDay merge />
            <literal text=' ' />
            <choice limit={1} merge>
              <AmbiguousTime id='ambiguousTime' seconds={this.props.seconds} prepositions seconds={this.props.seconds} />
              <Time id='time' seconds={this.props.seconds} relative={false} recurse={false} prepositions seconds={this.props.seconds} />
            </choice>
          </sequence>
        </choice>
      </filter>
    )
  }
}

class DateAlone extends Phrase {
  getValue (result) {
    if (!result) return

    if (result.impliedTime) {
      return join(result.date, {hour: result.impliedTime.default})
    } else {
      return join(result.date, this.props.time)
    }
  }

  describe () {
    return (
      <choice limit={1}>
        <Date id='date' prepositions={this.props.prepositions} />
        <DateWithTimeOfDay prepositions={this.props.prepositions} />
      </choice>
    )
  }
}

class TimeAlone extends Phrase {
  getValue (result) {
    if (!result) return

    const date = relativeDate(result.relativeDate)
    return join(date, result.time)
  }

  describe () {
    return (
      <sequence>
        <Time id='time' prepositions={this.props.prepositions} seconds={this.props.seconds} />
        <choice id='relativeDate' limit={1}>
          <literal text='' value={{}} />
          <literal text='' value={{days: 1}} />
          <literal text='' value={{days: -1}} />
        </choice>
      </sequence>
    )
  }
}
