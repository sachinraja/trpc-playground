import { KeyboardSensor as LibKeyboardSensor, MouseSensor as LibMouseSensor } from '@dnd-kit/core'
import { KeyboardEvent, MouseEvent } from 'react'

export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown' as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement)
      },
    },
  ]
}

export class KeyboardSensor extends LibKeyboardSensor {
  static activators = [
    {
      eventName: 'onKeyDown' as const,
      handler: ({ nativeEvent: event }: KeyboardEvent<Element>) => {
        if (event.key === ' ') return false
        return shouldHandleEvent(event.target as HTMLElement)
      },
    },
  ]
}

function shouldHandleEvent(element: HTMLElement | null) {
  let cur = element

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false
    }
    cur = cur.parentElement
  }

  return true
}
