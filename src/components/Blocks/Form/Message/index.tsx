
import React from 'react'

import RichText from '../../../RichText'
import { Width } from '../Width'
import classes from './index.module.scss'
import { MessageField } from '@payloadcms/plugin-form-builder/types'

export const Message: React.FC<MessageField> = ({ message }) => {
  return (
    <Width width="100">
      <RichText className={classes.message} content={message} />
    </Width>
  )
}
