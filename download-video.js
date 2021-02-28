const logs = []
async function main() {

    const url = (config.runsInActionExtension) ? args.urls[0] : await getUrlInput() // https://www.learningcontainer.com/mp4-sample-video-files-download/#Sample_MP4_File    
    if (url.length == 0) {
        await printLog()
        Script.complete()
    }
    log(`target: ${url}`)
    
    // if URL end with .mp4/mov/... then download it else extract from html page
    let videoUrls = await getVideoUrls(url)
    
    log(`video src from given url: ${videoUrls}`)
    
    if (videoUrls.length == 0) {
        log(`No video urls found!`)
        await printLog()
        Script.complete()
    } else {
        await Promise.all(videoUrls.map((url) => saveDownloadFile(url)))
        .catch((err) => {log(err.message)})
        log("\n**** COMPLETED ****") 
        await printLog()
        Script.complete()
    }
}
await main()

function log(text) {
    logs.push(text)
}
async function printLog() {
    await QuickLook.present(`**** LOG ****\n${logs.join("\n> ")}`)
}

async function getVideoUrls(url) {
    return (isVideoFileUrl(url)) ?[url]  :await extractVideoUrlsFromPage(url)
}

function isVideoFileUrl(url) {
    const regex = /(.mp4|.mov|.avi|.webp)/;
    return regex.exec(url.split('/').pop()) !== null ;
}

async function extractVideoUrlsFromPage(url) {
    // open webview 
    let webview = new WebView()
    await webview.loadURL(url)

    // parse html and find video urls from video tags
    // parse video.src then <source/> inside the video tag e.g. https://www.computerhope.com/jargon/h/html-video-tag.htm
    let getVideoUrls = `
        function getVideoUrls() {
            let output = []
            let videos = document.getElementsByTagName('video')
            console.log(videos.length)
            for(var i=0; i<videos.length; i++) { 
                if (videos[i].src)
                    output.push(videos[i].src)
                else {
                    let sources = videos[i].getElementsByTagName('source')
                    if (sources.length > 0)
                        output.push(sources[0].src)
                }
            }
            return output
        }
        getVideoUrls()
    `
    return await webview.evaluateJavaScript(getVideoUrls, false)
}

// donwload the given file
async function saveDownloadFile(url) {
    const fm = FileManager.iCloud()
    const dest = fm.bookmarkedPath("scriptable-downloadvideo")
    const req = new Request(url)
    const data = await req.load()
    const path = dest +"/"+ getFileName(url)
    fm.write(path, data)
    log(`saved to ${path}`)
}

function getFileName(url) {
    const regex = /(\.\w+)(.*)/;
    const subst = `$2$1`;
    return url.split('/').pop().replace(regex, subst);
};

async function getUrlInput() {
    const alert = new Alert()
    alert.title = "Video Page URL:"
    alert.addTextField("https://www.learningcontainer.com/mp4-sample-video-files-download/")
    alert.addAction("Confirm")
    alert.addCancelAction("Cancel")
    const alertActionIndex = await alert.present()

    if (alertActionIndex == -1) {
        log("\n**** USER CANCELLED ****")
        return "";
    }
    if (alert.textFieldValue(0).length == 0) {
        log("Empty input. Use debug url")
        return "https://www.learningcontainer.com/mp4-sample-video-files-download/#Sample_MP4_File" 
    } else {
        return alert.textFieldValue(0)
    }
}
exports.isVideoFileUrl = isVideoFileUrl
exports.getFileName = getFileName
