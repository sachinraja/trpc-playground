import { XIcon } from '@heroicons/react/solid'
import { atom, useAtom } from 'jotai'
import { useMemo, useState } from 'preact/hooks'
import AutosizeInput from 'react-input-autosize'
import { BaseTab } from './base'
import { currentTabIndexAtom, previousTabIndexAtom, tabsAtom, totalTabsCreatedAtom } from './store'
import { createNewDefaultTab } from './utils'

type TabProps = {
  index: number
}

export const PlaygroundTab = ({ index }: TabProps) => {
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [, setPreviousTabIndex] = useAtom(previousTabIndexAtom)
  const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom)
  const [totalTabsCreated, setTotalTabsCreated] = useAtom(totalTabsCreatedAtom)
  const [isEditingTabName, setIsEditingTabName] = useState(false)
  const tabRef = useMemo(() => atom(tabs[index]), [tabs])
  const [tab] = useAtom(tabRef)

  return (
    <BaseTab
      className={currentTabIndex === index ? undefined : 'opacity-70'}
    >
      {isEditingTabName
        ? (
          <AutosizeInput
            name='form-field'
            value={tab.name}
            inputClassName='bg-transparent border-0'
            onChange={(e) => {
              setTabs((tabs) => {
                const newTabs = [...tabs]
                newTabs[index] = { ...tabs[index], name: e.target.value }
                return newTabs
              })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditingTabName(false)
              }
            }}
            onBlur={() => {
              if (tabs[index].name === '') {
                setTabs((tabs) => {
                  const newTabs = [...tabs]
                  newTabs[index] = { ...tabs[index], name: 'New Tab' }
                  return newTabs
                })
              }
              setIsEditingTabName(false)
            }}
            ref={(el) => el?.focus()}
          />
        )
        : (
          <button
            onClick={() => {
              setPreviousTabIndex(currentTabIndex)
              setCurrentTabIndex(index)
            }}
            onDblClick={() => {
              console.log('double clicked')
              setIsEditingTabName(true)
            }}
          >
            <p>{tab.name}</p>
          </button>
        )}

      <button
        title='Close tab'
        className='ml-4'
        onClick={() => {
          setTabs((tabs) => {
            const newTabs = [...tabs]
            newTabs.splice(index, 1)
            if (newTabs.length === 0) {
              newTabs.push(createNewDefaultTab(totalTabsCreated))
              setTotalTabsCreated((totalTabsCreated) => totalTabsCreated + 1)
            }

            let newPreviousTabIndex = currentTabIndex
            let newIndex = currentTabIndex
            const lastNewTabsIndex = newTabs.length - 1
            if (newIndex > lastNewTabsIndex) {
              newPreviousTabIndex = lastNewTabsIndex
              newIndex = lastNewTabsIndex
            }

            setPreviousTabIndex(newPreviousTabIndex)
            setCurrentTabIndex(newIndex)

            return newTabs
          })
        }}
      >
        <XIcon className='text-slate-800' width={20} height={20} />
      </button>
    </BaseTab>
  )
}
