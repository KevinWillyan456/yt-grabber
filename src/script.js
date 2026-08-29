// ===== YT-DLP Script Builder — Neon Edition =====

document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = document.getElementById('current-year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()

  new ScriptBuilder()
})

class ScriptBuilder {
  constructor() {
    this.STORAGE_KEY_VIDEO = 'ytgrabber_video_settings'
    this.STORAGE_KEY_AUDIO = 'ytgrabber_audio_settings'
    this.STORAGE_KEY_TYPE = 'ytgrabber_download_type'
    this.DEFAULT_PATH = '~\\Downloads\\yt-grabber'
    this.cacheElements()
    this.loadType()
    this.loadSettings()
    this.bindEvents()
    this.initSegmentControl()
    this.initDragDrop()
    this.handleTypeChange()
    this.updatePreview()
  }

  // ===== CACHE =====
  cacheElements() {
    this.urlInput = document.getElementById('url')
    this.urlError = document.getElementById('url-error')
    this.playlistWarning = document.getElementById('playlist-warning')

    this.downloadType = document.getElementsByName('downloadType')
    this.segmentControl = document.getElementById('typeControl')

    this.videoQuality = document.getElementById('videoQuality')
    this.videoFormat = document.getElementById('videoFormat')
    this.audioFormat = document.getElementById('audioFormat')
    this.audioQuality = document.getElementById('audioQuality')

    this.videoQualityGroup = document.getElementById('videoQualityGroup')
    this.videoFormatGroup = document.getElementById('videoFormatGroup')
    this.audioFormatGroup = document.getElementById('audioFormatGroup')
    this.audioQualityGroup = document.getElementById('audioQualityGroup')

    this.outputPath = document.getElementById('outputPath')
    this.outputTemplate = document.getElementById('outputTemplate')
    this.customTemplate = document.getElementById('customTemplate')
    this.templateHint = document.getElementById('templateHint')
    this.customOption = document.querySelector('#outputTemplate option[value="custom"]')

    this.embedThumbnail = document.getElementById('embedThumbnail')
    this.noOverwrites = document.getElementById('noOverwrites')
    this.useCookies = document.getElementById('useCookies')
    this.cookiesInfo = document.getElementById('cookiesInfo')
    this.jsRuntime = document.getElementById('jsRuntime')
    this.playlistLimitGroup = document.getElementById('playlistLimitGroup')
    this.playlistLimit = document.getElementById('playlistLimit')
    this.playlistLimitError = document.getElementById('playlistLimit-error')

    this.preview = document.getElementById('scriptPreview')
    this.copyBtn = document.getElementById('copyBtn')
    this.resetBtn = document.getElementById('resetBtn')
    this.feedback = document.getElementById('feedback')
  }

  // ===== EVENTS =====
  bindEvents() {
    // Text/select inputs
    this.urlInput.addEventListener('input', () => this.updatePreview())
    this.videoQuality.addEventListener('change', () => this.updatePreview())
    this.videoFormat.addEventListener('change', () => {
      if (this.videoFormat.value !== 'best') {
        this.showFeedback('⚠️ A sua CPU pode ser usada para processar o vídeo', 'warning', true)
      } else {
        this._persistentMsg = null
        this._persistentType = null
        this.feedback.style.display = 'none'
      }
      this.updatePreview()
    })
    this.audioFormat.addEventListener('change', () => this.updatePreview())
    this.audioQuality.addEventListener('change', () => this.updatePreview())
    this.outputPath.addEventListener('input', () => this.updatePreview())
    this.outputTemplate.addEventListener('change', () => {
      this.toggleCustom()
      this.updatePreview()
    })
    this.customTemplate.addEventListener('input', () => this.updatePreview())

    // Checkboxes
    this.embedThumbnail.addEventListener('change', () => this.updatePreview())
    this.noOverwrites.addEventListener('change', () => this.updatePreview())
    this.jsRuntime.addEventListener('change', () => this.updatePreview())
    this.playlistLimit.addEventListener('input', () => {
      this.validatePlaylistLimit()
      this.updatePreview()
    })
    this.useCookies.addEventListener('change', () => {
      this.cookiesInfo.style.display = this.useCookies.checked ? 'block' : 'none'
      this.updatePreview()
    })

    // Buttons
    this.copyBtn.addEventListener('click', () => this.copyCommand())
    this.resetBtn.addEventListener('click', () => this.resetAll())
  }

  // ===== SEGMENT CONTROL =====
  initSegmentControl() {
    const btns = this.segmentControl.querySelectorAll('.segment-btn')
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        const radio = btn.querySelector('input[type="radio"]')
        radio.checked = true
        this.handleTypeChange()
      })
    })
  }

  // ===== DRAG & DROP =====
  initDragDrop() {
    const input = this.urlInput

    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((e) => {
      document.body.addEventListener(e, (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
      })
    })

    ;['dragenter', 'dragover'].forEach((e) => {
      input.addEventListener(e, () => input.classList.add('drop-active'))
    })

    ;['dragleave', 'drop'].forEach((e) => {
      input.addEventListener(e, () => input.classList.remove('drop-active'))
    })

    input.addEventListener('drop', (e) => {
      const text = (e.dataTransfer || e.originalEvent.dataTransfer).getData('text/plain')
      if (text) {
        input.value = text.trim()
        this.updatePreview()
        this.showFeedback('📎 Link colado via drag & drop!', 'success')
      }
    })
  }

  // ===== TYPE CHANGE =====
  handleTypeChange() {
    // Save current type settings before switching
    this.saveSettings()
    const type = this.getType()
    const isVideo = type === 'video'
    const isAudio = type === 'audio'

    this.videoQualityGroup.style.display = isVideo ? '' : 'none'
    this.videoFormatGroup.style.display = isVideo ? '' : 'none'
    this.audioFormatGroup.style.display = isAudio ? '' : 'none'
    this.audioQualityGroup.style.display = isAudio ? '' : 'none'

    this.videoQuality.disabled = !isVideo
    this.videoFormat.disabled = !isVideo
    this.audioFormat.disabled = !isAudio
    this.audioQuality.disabled = !isAudio
    this.embedThumbnail.disabled = !isAudio
    this.useCookies.checked = false
    this.cookiesInfo.style.display = 'none'

    this.loadSettings()
    this.updatePreview()
  }

  toggleCustom() {
    const isCustom = this.outputTemplate.value === 'custom'
    this.customTemplate.style.display = isCustom ? '' : 'none'
    this.templateHint.style.display = isCustom ? '' : 'none'
  }

  // ===== VALIDATE PLAYLIST LIMIT =====
  validatePlaylistLimit() {
    const val = this.playlistLimit.value.trim()
    if (!val) {
      this.playlistLimitError.style.display = 'none'
      return true
    }
    // Valid: digits, colons, commas — e.g. 1:10, 1,3,5, 5:, :10, 1:5,10,15:20
    const pattern = /^[0-9]+(:[0-9]*)?(,[0-9]+(:[0-9]*)?)*$/
    if (!pattern.test(val)) {
      this.playlistLimitError.textContent = '❌ Formato inválido. Use: 1:10, 1,3,5 ou 5:'
      this.playlistLimitError.style.display = 'block'
      return false
    }
    this.playlistLimitError.style.display = 'none'
    return true
  }

  getType() {
    return Array.from(this.downloadType).find((r) => r.checked).value
  }

  // ===== BUILD FORMAT =====
  buildFormat() {
    const type = this.getType()
    const q = this.videoQuality.value

    if (type === 'audio') return 'bestaudio/best'

    if (q === 'worst') return 'worstvideo+bestaudio/best'
    if (q !== 'best') return `bestvideo[height<=${q}]+bestaudio/best`
    return 'bestvideo*+bestaudio/best'
  }

  // ===== BUILD COMMAND =====
  buildCommand() {
    const type = this.getType()
    const val = this.normalizeUrl(this.urlInput.value)
    const url = val.url || 'https://www.youtube.com/watch?v=...'
    const args = []

    args.push(`-f "${this.buildFormat()}"`)

    if (type === 'audio') {
      args.push('-x')
      args.push(`--audio-format ${this.audioFormat.value}`)
      if (this.audioQuality.value !== '0') {
        args.push(`--audio-quality ${this.audioQuality.value}`)
      }
    } else if (this.videoFormat.value !== 'best') {
      args.push(`--recode-video ${this.videoFormat.value}`)
    }

    if (this.outputPath.value.trim()) {
      args.push(`-P "${this.outputPath.value}"`)
    }

    const tmpl =
      this.outputTemplate.value === 'custom'
        ? this.customTemplate.value || '%(title)s.%(ext)s'
        : this.outputTemplate.value
    args.push(`-o "${tmpl}"`)

    if (this.embedThumbnail.checked) args.push('--embed-thumbnail')
    if (this.noOverwrites.checked) args.push('-w')

    if (this.playlistLimit.value.trim()) {
      args.push(`-I "${this.playlistLimit.value.trim()}"`)
    }

    const rt = this.jsRuntime.value
    if (rt !== 'none') args.push(`--js-runtimes ${rt}`)
    if (this.useCookies.checked) args.push('--cookies cookie.txt')

    args.push(`"${url}"`)
    return `yt-dlp ${args.join(' ')}`
  }

  // ===== SYNTAX HIGHLIGHT =====
  renderPreview(command) {
    const parts = command.split(' ')
    const html = parts
      .map((p, i) => {
        const esc = this.esc(p)
        if (i === 0) return `<span class="syn-cmd">${esc}</span>`
        if (p.startsWith('-')) return `<span class="syn-flag">${esc}</span>`
        if (p.startsWith('"http') || p.startsWith('"INVALID'))
          return `<span class="syn-url">${esc}</span>`
        if (p.startsWith('"')) return `<span class="syn-value">${esc}</span>`
        return `<span class="syn-value">${esc}</span>`
      })
      .join(' ')

    this.preview.innerHTML = html + '<span class="cursor"></span>'
  }

  esc(s) {
    const d = document.createElement('div')
    d.appendChild(document.createTextNode(s))
    return d.innerHTML
  }

  // ===== VALIDATION =====
  isValid() {
    const v = this.urlInput.value.trim()
    if (!v) return false
    const u = this.normalizeUrl(v)
    if (!u.valid) return false
    if (!this.outputPath.value.trim()) return false
    if (this.playlistLimit.value.trim() && !this.validatePlaylistLimit()) return false
    return true
  }

  // ===== UPDATE PREVIEW =====
  updatePreview() {
    const val = this.urlInput.value.trim()
    let isPlaylist = false

    if (val) {
      const u = this.normalizeUrl(val)
      if (!u.valid) {
        this.urlError.textContent = `❌ ${u.error}`
        this.urlError.style.display = 'block'
      } else {
        this.urlError.style.display = 'none'
      }
      // Detect real playlists (PLxxx), but ignore radio/mix (RDxxx)
      const listMatch = (u.url || val).match(/[?&]list=([a-zA-Z0-9_-]+)/)
      const listId = listMatch ? listMatch[1] : null
      const isRealPlaylist = listId && !listId.startsWith('RD')

      isPlaylist =
        u.url?.includes('playlist?list=') ||
        isRealPlaylist ||
        /^PL[a-zA-Z0-9_-]+$/.test(val) ||
        val.includes('playlist?list=')
    } else {
      this.urlError.style.display = 'none'
    }

    this.playlistWarning.style.display = isPlaylist ? 'block' : 'none'
    this.playlistLimitGroup.style.display = isPlaylist ? '' : 'none'

    if (this.customOption) {
      this.customOption.disabled = isPlaylist
      if (isPlaylist && this.outputTemplate.value === 'custom') {
        this.outputTemplate.value = '%(title)s.%(ext)s'
        this.toggleCustom()
      }
    }

    const cmd = this.buildCommand()
    this.renderPreview(cmd)
    this.copyBtn.disabled = !this.isValid()

    // Persist settings on every change
    this.saveSettings()
  }

  // ===== URL NORMALIZER =====
  normalizeUrl(input) {
    if (!input || !input.trim()) return { valid: false, url: '', error: 'URL vazia' }
    input = input.trim()

    // Auto-add protocol if missing
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      if (input.startsWith('youtube.com/') || input.startsWith('youtu.be/')) {
        input = 'https://' + input
      }
    }

    if (input.startsWith('http://') || input.startsWith('https://')) {
      const c = input

      if (c.includes('playlist?list=')) {
        const m = c.match(/playlist\?list=([a-zA-Z0-9_-]+)/)
        if (m)
          return { valid: true, url: `https://www.youtube.com/playlist?list=${m[1]}`, error: '' }
      }

      const vid = c.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
      const pl = c.match(/[?&]list=([a-zA-Z0-9_-]+)/)

      // watch?v=ID&list=... — handle based on list type
      if (vid && pl) {
        const listId = pl[1]
        // RD = radio/mix (auto-generated) → treat as single video
        if (listId.startsWith('RD')) {
          return { valid: true, url: `https://www.youtube.com/watch?v=${vid[1]}`, error: '' }
        }
        // Real playlist → keep full URL so yt-dlp downloads the playlist
        return {
          valid: true,
          url: `https://www.youtube.com/watch?v=${vid[1]}&list=${listId}`,
          error: '',
        }
      }
      if (vid) return { valid: true, url: `https://www.youtube.com/watch?v=${vid[1]}`, error: '' }
      if (pl) {
        // Standalone playlist URL
        return { valid: true, url: `https://www.youtube.com/playlist?list=${pl[1]}`, error: '' }
      }

      const short = c.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
      if (short)
        return { valid: true, url: `https://www.youtube.com/watch?v=${short[1]}`, error: '' }

      const shorts = c.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/)
      if (shorts)
        return { valid: true, url: `https://www.youtube.com/watch?v=${shorts[1]}`, error: '' }

      if (c.includes('youtube.com') || c.includes('youtu.be'))
        return { valid: false, url: '', error: 'URL inválida do YouTube' }

      return { valid: false, url: '', error: 'URL não é do YouTube' }
    }

    if (/^[a-zA-Z0-9_-]{11}$/.test(input))
      return { valid: true, url: `https://www.youtube.com/watch?v=${input}`, error: '' }

    const sm = input.match(/^youtu\.be\/([a-zA-Z0-9_-]{11})$/)
    if (sm) return { valid: true, url: `https://www.youtube.com/watch?v=${sm[1]}`, error: '' }

    if (/^PL[a-zA-Z0-9_-]+$/.test(input))
      return { valid: true, url: `https://www.youtube.com/playlist?list=${input}`, error: '' }

    const wm = input.match(/^watch\?v=([a-zA-Z0-9_-]{11})$/)
    if (wm) return { valid: true, url: `https://www.youtube.com/watch?v=${wm[1]}`, error: '' }

    const pm = input.match(/^playlist\?list=([a-zA-Z0-9_-]+)$/)
    if (pm) return { valid: true, url: `https://www.youtube.com/playlist?list=${pm[1]}`, error: '' }

    return { valid: false, url: '', error: 'Formato não reconhecido' }
  }

  // ===== LOCALSTORAGE =====
  saveSettings() {
    const type = this.getType()
    localStorage.setItem(this.STORAGE_KEY_TYPE, type)
    const key = type === 'video' ? this.STORAGE_KEY_VIDEO : this.STORAGE_KEY_AUDIO
    const settings = {
      outputPath: this.outputPath.value,
      outputTemplate: this.outputTemplate.value,
      customTemplate: this.customTemplate.value,
      jsRuntime: this.jsRuntime.value,
      noOverwrites: this.noOverwrites.checked,
      useCookies: this.useCookies.checked,
      playlistLimit: this.playlistLimit.value,
    }
    if (type === 'video') {
      settings.videoQuality = this.videoQuality.value
      settings.videoFormat = this.videoFormat.value
    } else {
      settings.audioFormat = this.audioFormat.value
      settings.audioQuality = this.audioQuality.value
      settings.embedThumbnail = this.embedThumbnail.checked
    }
    localStorage.setItem(key, JSON.stringify(settings))
  }

  loadSettings() {
    const type = this.getType()
    const key = type === 'video' ? this.STORAGE_KEY_VIDEO : this.STORAGE_KEY_AUDIO
    const defaults = {
      outputPath: this.DEFAULT_PATH,
      outputTemplate: '%(title)s.%(ext)s',
      customTemplate: '',
      jsRuntime: 'node',
      noOverwrites: true,
      useCookies: false,
      playlistLimit: '',
    }
    if (type === 'video') {
      defaults.videoQuality = 'best'
      defaults.videoFormat = 'best'
    } else {
      defaults.audioFormat = 'mp3'
      defaults.audioQuality = '128'
      defaults.embedThumbnail = true
    }

    let saved = {}
    try {
      const raw = localStorage.getItem(key)
      if (raw) saved = JSON.parse(raw)
    } catch {
      /* ignore */
    }

    const s = { ...defaults, ...saved }
    this.outputPath.value = s.outputPath
    this.outputTemplate.value = s.outputTemplate
    this.customTemplate.value = s.customTemplate
    this.jsRuntime.value = s.jsRuntime
    this.noOverwrites.checked = s.noOverwrites
    this.useCookies.checked = s.useCookies
    this.cookiesInfo.style.display = s.useCookies ? 'block' : 'none'
    this.playlistLimit.value = s.playlistLimit || ''

    if (type === 'video') {
      this.videoQuality.value = s.videoQuality
      this.videoFormat.value = s.videoFormat
      this.embedThumbnail.checked = false
    } else {
      this.audioFormat.value = s.audioFormat
      this.audioQuality.value = s.audioQuality
      this.embedThumbnail.checked = true
    }

    this.toggleCustom()
  }

  // ===== LOAD TYPE =====
  loadType() {
    const saved = localStorage.getItem(this.STORAGE_KEY_TYPE)
    if (saved === 'audio') {
      document.querySelector('input[name="downloadType"][value="audio"]').checked = true
      this.segmentControl.querySelectorAll('.segment-btn').forEach((b) => {
        b.classList.toggle('active', b.dataset.value === 'audio')
      })
    }
  }

  // ===== COPY =====
  copyCommand() {
    if (!this.isValid()) {
      this.showFeedback('❌ Preencha a URL do vídeo!', 'error')
      return
    }

    const text = this.preview.textContent

    const onSuccess = () => {
      this.copyBtn.classList.add('copied')
      const orig = this.copyBtn.innerHTML
      this.copyBtn.innerHTML = '✅ Copiado!'
      setTimeout(() => {
        this.copyBtn.classList.remove('copied')
        this.copyBtn.innerHTML = orig
      }, 2000)
      this.showFeedback('✅ Comando copiado!', 'success')
    }

    navigator.clipboard
      .writeText(text)
      .then(onSuccess)
      .catch(() => {
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        onSuccess()
      })
  }

  // ===== RESET =====
  resetAll() {
    this.urlInput.value = ''
    localStorage.removeItem(this.STORAGE_KEY_VIDEO)
    localStorage.removeItem(this.STORAGE_KEY_AUDIO)
    localStorage.removeItem(this.STORAGE_KEY_TYPE)

    document.querySelector('input[name="downloadType"][value="video"]').checked = true
    this.segmentControl.querySelectorAll('.segment-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.value === 'video')
    })

    this.videoQuality.value = 'best'
    this.videoFormat.value = 'best'
    this.audioFormat.value = 'mp3'
    this.audioQuality.value = '128'
    this.outputPath.value = this.DEFAULT_PATH
    this.outputTemplate.value = '%(title)s.%(ext)s'
    this.customTemplate.value = ''

    this.embedThumbnail.checked = false
    this.noOverwrites.checked = true
    this.useCookies.checked = false
    this.cookiesInfo.style.display = 'none'
    this.jsRuntime.value = 'node'
    this.playlistLimit.value = ''

    this._persistentMsg = null
    this._persistentType = null

    this.toggleCustom()
    this.updatePreview()
    this.showFeedback('🔄 Formulário resetado!', 'success')
  }

  // ===== FEEDBACK =====
  showFeedback(msg, type, persistent = false) {
    this.feedback.textContent = msg
    this.feedback.className = `feedback ${type}`
    this.feedback.style.display = 'block'

    if (persistent) {
      this._persistentMsg = msg
      this._persistentType = type
    } else {
      const hadPersistent = this._persistentMsg !== null
      setTimeout(() => {
        if (hadPersistent) {
          this.feedback.textContent = this._persistentMsg
          this.feedback.className = `feedback ${this._persistentType}`
          this.feedback.style.display = 'block'
        } else {
          this.feedback.style.display = 'none'
        }
      }, 3000)
    }
  }
}
