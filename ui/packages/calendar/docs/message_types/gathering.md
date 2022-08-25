# gathering

messages of type `gathering` are used to create _events_. They're analogous to _Facebook events_ if you're familiar with those. At the moment, Patchfox can't create gatherings but it can display them on the various timeline views.

A gathering message looks like:

```json
{
    "author": "@GF214rVSdwf/nARy7oDh+AxJViVCGfKqw+aa162itZY=.ed25519",
    "content": {
        "type": "gathering"
    },
    "hash": "sha256",
    "previous": "%CExarKlCQwiC2FHodXzJzYQyOFWperqRifMakqT5o/w=.sha256",
    "sequence": 14,
    "signature": "Q9I0YNyOKrFhQ8/crZqcC7mhIAtlgbgEXPpvG3GcIES7KCOfoZfS0MfpjTHb4rmIMMvzwaouA4oHxUTlyID9Dg==.sig.ed25519",
    "timestamp": 1513623739118
}

```

It looks a bit empty right? That is because the clients use [about](/message_types/about) messages to fill in the details.
