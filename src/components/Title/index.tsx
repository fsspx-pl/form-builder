import { EB_Garamond } from 'next/font/google'
import { Gutter } from '../Gutter'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400'],
})

export const Title = ({ text }: { text: string }) => {
  return (
    <Gutter>
      <h3 className={ebGaramond.className} style={{ fontWeight: '400' }}>{text}</h3>
    </Gutter>
  )
}