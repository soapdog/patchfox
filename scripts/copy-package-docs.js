const fs = require("fs-extra")
const path = require("path")
const globby = require("globby")
const rimraf = require("rimraf")

const main = async () => {
  const packageDocumentationRootPath = "dist/docs/packages"
  const messageTypesDocumentationRootPath = "dist/docs/message_types"
  
  let paths = await globby([
    "src/packages/*/docs/**",
    "!src/packages/*/docs/message_types/**",
    "!node_modules"
  ]);

  let messageTypes = await globby([
    "!src/packages/*/docs/**",
    "src/packages/*/docs/message_types/**",
    "!node_modules"
  ]);

  console.log("*** DOCUMENTATION ASSEMBLY ***")

  // Copy main package documentation
  await fs.ensureDir("dist/docs/packages/")
  fs.writeFileSync("dist/docs/packages/README.md", `
# Packages 

These are the packages that Patchfox is loading. 

`,)

  paths = paths.sort((p1, p2) => {
    let n1 = p1.split("/")[4]
    let n2 = p2.split("/")[4]
    return n1.localeCompare(n2)
  })

  paths.forEach(source => {
    let elems = source.split("/");
    let destination = `${packageDocumentationRootPath}/${elems[2]}/${elems[4]}`
    let destinationfolder = path.dirname(destination)
    let packageName = elems[2]
    fs.ensureDirSync(destinationfolder)
    fs.copyFileSync(source, destination)
    console.log(`DOCS: ${source} --> ${destination}`)

    let packageReadme = `${packageDocumentationRootPath}/${elems[2]}/README.md`
    if (fs.existsSync(packageReadme)) {
      // Append which message types that package handles.
      let readme = fs.readFileSync(packageReadme, "utf8")

      if (readme.indexOf("## Source code") == -1) {
        fs.appendFileSync(packageReadme, `
## Source code
* [View package \`${packageName}\` at Github](https://github.com/soapdog/patchfox/blob/master/src/packages/${packageName}) 
* [View package \`${packageName}\` at Sourcehut](https://git.sr.ht/~soapdog/patchfox/tree/master/item/src/packages/${packageName})
`)
      }
      fs.appendFileSync("dist/docs/packages/README.md", `* [${elems[2]}](/packages/${elems[2]}/)\n`)
    }
  })

  /* 
   * Copy documentation about message types
   *
   * BOUNTY: create reverse links from message type documentation back to package documentation.
   */

  rimraf.sync(`${messageTypesDocumentationRootPath}/**`)

  await fs.ensureDir("dist/docs/message_types/")
  fs.writeFileSync("dist/docs/message_types/README.md", `
# Secure Scuttlebutt Message Types

A [Scuttlebutt feed](https://ssbc.github.io/scuttlebutt-protocol-guide/#feeds) is a list of all the messages posted by a particular identity. When a user writes a message in a Scuttlebutt client and posts it, that message is put onto the end of their feed.

Each [message](https://ssbc.github.io/scuttlebutt-protocol-guide/#message-format) has its own _type_ which identifies what kind of message it is. There are messages related to your social graph, private messages, chess playing messages, etc. People can define their own message types provided they follow [the message format mentioned above](https://ssbc.github.io/scuttlebutt-protocol-guide/#message-format).


`,)

  messageTypes = messageTypes.sort((p1, p2) => {
    let n1 = p1.split("/")[5]
    let n2 = p2.split("/")[5]
    return n1.localeCompare(n2)
  })

  fs.ensureDirSync(messageTypesDocumentationRootPath)

  messageTypes.forEach(source => {
    let elems = source.split("/");
    let destination = `${messageTypesDocumentationRootPath}/${elems[5]}`
    let typeName = elems[5].replace(".md", "")

    let packageReadme = `${packageDocumentationRootPath}/${elems[2]}/README.md`
    if (fs.existsSync(packageReadme)) {
      // Append which message types that package handles.
      let readme = fs.readFileSync(packageReadme, "utf8")

      if (readme.indexOf("## Message types handled by this package") == -1) {
        fs.appendFileSync(packageReadme, `\n\n## Message types handled by this package\n\n`)
      }

      fs.appendFileSync(packageReadme, `* [${typeName}](/message_types/${typeName})\n`)      
    }

    if (fs.existsSync(destination)) {
      // Another package already copied some docs for that kind of message.
      // Some messages have multiple uses, such as `about`. Each package will document it's own usage of a given message type.
      // The solution in these cases is to concatenate the docs from all the packages that deal with the same message type.
      let newContent = fs.readFileSync(source, "utf8")
      fs.appendFileSync(destination, `\n\n${newContent}`)
      console.log(`MESSAGE TYPE: (append) ${source} --> ${destination}`)
    } else {
      // There is no documentation for that message type in the `dist/` folder.
      // Copy the docs over.
      fs.copyFileSync(source, destination)
      console.log(`MESSAGE TYPE: (copy) ${source} --> ${destination}`)
      // This will append that doc to the root message types documentation file.
      fs.appendFileSync("dist/docs/message_types/README.md", `* [${typeName}](/message_types/${typeName})\n`)
    }
  })

};

main()
