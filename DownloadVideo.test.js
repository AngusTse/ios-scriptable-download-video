const { test, expect } = require('@jest/globals')
const download = require('./DownloadVideo')


describe('Determine is video file url', () => {
    test('html page url', () => {
        expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/")).toBeFalsy()
    });
    
    test('video urls', () => {
        expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/1.mp4")).toBeTruthy()
        expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/1.mov")).toBeTruthy()
        expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/1.avi")).toBeTruthy()
        expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/1.webp")).toBeTruthy()
    });
    
    test('video urls with parameters', () => {
        expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/1.mp4?a=1")).toBeTruthy()
        expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/1.mov?a=1&b=2")).toBeTruthy()
    });
    
    test('non video file url', () => {
        expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/1.jpg")).toBeFalsy()
    });
    
    test('non video file url', () => {
        expect(download.isVideoFileUrl("https://www.learningcontainer.com/mp4-sample-video-files-download/1.jpg")).toBeFalsy()
    });
});


describe('Extract filename from url', () => {
    test('get filename from url', () => {
        expect(download.getFileName('https://www.learningcontainer.com/mp4-sample-video-files-download/1.mp4')).toBe("1.mp4")
    });
    
    test('get filename from url with param', () => {
        expect(download.getFileName('https://www.learningcontainer.com/mp4-sample-video-files-download/1.mp4?a=1')).toBe("1?a=1.mp4")
        expect(download.getFileName('https://www.learningcontainer.com/mp4-sample-video-files-download/1.mp4?a=1&b=2')).toBe("1?a=1&b=2.mp4")
    });
    
    // to be fix the filename parser
    xtest('get filename from url with dot', () => {
        expect(download.getFileName('https://www.learningcontainer.com/mp4-sample-video-files-download/1.test.mp4')).toBe("1.test.mp4")
    });
});