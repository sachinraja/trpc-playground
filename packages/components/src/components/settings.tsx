import { PlusIcon, XIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { SidebarOverlay } from './sidebarOverlay';
import { Headers as HeadersType, headersAtom } from './tab/store';

interface SettingsProps {
  hide: () => void
}
export const Settings: React.FC<SettingsProps> = ({ hide }) => {
  return (
    <SidebarOverlay hide={hide}>
      <div className='bg-primary p-3 sticky top-0 shadow-md flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>
          Settings
        </h1>

        <button onClick={hide}>
          <XIcon
            width={20}
            height={20}
            className="text-neutral-300 hover:text-white transition-colors"
          />
        </button>
      </div>
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
  let headerItems = Object.entries(headers)

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
        defaultValue={value}
        // onChange={(e) => setValueInput(e.currentTarget.value)}
        onChange={(e) => setHeader(e.currentTarget.value)}
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