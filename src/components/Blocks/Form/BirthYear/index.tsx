import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import React from 'react'

import { SelectField } from '@payloadcms/plugin-form-builder/types'
import { Select } from '../Select'

export const BirthYear: React.FC<
SelectField & {
  control: Control<FieldValues, any>
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any
    }>
  >
}
> = ({ name, control, errors, label, required, width }) => {
  const options = Array.from({ length: 120 }, (_, i) => ({
    label: `${new Date().getFullYear() - i}`,
    value: `${new Date().getFullYear() - i}`,
  }))
  return <Select blockType="select" name={name} control={control} errors={errors} label={label} options={options} required={required} width={width} />
}
