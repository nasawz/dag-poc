import React from 'react'
import { unescape } from 'lodash-es'
import { Keyword } from './keyword'
import { Cut } from './cut'

interface Props {
  data: any
}

export const ItemName: React.FC<Props> = (props) => {
  const { data } = props
  const { keyword, cutParas = {} } = data
  const name = unescape(data.name)
  const { max, side } = cutParas
  if (keyword) {
    return <Keyword raw={name} keyword={keyword} />
  }
  if (max) {
    return (
      <Cut max={max} left={side} right={side}>
        {name}
      </Cut>
    )
  }
  return <span>{name}</span>
}
