const { test, expect } = require('@jest/globals')
const download = require('./DownloadVideo')

test('html page url', () => {
    expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/")).toBeFalsy()
});