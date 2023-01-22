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


const multiserver = require("multiserver-address");
const Ref = require("ssb-ref");

module.exports = async (ssb, invite) => {
  return new Promise((resolve, reject) => {
    if (multiserver.check(invite)) {
      ssb.conn.connect(invite, { type: "room" }, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const key = Ref.getKeyFromAddress(invite);
          ssb.conn.remember(invite, { key, type: "room", autoconnect: true });
          resolve(data);
        }
      });
    } else {
      ssb.invite.accept(invite, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    }
  });
};
