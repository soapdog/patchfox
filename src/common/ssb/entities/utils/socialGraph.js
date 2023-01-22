/*

File adapted from Perihelion by Nicolas Santini.
 
Perihelion is an awesome SSB client, get its source from:

https://github.com/nsantini/perihelion

MIT License

Copyright (c) 2022 Nicolas Santini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/


// {
//   FeedId1: {
//     FeedId2: value, // a weight for the edge FeedId1 => FeedId2
//   },
//   FeedId3: {
//     FeedId4: value,
//     FeedId5: value,
//   },
// }
// Weighting
// Following: zero or positive
// Blocking: -1
// Not following and not blocking: -2

module.exports = {
  getSocialGraph: async (ssb) => {
    const relationshipObject = await new Promise((resolve, reject) => {
      ssb.friends.graph((err, graph) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(graph || {});
      });
    });
    return relationshipObject;
  },
  weightings: {
    following: 1,
    blocking: -1,
    indiferent: -2,
  },
};
