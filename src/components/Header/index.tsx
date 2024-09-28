'use client'
import Link from 'next/link'
import React from 'react'

import { Gutter } from '../Gutter'
import { Logo } from '../Logo'
import classes from './index.module.scss'

type HeaderBarProps = {
  children?: React.ReactNode
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ children }) => {
  return (
    <header className={classes.header}>
      <Gutter className={classes.wrap}>
        <Link href="/">
          <Logo />
        </Link>
      </Gutter>
    </header>
  )
}

export const Header: React.FC = () => {
  return (
    <React.Fragment>
      <HeaderBar />
    </React.Fragment>
  )
}
