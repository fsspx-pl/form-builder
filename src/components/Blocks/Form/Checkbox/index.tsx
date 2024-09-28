import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React, { useState } from 'react'

import { Check } from '../../../icons/Check'
import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'
import { CheckboxField } from '@payloadcms/plugin-form-builder/types'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    getValues: any
    register: UseFormRegister<FieldValues & any>
    setValue: any
  }
> = ({
  name,
  errors,
  getValues,
  label,
  register,
  required: requiredFromProps,
  setValue,
  width,
}) => {
  const [checked, setChecked] = useState(false)

  const isCheckboxChecked = getValues(name)

  return (
    <Width width={width?.toString()}>
      <div className={[classes.checkbox, checked && classes.checked].filter(Boolean).join(' ')}>
        <div className={classes.container}>
          <input
            type="checkbox"
            {...register(name, { required: requiredFromProps })}
            checked={isCheckboxChecked}
          />
          <button
            onClick={() => {
              setValue(name, !checked)
              setChecked(!checked)
            }}
            type="button"
          >
            <span className={classes.input}>
              <Check />
            </span>
          </button>
          <span className={classes.label}>{label}</span>
        </div>
        {requiredFromProps && errors[name] && checked === false && <Error />}
      </div>
    </Width>
  )
}
