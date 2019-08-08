# private

One of the cool things about Secure Scuttlebutt is that it takes privacy seriously. The [cryptography techniques](https://ssbc.github.io/scuttlebutt-protocol-guide/#private-messages) employed by the SSB stack allows a group of people to message each other using encrypted text that is only visible to the involved parties, everyone else will just see undecypherable text.

# How does it looks like?

~~~
{
  "key": "%OEZvP6IBUvadgsgCW16wN44TTMu0tntgS2YjOadCSLE=.sha256",
  "value": {
    "previous": "%YQJ+N13OCg14ixpsgsgdjrhe4t/lCI9+6P6oYPtZM=.sha256",
    "author": "@zurF8X68ArfRM71sdgsgW0xDM8QmOnAS5bYOq8hA=.ed25519",
    "sequence": 2529,
    "timestamp": 1560619975563,
    "hash": "sha256",
    "content": "DHczz4HPS1sdgsdg2bTMVXUggdA7wLopexXlNgQA2JukhCH8WKFNAu81fLcu0euPM/lTGuqxQBcAXoYIda6qKCGUwvxdgsgX6cCF3Ktu/BXIsYYk8TECYFM39gTfUTp0ORa18lussdgsdgZsCcOrHN4HJ7QF1dHIEgkWglJtMO+4Q4NwufiQ1keDqgs+xnE6h5qKLBcZjQ8d/uvhSEwhoyJ6oBFAw+MUn0NeF9UYWi2r0EKtMucditltqG1CsdgsdgasH2rGdt6GZkm89L7JahsYiZFtDPV1AQkQNhFp8cO5bHFmMQyhXFZBs0ABDqrq7l9skJlCKvU+w+1+ycDanwqhIoiAjU8+51JtZD4fWh81K/wkKOWBVZeYqZnimNsm9jX+AWlADGUe2GmS3yn/WRJfvcxgjGyGzzy5Sm7xU2XVol6WfKoMrLpedtl9CQ3uk7gR7WLmRUI78CkcJLHXDC3td4JSPWKPpCoh60pmdiG6e8e5aaYpM+LKeHNzqecXpcNKAh3r4281D/dma7lqbU7zujf5xIMni1VmUklVk6+KZr1CIwZUw+esP5DDns/Nyb/w8X1JwuVpSWm/lgsxqsQ==.box",
    "signature": "G6YHYOsdgsdgsdgqrgb7kANjZyegf5ZWM0B6kaQr/GjQ7ormNeOVAdw4jemYqSmW6GXezaR1UC70OymEvBBA==.sig.ed25519"
  },
  "timestamp": 1560619916779,
  "rts": 1560619916779
}
~~~

As you can see from the message above, the `content` is encrypted. Only the intended recipients for that message are able to decrypt it. All the other users will fail to decrypt it and ignore the message.
