/** @jsx createElement */

import {createElement} from 'elliptical'
import {DigitString} from 'elliptical-number'

function suppressYear (input) {
  return /^('\d|\d|\d{3})$/.test(input)
}

function mapResult (result) {
  if (result.twoDigitYear) {
    const decade = parseInt(result.twoDigitYear, 10)
    const year = decade < 29 ? 2000 + decade : 1900 + decade
    return {year, _ambiguousCentury: true}
  } else if (result.fourDigitYear) {
    return {year: parseInt(result.fourDigitYear, 10)}
  }
}

const defaultProps = {
  label: 'year'
}

function describe ({props}) {
  return (
    <placeholder
      suppressWhen={suppressYear}
      label={props.label}
      arguments={props.phraseArguments || (props.phraseArguments ? [props.phraseArgument] : [props.label])}>
      <choice limit={1}>
        <sequence>
          <literal text={'\''} optional limited />
          <DigitString minLength={2} maxLength={2} id='twoDigitYear' label='yy' />
        </sequence>

        <DigitString minLength={4} maxLength={4} id='fourDigitYear' label='yyyy' />
      </choice>
    </placeholder>
  )
}

export const Year = {mapResult, describe, defaultProps}
