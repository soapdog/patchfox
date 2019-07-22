import { packages } from "./packages.js"

const main = async () => {
    
    let loadedPackages = {}
    packages.forEach(p => loadedPackages[p.name] = p)

    const system = new loadedPackages.System.package({
        target: document.body,
        props: {
            packages: loadedPackages
        }
    });
}


main()