# bookclubUpdate

`bookclubUpdate` messages are used to update the metadata of an existing book. You can access _book club_ features by using the [Books mini-app](/packages/books/).

A book club update message looks like:

```json
{
  "type": "bookclubUpdate",
  "updates": "%OXfqGCrk4hvCwn6ReJJTFzeURlGRWO2KXJEv4M4282M=.sha256",
  "title": "Bullshit Jobs: A Theory",
  "description": "\"Back in 1930, the economist John Maynard Keynes prophesied that by the century's end, technology would see us all working fifteen-hour weeks. But instead, something curious happened. Today, average working hours have not decreased, but increased. And now, across the developed world, three-quarters of all jobs are in services or admin, jobs that don't seem to add anything to society: bullshit jobs. In Bullshit Jobs, David Graeber explores how this phenomenon - one more associated with the 20th-century Soviet Union, but which capitalism was supposed to eliminate - has happened. In doing so, he looks at how we value work, and how, rather than being productive, work has become an end in itself; the way such work maintains the current broken system of finance capital; and, finally, how we can get out of it.\"\n\nSource: https://www.amazon.co.uk/Bullshit-Jobs-Theory-David-Graeber/dp/0241263883",
  "authors": "David Graeber",
  "series": "",
  "seriesNo": "",
  "images": {
    "link": "&fYQo6nORDhDv0+NdxTYtv2vKDVPOtjByE6GMjBxY1h4=.sha256",
    "name": "41KYTsS8LpL._SX321_BO1,204,203,200_.jpg",
    "size": 21661,
    "type": "image/jpeg"
  },
  "genres": "",
  "pages": "285"
}

```

Be aware that an earlier version of the book club used `about` messages to update books. This is documented in [V1 schema of ssb-book-schema](https://github.com/ssbc/ssb-book-schema/). Patchfox uses V2 and will not use `about` messages to update books. It still reads such messages though, courtesy of [scuttle-book](https://github.com/ssbc/scuttle-book).

You can read more about book club schemas in the [scuttle-book documentation](https://github.com/ssbc/ssb-book-schema/).
