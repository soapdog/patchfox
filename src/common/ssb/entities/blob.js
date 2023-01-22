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



const mime = require("mime");
const pull = require("pull-stream");
const Read = require("pull-file");

module.exports = {
  getBlob: (ssb, blobId) => {
    const bufferSource = ssb.blobs.get(blobId);
    return new Promise((resolve) => {
      pull(
        bufferSource,
        pull.collect(async (err, bufferArray) => {
          if (err) {
            await ssb.blobs.want(blobId, (err, done) => {
              if (err) console.error(err);
            });
            resolve(Buffer.alloc(0));
          } else {
            const buffer = Buffer.concat(bufferArray);
            resolve(buffer.toString("base64"));
          }
        })
      );
    });
  },
  uploadBlob: (ssb, file) => {
    //    {
    //       fieldName: 'file',
    //       originalFilename: 'pippa drawing 6.jpeg',
    //       path: '/var/folders/hb/m_6pj0ws2z53fz15sfswqw300000gp/T/ab24fMReeUlYcd_b3H7dzNvD.jpeg',
    //       headers: [Object],
    //       size: 155060
    //     }
    return new Promise(async (resolve, reject) => {
      try {
        const hash = await new Promise((resolve, reject) => {
          pull(
            Read(file.path, {}),
            ssb.blobs.add((err, hash) => {
              if (err) return reject(err);
              resolve(hash);
            })
          );
        });
        const mimeType = mime.getType(file.path);
        let link = "";
        if (mimeType.startsWith("image/")) {
          link = `\n![image:${file.originalFilename}](${hash})`;
        } else if (mimeType.startsWith("audio/")) {
          link = `\n![audio:${file.originalFilename}](${hash})`;
        } else if (mimeType.startsWith("video/")) {
          link = `\n![video:${file.originalFilename}](${hash})`;
        } else {
          link = `\n[${file.originalFilename}](${hash})`;
        }
        resolve({ link, hash });
      } catch (err) {
        reject(err);
      }
    });
  },
};
