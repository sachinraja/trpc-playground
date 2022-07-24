import localforage from 'localforage'

type LibName = 'typescript' | '@types/node'
type FileName = string
type FileContent = string

/**
 * A virtual file-system to manage files for the TS Language server
 */
export class TSFS {
  /** Internal map of file names to their content */
  public fs: Map<FileName, FileContent>

  constructor() {
    this.fs = new Map()
  }

  /**
   * Given a lib name, runs a callback function for every file in that library.
   * It might fetch files in the library from a cache or from the network
   */
  private forFileInLib = async (
    libName: LibName,
    cb: (name: string, content: string) => void,
  ) => {
    // First, we fetch metadata about the library

    // Rollup needs us to use static strings for dynamic imports
    const meta = await import('./types/typescript/meta.js')

    // The metadata tells us the version of the library, and gives us a list of file names in the library.
    // If our cache already has this version of the library:
    // 1. We iterate over the file names in that library and fetch file contents from DB (compressed).
    // 2. We iterate over the file names in taht library and call the callback function for every (fileName, fileContent) pair
    //
    // If our cache does not have this version of the library:
    // 1. We fetch all files of this library via the network
    // 2. We remove any other versions of the library that were cached (to conserve space)
    // 3. We iterate over the files we just fetched and cache them (compressed)
    // 4. We iterate over the files we just fetched and call the callback for every (fileName, fileContent) pair

    const isCached = (await localforage.getItem(`ts-lib/${libName}/_version`))
      === meta.version

    // TODO:: Integrity checks?
    if (isCached) {
      const fileNames = meta.files
      const fileContents = (await Promise.all(
        fileNames.map(f => localforage.getItem<string>(`ts-lib/${libName}/${meta.version}/${f}`)),
      )) as string[] // type-cast is olay because we know this file should exist

      fileNames.forEach((name, i) => cb(name, fileContents[i]))
    } else {
      // Remove everything, we'll download types and cache them
      await localforage.clear()

      // Rollup needs us to use static strings for dynamic imports
      const data = await import('./types/typescript/data.js')

      // Add new things to DB
      const files = Object.entries(data.files)

      // First, call the callback for all these files to unblock the caller
      files.forEach(([name, content]) => cb(name, content))

      // Then, persist these file contents in DB
      await Promise.all([
        localforage.setItem(`ts-lib/${libName}/_version`, meta.version),
        ...files.map(([name, content]) =>
          localforage.setItem(
            `ts-lib/${libName}/${data.version}/${name}`,
            content,
          )
        ),
      ])
    }
  }

  injectCoreLibs = async () => {
    await Promise.all([
      this.forFileInLib('typescript', (name, content) => {
        // TS Core libs need to be available at the root path `/` (TSServer requires this)
        this.fs.set('/' + name, content)
      }),
    ])
  }
}
