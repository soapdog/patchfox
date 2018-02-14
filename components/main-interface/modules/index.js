
module.exports = {
  message_name: require('./message-name.js'),
  message_link: require('./message-link.js'),
  threads: require('patchapp-threads/threads'),
  post: require('./post'),
  compose: require('patchapp-threads/compose'),
  public: require('patchapp-threads/public'),
  private: require('patchapp-threads/private'),
  uxer: require('patchapp-threads/uxer'),
  message: require('./message'),
  channels: require('patchapp-threads/channels'),
  //vote: require('./vote'),
  key: require('./key')
}

