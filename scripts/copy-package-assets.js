const fs = require("fs-extra")
const path = require("path")
const globby = require("globby")

const main = async () => {
    const dest = "dist/packages"
    const paths = await globby([
        'src/packages/*/assets/**',
        '!node_modules'
    ]);

    paths.forEach(async source => {
        let elems = source.split("/");
        let destination = `${dest}/${elems[2]}/${elems[4]}`
        let destinationfolder = path.dirname(destination);
        await fs.ensureDir(destinationfolder)
        fs.copyFileSync(source, destination)
        console.log(`${source} --> ${destination}`)
    })

};

main()