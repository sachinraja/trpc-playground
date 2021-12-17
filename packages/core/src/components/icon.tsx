import { ComponentChildren } from 'preact'

type IconBaseProps = {
  className?: string
  width?: number
  height?: number
  title?: string
  children: ComponentChildren
}

type IconProps = Omit<IconBaseProps, 'children'>

const IconBase = ({ className, width = 24, height = 24, title, children }: IconBaseProps) => (
  <svg className={className} width={width} height={height} fill='none' viewBox='0 0 24 24'>
    {title && <title>{title}</title>}
    {children}
  </svg>
)

export const CloseIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path
      stroke='currentColor'
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width='1.5'
      d='M17.25 6.75L6.75 17.25'
    >
    </path>
    <path
      stroke='currentColor'
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width='1.5'
      d='M6.75 6.75L17.25 17.25'
    >
    </path>
  </IconBase>
)

export const AddIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 5.75V18.25'>
    </path>
    <path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M18.25 12L5.75 12'>
    </path>
  </IconBase>
)
