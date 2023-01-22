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


const blob = require("./blob");
const socialGraph = require("./utils/socialGraph");

const getProfile = async (ssb, feedId) => {
  return new Promise((resolve, reject) => {
    ssb.db.onDrain("aboutSelf", () => {
      try {
        const profile = ssb.db.getIndex("aboutSelf").getProfile(feedId);
        resolve(profile);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
};

module.exports = {
  filterProfiles: async (ssb, name) => {
    return new Promise((resolve, reject) => {
      try {
        const allProfiles = ssb.db.getIndex("aboutSelf").getProfiles();
        const profiles = Object.keys(allProfiles)
          .map((key) => ({ feedId: key, ...allProfiles[key] }))
          .filter(
            (profile) =>
              profile.name && profile.name.toLowerCase().includes(name)
          )
          .slice(0, 10);
        resolve(profiles);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  },
  getRawProfile: getProfile,
  getProfile: async (ssb, feedId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { name, description, image } = await getProfile(ssb, feedId);
        let imageBlob = "";
        try {
          if (image) {
            imageBlob = await blob.getBlob(ssb, image);
          }
        } catch (e) {
          console.log("Error getting image", e);
        }
        const profile = {
          id: feedId,
          name: name || feedId.slice(1, 1 + 8),
          description: description || "",
          image: image || "",
          imageBlob,
        };
        if (feedId !== ssb.id) {
          const graph = await socialGraph.getSocialGraph(ssb);
          profile.following =
            graph[ssb.id][feedId] === socialGraph.weightings.following;
          profile.blocking =
            graph[ssb.id][feedId] === socialGraph.weightings.blocking;
        }
        resolve(profile);
      } catch (err) {
        reject(err);
      }
    });
  },
  updateProfile: async (ssb, profile) => {
    return new Promise(async (resolve, reject) => {
      try {
        ssb.db.publish(
          {
            about: ssb.id,
            type: "about",
            ...profile,
          },
          (err, kvt) => {
            if (err) {
              return reject(err);
            }
            resolve(kvt);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  },
};
