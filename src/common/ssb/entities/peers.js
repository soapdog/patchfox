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


const profile = require("./profile");

module.exports = {
  getConnectedPeers: async (ssb) => {
    const connectedPeers = ssb.conn.query().peersConnected();
    const connectedPeersProfiles = await Promise.all(
      connectedPeers
        .filter(([addr, data]) => !["room", "pub"].includes(data.type))
        .map(async ([addr, data]) => await profile.getProfile(ssb, data.key))
    );
    return connectedPeersProfiles;
  },
  updateFollow: async (ssb, feedId, currentState) => {
    const state = !currentState;
    return new Promise((resolve, reject) => {
      ssb.friends.follow(feedId, { state }, (err) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve({ following: state });
      });
    });
  },
  updateBlock: async (ssb, feedId, currentState) => {
    const state = !currentState;
    return new Promise((resolve, reject) => {
      ssb.friends.block(feedId, { state }, (err) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve({ following: state });
      });
    });
  },
};
