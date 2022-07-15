import { PlusIcon, XIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'preact/hooks';
import { SidebarOverlay } from './sidebarOverlay';
import { Headers as HeadersType, headersAtom } from './tab/store';

interface SettingsProps {
  hide: () => void
}
export const Settings: React.FC<SettingsProps> = ({ hide }) => {
  return (
    <SidebarOverlay hide={hide}>
      <h1 className='text-2xl font-semibold bg-primary p-3 sticky top-0 shadow-md'>
        Settings
      </h1>
      <div className="p-3 py-4">
        <h2 className="text-lg font-semibold">
          Global headers
        </h2>
        <Headers />
      </div>
    </SidebarOverlay>
  );
}

const Headers = () => {
  const [headers, setHeaders] = useAtom(headersAtom)
  let headerItems = Object.entries(headers) as Array<[string, string]>

  return (
    <>
      {headerItems.map(([name, value], idx) => (
        <Header
          removeHeader={() => {
            const newHeaders = headerItems
              .filter((_item, headerIdx) => idx !== headerIdx)
              .reduce((prev, curr) => {
                prev[curr[0]] = curr[1]
                return prev
              }, {} as any)

            setHeaders(newHeaders)
          }}
          setHeaderName={(newName) => {
            if (newName in headers) return alert("Name already exists")

            headerItems[idx][0] = newName
            const newHeaders = headerItems.reduce((prev, curr) => {
              prev[curr[0]] = curr[1]
              return prev
            }, {} as any)

            setHeaders(newHeaders)
          }}
          setHeader={(value) => {
            headerItems[idx][1] = value
            const newHeaders = headerItems.reduce((prev, curr) => {
              prev[curr[0]] = curr[1]
              return prev
            }, {} as any)

            setHeaders(newHeaders)
          }}
          key={idx}
          name={name}
          value={value as string}
        />
      ))}
      <button
        title="New Header"
        className='bg-primary border-zinc-800 border px-2 text-lg outline-none text-zinc-200 py-1'
        onClick={() => {
          if ("name" in headers)
            return alert("Header with the name `name` already exists")

          setHeaders((headers: HeadersType) => {
            const newHeaders = { ...headers }
            newHeaders["name"] = ""
            return newHeaders
          })
        }}
      >
        <PlusIcon width={20} height={20} className='text-neutral-200' />
      </button>
    </>
  )
}

interface HeaderProps {
  removeHeader: () => void
  setHeader: (value: string) => void
  setHeaderName: (name: string) => void
  name: string,
  value: string
}

const Header: React.FC<HeaderProps> = ({ name, value, setHeader, setHeaderName, removeHeader }) => {
  const [valueInput, setValueInput] = useState(value)

  useEffect(() => {
    setHeader(valueInput)
  }, [valueInput])

  return (
    <div className="flex my-1 items-center">
      <input
        size={name.length}
        type="text"
        defaultValue={name}
        className='bg-primary border-zinc-800 border px-2 text-lg outline-none min-w-[130px] text-zinc-200 py-1 h-9'
        readOnly
        onClick={() => {
          const res = prompt("Rename header", name)?.trim()
          if (res == null || res === name || !res) return
          setHeaderName(res)
        }}
      />
      <input
        placeholder="value"
        className="bg-transparent border border-zinc-800 text-lg border-l-0 px-1 outline-none flex-1 h-9"
        type="text"
        defaultValue={valueInput}
        onChange={(e) => setValueInput(e.currentTarget.value)}
      />
      <button
        onClick={() => removeHeader()}
        title="Remove Header"
      >
        <XIcon
          width={20}
          height={20}
          className='text-neutral-400 ml-2 hover:text-neutral-200 transition-colors cursor-pointer'
        />
      </button>
    </div>
  )
}