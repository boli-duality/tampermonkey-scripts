// ==UserScript==
// @name         批量下载各平台图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量下载各平台图片
// @author       Boli
// @match        *://*.vip.com/detail*.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vip.com
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'
  console.log('批量下载各平台图片脚本加载')

  // 目前只支持唯品会
  const originLog = console.log
  const regFileExt = /\.[^/.]+$/
  const elA = document.createElement('a')

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
        const filename = `${uuid}-${i}-${j + 1}(${count})${fileExt[0]}`
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
    imgs = imgs.map(e => {
      const image = new Image()
      image.src = e.dataset.original
      image.crossOrigin = 'anonymous'
      return image
    })

    let width = 0
    let height = 0

    await Promise.allSettled(
      imgs.map(
        (e, i) =>
          new Promise(
            resolve =>
              (e.onload = () => {
                originLog('图片加载完成:' + ++i, e)
                width = Math.max(width, e.naturalWidth)
                height += e.naturalHeight
                resolve()
              })
          )
      )
    )

    // 创建 canvas 元素
    const canvas = document.createElement('canvas')
    // 获取绘制上下文
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    // 设置canvas样式
    canvas.style.cssText = 'position: absolute; left: 0; top: 0;'
    canvas.width = width
    canvas.height = height
    originLog('canvas.width', width)
    originLog('canvas.height', height)
    // 填充背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)

    // 绘制图片
    let currentHeight = 0
    imgs.forEach(e => {
      const offsetW = (width - e.naturalWidth) / 2
      ctx.drawImage(e, offsetW, currentHeight, e.naturalWidth, e.naturalHeight)
      currentHeight += e.naturalHeight
    })

    // 将 canvas 元素插入到 body 中
    document.body.appendChild(canvas)

    // 创建一个下载链接
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'canvas_image.png'
    link.textContent = '下载'
    link.style.cssText = 'position: absolute; right: 0; top: 50%;color:red;font-size:40px;'

    // 将链接插入到 body 中并点击下载
    document.body.appendChild(link)
  }

  function getSpecificImg(selector = '.dc-img') {
    if (!selector) return '请指定区域'
    selector = selector == 'img' ? selector : `${selector} img`
    const imgs = Array.from(document.querySelectorAll(selector))
    originLog('获取到的图片', imgs)
    // 下载原图片
    // downloadBatch(imgs)
    // 下载拼接图片
    downloadLong(imgs)
  }

  if (window.confirm('需要下载图片吗')) {
    originLog('开始抓取图片...')
    setTimeout(getSpecificImg, 10000)
  }
})()
