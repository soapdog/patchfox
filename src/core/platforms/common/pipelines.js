
const pipelines = {
  threadPipes: new Set(),
  messagePipes: new Set(),
  thread: {
    use: (func) => pipelines.threadPipes.add(func),
    get: () => [...pipelines.threadPipes].map((p) => p.apply(p)),
  },
  message: {
    use: (func) => pipelines.messagePipes.add(func),
    get: () => [...pipelines.messagePipes].map((p) => p.apply(p)),
  },
}

module.exports = pipelines
