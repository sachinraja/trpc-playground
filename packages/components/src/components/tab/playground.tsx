import { XIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { atom, useAtom } from 'jotai'
import { useCallback, useMemo, useState } from 'preact/hooks'
import AutosizeInput from 'react-input-autosize'
import { BaseTab } from './base'
import { tabsAtom, totalTabsCreatedAtom, updateCurrentTabIdAtom } from './store'
import { createNewDefaultTab } from './utils'

type TabProps = {
  index: number
}

export const PlaygroundTab = ({ index }: TabProps) => {
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [currentTabId, updateCurrentTabId] = useAtom(updateCurrentTabIdAtom)
  const [totalTabsCreated, setTotalTabsCreated] = useAtom(totalTabsCreatedAtom)
  const [isEditingTabName, setIsEditingTabName] = useState(false)
  const tabRef = useMemo(() => atom(tabs[index]), [tabs])
  const [tab] = useAtom(tabRef)

  const finishEditingTabName = useCallback(() => {
    const trimmedTabName = tab.name.trim()
    const tabName = trimmedTabName === '' ? 'New Tab' : trimmedTabName

    setTabs((tabs) => {
      const newTabs = [...tabs]
      newTabs[index] = { ...tabs[index], name: tabName }
      return newTabs
    })

    setIsEditingTabName(false)
  }, [tab, setTabs, setIsEditingTabName])

  const className = useMemo(() =>
    clsx(
      tab.id === currentTabId ? undefined : 'opacity-70',
      'select-none',
    ), [tab, currentTabId])

  return (
    <BaseTab
      className={className}
      onClick={() => {
        console.log('running')
        updateCurrentTabId(tab.id)
      }}
    >
      {isEditingTabName
        ? (
          <AutosizeInput
            name='form-field'
            value={tab.name}
            inputClassName='bg-transparent outline-0'
            autoComplete='off'
            onChange={(e) => {
              setTabs((tabs) => {
                const newTabs = [...tabs]
                newTabs[index] = { ...tabs[index], name: e.target.value }
                return newTabs
              })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                finishEditingTabName()
              }
            }}
            onBlur={() => {
              finishEditingTabName()
            }}
            ref={(el) => el?.focus()}
          />
        )
        : (
          <button
            onDblClick={() => {
              setIsEditingTabName(true)
            }}
          >
            <p>{tab.name}</p>
          </button>
        )}

      <button
        title='Close tab'
        className='ml-4'
        onClick={(e) => {
          // will trigger tab onClick and set this to current tab otherwise
          e.stopPropagation()

          const newTabs = [...tabs]
          newTabs.splice(index, 1)
          if (newTabs.length === 0) {
            newTabs.push(createNewDefaultTab(totalTabsCreated))
            setTotalTabsCreated((totalTabsCreated) => totalTabsCreated + 1)
          }

          // if current tab was closed, this should be -1 (index not found)
          const newCurrentTabIndex = newTabs.findIndex((tab) => tab.id === currentTabId)

          if (newCurrentTabIndex === -1) {
            updateCurrentTabId(newTabs[0].id)
          }

          setTabs(newTabs)
        }}
      >
        <XIcon className='text-slate-800' width={20} height={20} />
      </button>
    </BaseTab>
  )
}
