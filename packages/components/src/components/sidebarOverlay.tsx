import { ComponentChildren } from 'preact'

type SidebarOverlayProps = {
  hide: () => void
  children: ComponentChildren
}

export const SidebarOverlay = ({ hide, children }: SidebarOverlayProps) => {
  return (
    <div onClick={hide} className='absolute h-screen z-10 overflow-hidden bg-[#00000055] inset-0 w-full'>
      <div
        onClick={(e) => e.stopPropagation()}
        className='absolute h-screen top-0 z-10 overflow-auto bg-secondary right-0 w-4/12'
      >
        {children}
      </div>
    </div>
  )
}
