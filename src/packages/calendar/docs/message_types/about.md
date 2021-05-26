# about (gathering)

`about` messages are very flexible. They are often used to add or alter metadata _about_ some other message. In Patchfox documentation, I use the jargon that this message is _overloaded_ and it's meaning depends on which message it is _abouting_ about.

In the case of [gathering](/message_types/gathering), the message will be used to attach metadata such as description and date, but also to flag people as attending the event. Let's look at some samples:

```json
{
    "author": "@GF214rVSdwf/nARy7oDh+AxJViVCGfKqw+aa162itZY=.ed25519",
    "content": {
        "about": "%1T2IbTOXd7euvhEsHnZ9WgsRRNUgqfXVbLW/w4Hueak=.sha256",
        "startDateTime": {
            "bias": -60,
            "epoch": 1514113200000,
            "tz": "Canada/Pacific",
            "valid": true
        },
        "title": "Christmas",
        "type": "about"
    },
    "hash": "sha256",
    "previous": "%1T2IbTOXd7euvhEsHnZ9WgsRRNUgqfXVbLW/w4Hueak=.sha256",
    "sequence": 15,
    "signature": "K2SL5Y3UpO1NjSwNCY8+dSOeEWjhgD/65b2hzacuR0d+lPdW8dY63/2zgxax9XD5UDzjwfPRM9ogNHcmI1ldCw==.sig.ed25519",
    "timestamp": 1513623739160
}

```

The message sample above is setting the _date_ for a [gathering](/message_types/gathering) and adding a _title_ to it.

Let's look at another case of `about` being used with _gatherings_:

```json
{
    "author": "@GF214rVSdwf/nARy7oDh+AxJViVCGfKqw+aa162itZY=.ed25519",
    "content": {
        "about": "%1T2IbTOXd7euvhEsHnZ9WgsRRNUgqfXVbLW/w4Hueak=.sha256",
        "attendee": {
            "link": "@GF214rVSdwf/nARy7oDh+AxJViVCGfKqw+aa162itZY=.ed25519"
        },
        "type": "about"
    },
    "hash": "sha256",
    "previous": "%6AS8z2tf+qS0HYxf/pH4KGK7m0/NCDujnY6ATwDX5Vg=.sha256",
    "sequence": 16,
    "signature": "CyZ6CT9shZmiajt3UbYrP0WyjaHf3EdALzQQa264x9QdzZxVe/YyQk5Pfz+/uApHHtisf5Lv+6VjQrCRzUDZCw==.sig.ed25519",
    "timestamp": 1513623753905
}

```

That message is marking a _feed_ (aka a user) as attending the _gathering_.
