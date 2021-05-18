const fs = require("fs-extra")
const path = require("path")
const globby = require("globby")

const main = async () => {
    const dest = "dist/docs/packages"
    const paths = await globby([
        'src/packages/*/docs/**',
        '!node_modules'
    ]);

    fs.writeFileSync("dist/docs/packages/README.md", `
# Packages

These are the packages that Patchfox is loading.

`,)

    paths.forEach(async source => {
        let elems = source.split("/");
        let destination = `${dest}/${elems[2]}/${elems[4]}`
        let destinationfolder = path.dirname(destination);
        await fs.ensureDir(destinationfolder)
        fs.copyFileSync(source, destination)
        console.log(`${source} --> ${destination}`)
        fs.appendFileSync("dist/docs/packages/README.md", `* [${elems[2]}](/packages/${elems[2]}/)\n`)
    })

};

main()
