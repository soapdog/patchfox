const { resultFromCache, cacheResult } = require("./cache.js")

const workQueue = {}

let parallelJobs = 0

const maxParallelJobs = 5

const enqueue = (kind, msgId, falseIfOlderThan, work, cb) => {
  let key = `queue-${kind}-${msgId}`
  let possibleResult = resultFromCache(kind, msgId, falseIfOlderThan)

  if (possibleResult) {
    cb(possibleResult)
  } else {
    if (workQueue.hasOwnProperty(key)) {
      // is in the queue, should wait for result.
      setTimeout(() => {
        enqueue(kind, msgId, falseIfOlderThan, work, cb)
      }, (falseIfOlderThan * 1000) / 2)
    } else {
      // not in the queue, should enqueue and block for  result.
      workQueue[key] = { work, cb, kind, msgId }
    }
    processQueue()
  }
}

const processQueue = () => {
  if (Object.keys(workQueue).length > 0 && parallelJobs < maxParallelJobs) {
    // entries in the queue.
    let jobs = Object.keys(workQueue).slice(0, maxParallelJobs)
    parallelJobs += jobs.length

    jobs.forEach(async (job) => {
      let work = workQueue[job]
      try {
        // console.log("starting job...", job)
        let res = await work.work()
        cacheResult(work.kind, work.msgId, res)
        delete workQueue[job]
        work.cb(res)
        console.log("remaining jobs", Object.keys(workQueue).length)
        setTimeout(processQueue, 10)
      } catch (n) {
        console.log("work", work)
        console.error("error with work", n)
      }
      parallelJobs = parallelJobs >= 0 ? parallelJobs - 1 : 0
    })
  }
}

module.exports = {
  enqueue,
  processQueue
}
