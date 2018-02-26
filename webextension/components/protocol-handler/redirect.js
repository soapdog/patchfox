let hash = decodeURIComponent(window.location.hash)
console.log(hash)
hash = hash.replace("ssb:", "")
window.location = `http://localhost:3013${hash}` 
