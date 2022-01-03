import { Atom } from 'jotai'

/**
 * create type safe initialValues
 * @see https://jotai.org/docs/api/core#type-script
 */
export const createInitialValues = () => {
  const initialValues: (readonly [Atom<unknown>, unknown])[] = []
  const get = () => initialValues
  const set = <Value>(anAtom: Atom<Value>, value: Value) => {
    initialValues.push([anAtom, value])
  }
  return { get, set }
}
