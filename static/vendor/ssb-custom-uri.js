/**
 * SSB CUSTOM URI
 * 
 * This library and its API is inspired and informed by the conversations in:
 * 
 * %g3hPVPDEO1Aj/uPl0+J2NlhFB2bbFLIHlty+YuqFZ3w=.sha256
 * 
 * And the `fromSigilLink` and `toSigilLink` API signatures have been copied from
 * https://github.com/fraction/ssb-uri
 * 
 * This library is a drop-in replacement for that library.
 */

let ssbCustomUri = {
  protocolSchema: "ssb",
  setCustomProtocolSchema: (schema) => {
    ssbCustomUri.protocolSchema = schema
  },
  removeProtocolSchemaFromLink: (link) => {
    // remove // if present, some browsers add it automatically (I'm looking at you Firefox)
    if (link.indexOf("//") !== -1) {
      link = link.replace("//", "")
    }

    // remove `ssb:` if present.
    if (link.slice(0, ssbCustomUri.protocolSchema.length + 1) === `${ssbCustomUri.protocolSchema}:`) {
      link = link.slice(ssbCustomUri.protocolSchema.length + 1)
    }
    return link
  },
  fromSigilLink: (sigilLinkString) => {
    let sigil = sigilLinkString[0]
    let prefix
    let format = sigilLinkString.split(".")[1]
    let hash = sigilLinkString.slice(1, sigilLinkString.indexOf("."))

    switch (sigil) {
      case "%":
        prefix = "message"
        break
      case "&":
        prefix = "blob"
        break
      case "@":
        prefix = "feed"
        break
      default:
        console.error(`Not a valid sigil prefix: ${prefix}`)
        return false
    }

    return `${ssbCustomUri.protocolSchema}:${prefix}/${format}/${encodeURIComponent(hash)}`

  },
  toSigilLink: (link) => {
    link = ssbCustomUri.removeProtocolSchemaFromLink(link)

    let prefix = link.slice(0, link.indexOf("/"))
    link = link.slice(link.indexOf("/") + 1) // remove prefix.

    let format = link.slice(0, link.indexOf("/"))
    link = link.slice(link.indexOf("/") + 1) // remove format.

    let hash = decodeURIComponent(link)

    let sigil;

    switch (prefix) {
      case "message":
        sigil = "%"
        break
      case "blob":
        sigil = "&"
        break
      case "feed":
        sigil = "@"
        break
      default:
        console.error(`Not a valid url prefix: ${prefix}`)
        return false
    }

    return `${sigil}${hash}.${format}`
  },
  peerInviteToLink: (peerInvite) => {
    /*
    Sample
    dht:DAy3i1tSOyqCsb+vVXc7enc+lo9XI26VknqCJ+PmCnc=:@FuvN1MpxWHGGYAswLAmfpTkkS5iKaFog2aPL4baU1cE=.ed25519
    */

    let parts = peerInvite.split(":")

    let type = parts[0]
    let invite = encodeURIComponent(parts[1])
    let feed = ssbCustomUri.fromSigilLink(parts[2]).replace(`${ssbCustomUri.protocolSchema}:`, "") // beware of `ssb:`

    return `${ssbCustomUri.protocolSchema}:invite/${type}/${invite}/${feed}`
  },
  peerInviteFromLink: (link) => {
    link = ssbCustomUri.removeProtocolSchemaFromLink(link)


    let urlKind = link.slice(0, link.indexOf("/"))
    if (urlKind !== "invite") {
      console.error("URL is not a SSB Invite", link)
      return false
    }

    link = link.slice(link.indexOf("/") + 1) // remove urlKind.

    let type = link.slice(0, link.indexOf("/"))
    if (type == "pub") {
      console.error("URL is not a SSB peer invite but a pub invite", link)
      return false
    }

    link = link.slice(link.indexOf("/") + 1) // remove type.

    let invite = decodeURIComponent(link.slice(0, link.indexOf("/")))
    link = link.slice(link.indexOf("/") + 1) // remove invite.

    let feed = ssbCustomUri.toSigilLink(`${ssbCustomUri.protocolSchema}:${link}`)

    return `${type}:${invite}:${feed}`


  },
  pubInviteToLink: (pubInvite) => {
    /*
    pub invite:
    foo.bar.co.nz:8009:@6lOh+rLq4MQubPQoKenbB827dh5NVc2FAjy30MTc08o=.ed25519~93RP4aT6YNm+7++Ab3VQd+w/CL2w6p8QuX7fRaUs9cY=
    */

    let parts = pubInvite.split(":")

    let type = "pub"
    let host = parts[0]
    let port = parts[1]
    let invite = encodeURIComponent(parts[2].slice(parts[2].indexOf("~") + 1))
    let feed = ssbCustomUri.fromSigilLink(parts[2].slice(0, parts[2].indexOf("~"))).replace(`${ssbCustomUri.protocolSchema}:`, "") // beware of `ssb:`

    return `${ssbCustomUri.protocolSchema}:invite/${type}/${host}/${port}/${invite}/${feed}`
  },
  pubInviteFromLink: (link) => {
    link = ssbCustomUri.removeProtocolSchemaFromLink(link)


    let urlKind = link.slice(0, link.indexOf("/"))
    if (urlKind !== "invite") {
      console.error("URL is not a SSB Invite", link)
      return false
    }

    link = link.slice(link.indexOf("/") + 1) // remove urlKind.

    let type = link.slice(0, link.indexOf("/"))
    if (type !== "pub") {
      console.error("URL is not a SSB pub invite", link)
      return false
    }

    link = link.slice(link.indexOf("/") + 1) // remove type.

    let host = link.slice(0, link.indexOf("/"))
    link = link.slice(link.indexOf("/") + 1) // remove host.

    let port = link.slice(0, link.indexOf("/"))
    link = link.slice(link.indexOf("/") + 1) // remove port.

    let invite = decodeURIComponent(link.slice(0, link.indexOf("/")))
    link = link.slice(link.indexOf("/") + 1) // remove invite.

    let feed = ssbCustomUri.toSigilLink(`${ssbCustomUri.protocolSchema}:${link}`)

    return `${host}:${port}:${feed}~${invite}`


  }
}

if (window) {
  window.ssbCustomUri = ssbCustomUri
}

export default ssbCustomUri
