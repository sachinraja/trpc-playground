import { PlusIcon, XIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { SidebarOverlay } from './sidebarOverlay';
import { headersAtom } from './tab/store';
import { Headers as HeadersType } from "./tab/types"

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

  return (
    <div className="overflow-auto">
      <div className="flex flex-col gap-1">
        {Object.entries(headers).map(([name, value]) => (
          <Header
            key={name}
            name={name}
            value={value}
          />
        ))}
      </div>
      <button
        title='New Header'
        className='mt-1 bg-primary border-zinc-800 border px-2 text-lg outline-none text-zinc-200 py-1'
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
    </div>
  )
}

interface HeaderProps {
  name: string,
  value: string
}

const Header: React.FC<HeaderProps> = ({ name, value }) => {
  const [headers, setHeaders] = useAtom(headersAtom)

  return (
    <div className="flex items-center">
      <input
        size={name.length}
        type="text"
        defaultValue={name}
        className='bg-primary border-zinc-800 border px-2 text-lg outline-none min-w-[130px] text-zinc-200 py-1 h-9'
        readOnly
        onClick={() => {
          const newName = prompt("Rename header", name)?.trim()
          if (newName == null || newName === name || !newName) return

          if (newName in headers) return alert("Name already exists")

          setHeaders((headers) => {
            const newHeaders = { ...headers }
            newHeaders[newName] = value
            delete newHeaders[name]

            return newHeaders
          })
        }}
      />
      <input
        placeholder="value"
        className="bg-transparent border border-zinc-800 text-lg border-l-0 px-1 outline-none flex-1 h-9"
        type="text"
        defaultValue={value}
        onChange={(e) => {
          setHeaders((headers) => {
            headers[name] = e.currentTarget.value
            return headers
          })
        }}
      />
      <button
        onClick={() => {
          setHeaders((headers) => {
            const newHeaders = { ...headers }
            delete newHeaders[name]
            return newHeaders
          })
        }}
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