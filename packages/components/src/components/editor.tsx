import { javascript } from '@codemirror/lang-javascript'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { PlayIcon } from '@heroicons/react/solid'
import { state as queryExtensionState } from '@trpc-playground/query-extension'
import { injectTypes, setDiagnostics } from '@trpc-playground/typescript-extension'
import { printObject } from '@trpc-playground/utils'
import { atom, useAtom } from 'jotai'
import { memo } from 'preact/compat'
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'preact/hooks'
import CodeMirror, { CodeMirrorProps } from 'rodemirror'
import { baseExtension, tsExtension } from '../editor/extensions'
import { batchEval, serialEval, transformAndRunQueries } from '../editor/transform-and-run-queries'
import { makePlaygroundRequest } from '../utils/playground-request'
import { configAtom, trpcClientAtom, typesAtom } from './provider'
import { QueryBuilder } from './queryBuilder'
import {
  currentTabAtom,
  editorAtom,
  previousTabAtom,
  previousTabIdAtom,
  tabsAtom,
  updateCurrentTabIdAtom
} from './tab/store'

const MemoizedCodeMirror = memo((props: CodeMirrorProps) => <CodeMirror {...props} />)

const responseValueAtom = atom(printObject({ foo: 'bar' }))

export const Editor = () => {
  const [editorView, setEditorView] = useAtom(editorAtom)
  const [types, setTypes] = useAtom(typesAtom)
  const [, setTabs] = useAtom(tabsAtom)
  const [previousTab] = useAtom(previousTabAtom)
  const [previousTabId] = useAtom(previousTabIdAtom)
  const [currentTabId] = useAtom(updateCurrentTabIdAtom)
  const [currentTab] = useAtom(currentTabAtom)
  const [responseValue, setResponseValue] = useAtom(responseValueAtom)
  const [trpcClient] = useAtom(trpcClientAtom)
  const [config] = useAtom(configAtom)
  const evalFunction = useMemo(() => config?.request.batching ? batchEval : serialEval, [config.request.batching])

  const refreshTypes = useCallback(async () => {
    if (!editorView) return

    try {
      const response = await makePlaygroundRequest('getTypes', {
        playgroundEndpoint: config.playgroundEndpoint,
      })
      setTypes(response)

      editorView.dispatch(injectTypes({
        '/index.d.ts': response.tsTypes.join('\n'),
      }))
      // server might be restarting so ignore fetch errors
      // eslint-disable-next-line no-empty
    } catch (error) { }
  }, [editorView])

  const extensions = useMemo(() => [
    tsExtension,
    queryExtensionState({
      async onExecute(query) {
        const firstArg = query.args[0]
        if (typeof firstArg !== 'string') return

        // force type to satisfy trpc args because it cannot infer types from router
        const args = [firstArg, query.args[1]] as unknown as [string, undefined]
        try {
          if (query.operation === 'query') {
            const response = await trpcClient.query(...args)
            return setResponseValue(printObject(response))
          } else if (query.operation === 'mutation') {
            const response = await trpcClient.mutation(...args)
            return setResponseValue(printObject(response))
          }
        } catch (e) {
          return setResponseValue(printObject(e))
        }
      },
      onError(error) {
        setResponseValue(printObject(error))
      },
    }),
  ], [trpcClient, setResponseValue])

  const responseEditorExtensions = useMemo(() => [
    baseExtension,
    javascript(),
    EditorState.readOnly.of(true),
    EditorView.theme({
      '.cm-line': {
        marginLeft: '30px',
      },
    }),
  ], [])

  useLayoutEffect(() => {
    if (!editorView || !previousTab || (previousTabId === currentTabId)) return

    setTabs((tabs) => {
      const newTabs = [...tabs]
      const previousTabIndex = newTabs.findIndex((tab) => tab.id === previousTabId)
      newTabs[previousTabIndex] = { ...newTabs[previousTabIndex], doc: editorView.state.doc.toString() }

      return newTabs
    })
  }, [editorView, previousTabId, currentTabId, currentTab, setTabs])

  useEffect(() => {
    if (!editorView || !currentTab) return

    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: currentTab.doc,
      },
    })
  }, [editorView, currentTabId])

  useEffect(() => {
    refreshTypes()

    // no need to refresh types anymore
    if (!config.polling.enable || !editorView) return

    const refreshTypesTimeoutMs = config.polling.interval

    let refreshTypesTimeoutId = setTimeout(async function recursiveRefreshTypes() {
      await refreshTypes()
      // refresh ts linter diagnostics after types are refreshed
      editorView.dispatch(await setDiagnostics(editorView.state))

      refreshTypesTimeoutId = setTimeout(recursiveRefreshTypes, refreshTypesTimeoutMs)
    }, refreshTypesTimeoutMs)

    return () => clearTimeout(refreshTypesTimeoutId)
  }, [editorView, refreshTypes])

  return (
    <div className='relative h-full overflow-y-auto'>
      <div className='absolute left-0 right-0 mx-auto w-[4px] z-10 h-full bg-secondary '>
      </div>
      <button
        className='absolute left-0 right-0 mx-auto w-[75px] z-10 focus:outline-none group'
        title='Run all queries'
        onClick={async () => {
          if (!editorView) return

          const responseObjectValue = await transformAndRunQueries({
            code: editorView.state.doc.toString(),
            trpcClient,
            evalFunction,
          })

          setResponseValue(responseObjectValue)
        }}
      >
        <PlayIcon
          className='text-neutral-400 hover:text-neutral-100 group-focus:text-green-600 transition-colors duration-150'
          width={75}
          height={75}
        >
        </PlayIcon>
      </button>

      <div className='grid grid-cols-2 items-stretch h-full'>
        <div className='flex flex-col h-full'>
          <MemoizedCodeMirror
            extensions={extensions}
            onEditorViewChange={(editorView) => setEditorView(editorView)}
            elementProps={{ className: 'bg-primary flex-1' }}
          />
          <QueryBuilder />
        </div>

        <MemoizedCodeMirror
          extensions={responseEditorExtensions}
          value={responseValue}
          selection={{ head: 0, anchor: 0 }}
        />
      </div>
    </div>
  )
}
