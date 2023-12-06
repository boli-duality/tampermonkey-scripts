// ==UserScript==
// @name         批量下载各平台图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量下载各平台图片
// @author       Boli
// @match        *://detail.vip.com/detail*.htm*
// @match        *://detail.tmall.com/item.htm*
// @match        *://item.taobao.com/item.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vip.com
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'
  console.log('批量下载各平台图片脚本加载')

  // 目前只支持唯品会
  const originLog = console.log
  const regFileExt = /\.[^/.]+$/
  const platformMap = {
    'detail.vip.com': { name: '唯品会', selector: '.dc-img' },
    'detail.tmall.com': { name: '天猫', selector: '.descV8-container' },
    'item.taobao.com': { name: '淘宝', selector: '.descV8-container' },
  }

  const platform = platformMap[window.location.hostname]
  originLog('当前平台', platform.name)

  const elA = document.createElement('a')
  // 创建 canvas 元素
  const canvas = document.createElement('canvas')
  // 获取绘制上下文
  const ctx = canvas.getContext('2d')
  // 设置canvas样式
  canvas.style.cssText =
    'display:none;z-index: 190000001;cursor:pointer;position: absolute; left: 0; top: 0;'
  canvas.id = 'boli-canvas'
  document.body.appendChild(canvas)

  const elWrap = document.createElement('div')
  elWrap.style.cssText =
    'z-index: 190000000;box-sizing: border-box;position: fixed;top: 5%;right: 40px;display: flex;padding: 20px;width: 400px;height: 600px;border-radius: 10px;box-shadow: 0 0 10px rgb(0 0 0 / 30%);background: #fff;flex-direction: column;font-size: 16px;color: #313131;'
  elWrap.innerHTML = `<h1 style="font-size: 20px;font-weight: bold;margin-bottom: 30px;">
  当前平台：${platform.name}
</h1>
<ul style="overflow: auto;flex: 1">
</ul>
<button id="boli-start-btn" style="cursor:pointer;margin: 10px 10px 0;padding: 10px 30px;border: none;border-radius: 10px;background: #f6f7f8;color: #61666d">
  开始抓取图片
</button>
<button id="boli-preview-btn" style="cursor:pointer;margin: 10px;padding: 10px 30px;border: none;border-radius: 10px;background: #f6f7f8;color: #61666d">
  预览长图
</button>
<div style="display: flex;justify-content: space-between;">
  <button id="boli-download-batch" style="cursor:pointer;flex:1;margin:0 10px;padding: 10px 30px;border: none;border-radius: 10px;background: #f6f7f8;color: #61666d">
    批量下载图片
  </button>
  <button id="boli-download-long" style="cursor:pointer;flex:1;margin:0 10px;padding: 10px 30px;border: none;border-radius: 10px;background: #f6f7f8;color: #61666d">
    下载长图
  </button>
</div>
`
  document.body.appendChild(elWrap)
  originLog('UI', elWrap)

  const ul = elWrap.querySelector('ul')
  const startBtn = elWrap.querySelector('#boli-start-btn')
  const previewBtn = elWrap.querySelector('#boli-preview-btn')
  const batchBtn = elWrap.querySelector('#boli-download-batch')
  const longBtn = elWrap.querySelector('#boli-download-long')
  startBtn.onclick = () => {
    originLog('开始抓取图片...')
    appendMessage('开始抓取图片...')
    window.scrollTo(0, 1000)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvas.style.display = 'none'
    previewBtn.onclick = () => appendMessage('正在生成长图，请耐心等待...')
    let countdown = 10
    appendMessage(countdown + 's')
    const timer = setInterval(() => {
      if (--countdown <= 0) {
        getSpecificImg(platform.selector)
        clearInterval(timer)
      } else appendMessage(countdown + 's')
    }, 1000)
  }
  previewBtn.onclick = () => appendMessage('正在生成长图，请耐心等待...')
  batchBtn.onclick = () => appendMessage('功能暂未开放')
  longBtn.onclick = () => appendMessage('正在生成长图，请耐心等待...')

  function appendMessage(msg) {
    const li = document.createElement('li')
    li.textContent = msg
    ul.appendChild(li)
    ul.scrollTop = ul.scrollHeight
  }

  function uuidV4Short() {
    return 'xxxx'.replace(/[x]/g, c => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  const uuid = uuidV4Short()

  function array2Matrix(arr, n) {
    originLog('array2Matrix', arr, n, Array.isArray(arr))
    const matrix = []
    const len = arr.length
    let i = 0
    while (i < len) {
      matrix.push(arr.slice(i, (i += n)))
    }
    return matrix
  }

  function downloadImage(url, filename) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        elA.href = url
        elA.download = filename
        elA.click()
        URL.revokeObjectURL(url)
      })
  }

  function downloadBatch(imgs) {
    const download = (bundles, i = 1) => {
      if (!bundles.length) return
      originLog(`第${i}批次图片`, bundles)
      bundles.shift().forEach((img, j) => {
        const url = img.dataset.original
        const fileExt = url.match(regFileExt)
        const count = (i - 1) * 20 + j + 1
        if (!fileExt) return originLog('未知图片格式', url)
        const filename = `${uuid}_${i}_${j + 1}-${count}${fileExt[0]}`
        originLog('开始下载图片', url)
        downloadImage(url, filename)
      })
      setTimeout(() => download(bundles, ++i), 5000)
    }
    const bundles = array2Matrix(imgs, 20)
    originLog('开始分批次下载图片', bundles)
    download(bundles)
  }

  async function downloadLong(imgs) {
    // 加载图片
    originLog('加载图片...', imgs)
    appendMessage(`加载图片...`)
    imgs = imgs.map(e => {
      const image = new Image()
      switch (platform.name) {
        case '唯品会':
          image.src = e.dataset.original
          break
        case '淘宝':
        case '天猫':
          image.src = e.dataset.src || e.src
          break
      }
      image.crossOrigin = 'anonymous'
      return image
    })

    let width = 0
    let height = 0

    const total = imgs.length
    let progress = 0
    await Promise.allSettled(
      imgs.map(
        (e, i) =>
          new Promise(
            resolve =>
              (e.onload = () => {
                appendMessage(`第${++i}张图片加载完成 进度：${++progress}/${total}`)
                width = Math.max(width, e.naturalWidth)
                height += e.naturalHeight
                resolve()
              })
          )
      )
    )

    appendMessage('图片加载完成')

    if (!ctx) {
      return
    }

    canvas.width = width
    canvas.height = height
    canvas.onclick = () => (canvas.style.display = 'none')
    originLog('canvas.width', width)
    originLog('canvas.height', height)

    appendMessage('正在生成长图')
    // 绘制图片
    let currentHeight = 0
    imgs.forEach(e => {
      const offsetW = (width - e.naturalWidth) / 2
      ctx.drawImage(e, offsetW, currentHeight, e.naturalWidth, e.naturalHeight)
      currentHeight += e.naturalHeight
    })
    appendMessage('长图生成完毕！')

    previewBtn.onclick = () => {
      const isShow = canvas.style.display == 'block'
      if (isShow) {
        canvas.style.display = 'none'
        previewBtn.textContent = '预览长图'
      } else {
        canvas.style.display = 'block'
        previewBtn.textContent = '关闭预览'
      }
    }

    longBtn.onclick = () => {
      appendMessage('正在下载')
      elA.href = canvas.toDataURL('image/png')
      elA.download = `long_image-${uuid}.png`
      elA.click()
    }
  }

  function getSpecificImg(selector) {
    if (!selector) return '请指定区域'
    selector = selector == 'img' ? selector : `${selector} img`
    const imgs = Array.from(document.querySelectorAll(selector))
    originLog('获取到的图片', imgs)
    appendMessage(`获取到${imgs.length}张图片`)
    if (!imgs.length) return appendMessage('未获取到图片，请稍后重试')
    // 下载原图片
    // downloadBatch(imgs)
    // 下载拼接图片
    downloadLong(imgs)
  }
})()
