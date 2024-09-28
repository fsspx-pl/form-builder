import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { EmailField } from '@payloadcms/plugin-form-builder/types'
import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'

export const Email: React.FC<
  EmailField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues & any>
  }
> = ({ name, errors, label, register, required: requiredFromProps, width }) => {
  return (
    <Width width={width?.toString()}>
      <div className={classes.wrap}>
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
        <input
          className={classes.input}
          id={name}
          placeholder="Email"
          type="text"
          {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required: requiredFromProps })}
        />
        {requiredFromProps && errors[name] && <Error />}
      </div>
    </Width>
  )
}
