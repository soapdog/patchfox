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


const processMsg = require("./utils/message");
module.exports = async (ssb, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      ssb.db.publish(
        {
          timestamp: Date.now(),
          author: ssb.id,
          type: "post",
          ...message,
        },
        (err, kvt) => {
          if (err) {
            return reject(err);
          }
          resolve(processMsg(ssb, kvt));
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};
