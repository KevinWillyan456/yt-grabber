// ===== YT-DLP Script Builder =====
// Gera comando yt-dlp dinamicamente baseado em inputs do usuário

// ===== YEAR INJECTOR =====
// Atualiza o ano automaticamente no footer
document.addEventListener('DOMContentLoaded', () => {
  const currentYearElement = document.getElementById('current-year')
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }
})

class ScriptBuilder {
  constructor() {
    this.initElements()
    this.attachEventListeners()
    this.handleTypeChange()
    this.updatePreview()
  }

  initElements() {
    // Inputs
    this.urlInput = document.getElementById('url')
    this.downloadType = document.getElementsByName('downloadType')
    this.videoQuality = document.getElementById('videoQuality')
    this.videoFormat = document.getElementById('videoFormat')
    this.audioFormat = document.getElementById('audioFormat')
    this.audioQuality = document.getElementById('audioQuality')
    this.outputPath = document.getElementById('outputPath')
    this.outputTemplate = document.getElementById('outputTemplate')
    this.customTemplate = document.getElementById('customTemplate')
    this.templateHint = document.getElementById('templateHint')
    this.customTemplateOption = document.querySelector('#outputTemplate option[value="custom"]')

    // Checkboxes
    this.embedThumbnail = document.getElementById('embedThumbnail')
    this.noOverwrites = document.getElementById('noOverwrites')
    this.useCookies = document.getElementById('useCookies')

    // Info boxes
    this.cookiesInfo = document.getElementById('cookiesInfo')

    // Select
    this.jsRuntime = document.getElementById('jsRuntime')

    // Groups
    this.videoQualityGroup = document.getElementById('videoQualityGroup')
    this.videoFormatGroup = document.getElementById('videoFormatGroup')
    this.audioFormatGroup = document.getElementById('audioFormatGroup')
    this.audioQualityGroup = document.getElementById('audioQualityGroup')

    // Output
    this.scriptPreview = document.getElementById('scriptPreview')
    this.copyBtn = document.getElementById('copyBtn')
    this.resetBtn = document.getElementById('resetBtn')
    this.feedback = document.getElementById('feedback')
    this.urlError = document.getElementById('url-error')
    this.playlistWarning = document.getElementById('playlist-warning')
    this.persistentMessage = null
    this.persistentType = null
  }

  attachEventListeners() {
    // Update preview on any change
    this.urlInput.addEventListener('input', () => this.updatePreview())
    this.videoQuality.addEventListener('change', () => this.updatePreview())
    this.audioFormat.addEventListener('change', () => this.updatePreview())
    this.audioQuality.addEventListener('change', () => this.updatePreview())
    this.outputPath.addEventListener('input', () => this.updatePreview())
    this.outputTemplate.addEventListener('change', () => {
      this.toggleCustomTemplate()
      this.updatePreview()
    })
    this.customTemplate.addEventListener('input', () => this.updatePreview())
    this.embedThumbnail.addEventListener('change', () => this.updatePreview())
    this.noOverwrites.addEventListener('change', () => this.updatePreview())
    this.jsRuntime.addEventListener('change', () => this.updatePreview())
    this.useCookies.addEventListener('change', () => {
      this.cookiesInfo.style.display = this.useCookies.checked ? 'block' : 'none'
      this.updatePreview()
    })

    // Download type changes
    this.downloadType.forEach((radio) => {
      radio.addEventListener('change', () => this.handleTypeChange())
    })

    // Video format selection - aviso sobre CPU
    this.videoFormat.addEventListener('change', () => {
      if (this.videoFormat.value !== 'best') {
        this.showFeedback('⚠️ A sua CPU pode ser usada para processar o vídeo', 'warning', true)
      } else {
        this.persistentMessage = null
        this.persistentType = null
        this.feedback.style.display = 'none'
      }
      this.updatePreview()
    })

    // Buttons
    this.copyBtn.addEventListener('click', () => this.copyToClipboard())
    this.resetBtn.addEventListener('click', () => this.resetForm())
  }

  handleTypeChange() {
    const type = Array.from(this.downloadType).find((r) => r.checked).value

    // Mostrar/esconder grupos baseado no tipo
    const isVideo = type === 'video'
    const isAudio = type === 'audio'

    this.videoQualityGroup.style.display = isVideo ? 'block' : 'none'
    this.videoFormatGroup.style.display = isVideo ? 'block' : 'none'
    this.audioFormatGroup.style.display = isAudio ? 'block' : 'none'
    this.audioQualityGroup.style.display = isAudio ? 'block' : 'none'

    // Desabilitar/habilitar campos
    this.videoQuality.disabled = !isVideo
    this.videoFormat.disabled = !isVideo
    this.audioFormat.disabled = !isAudio
    this.audioQuality.disabled = !isAudio
    this.embedThumbnail.disabled = !isAudio

    // Pré-marcar embedThumbnail para áudio
    if (isAudio) {
      this.embedThumbnail.checked = true
    } else {
      this.embedThumbnail.checked = false
    }

    // Desmarcar cookies ao mudar tipo (por segurança)
    this.useCookies.checked = false
    this.cookiesInfo.style.display = 'none'

    // Atualizar outputPath baseado no tipo
    const baseFolder = '%USERPROFILE%\\Downloads\\yt-grabber'
    const folder = isVideo ? `${baseFolder}\\videos` : `${baseFolder}\\audios`
    this.outputPath.value = folder

    this.updatePreview()
  }

  toggleCustomTemplate() {
    const isCustom = this.outputTemplate.value === 'custom'
    this.customTemplate.style.display = isCustom ? 'block' : 'none'
    this.templateHint.style.display = isCustom ? 'block' : 'none'
  }

  getDownloadType() {
    return Array.from(this.downloadType).find((r) => r.checked).value
  }

  buildFormatString() {
    const type = this.getDownloadType()
    const videoQuality = this.videoQuality.value

    if (type === 'audio') {
      // Áudio puro - deixa o yt-dlp escolher o melhor
      return 'bestaudio/best'
    }

    if (type === 'video') {
      // Vídeo com qualidade específica
      if (videoQuality !== 'best' && videoQuality !== 'worst') {
        // Se altura específica (1080, 720, etc)
        return `bestvideo[height<=${videoQuality}]+bestaudio/best`
      } else if (videoQuality === 'worst') {
        return 'worstvideo+bestaudio/best'
      }
      // Melhor disponível
      return 'bestvideo*+bestaudio/best'
    }

    return 'bestvideo*+bestaudio/best'
  }

  buildCommandArray() {
    const type = this.getDownloadType()
    const urlValidation = this.normalizeYouTubeUrl(this.urlInput.value)
    const url = urlValidation.url || 'URL_INVALIDA'
    const commands = []

    // Formato
    const formatStr = this.buildFormatString()
    commands.push(`-f "${formatStr}"`)

    // Extração de áudio
    if (type === 'audio') {
      commands.push('-x')
      commands.push(`--audio-format ${this.audioFormat.value}`)

      if (this.audioQuality.value !== '0') {
        commands.push(`--audio-quality ${this.audioQuality.value}`)
      }
    } else if (type === 'video') {
      // Recode de formato de vídeo
      if (this.videoFormat.value !== 'best') {
        commands.push(`--recode-video ${this.videoFormat.value}`)
      }
    }

    // Output path
    if (this.outputPath.value && this.outputPath.value.trim()) {
      commands.push(`-P "${this.outputPath.value}"`)
    }

    // Output template
    const template =
      this.outputTemplate.value === 'custom'
        ? this.customTemplate.value || '%(title)s.%(ext)s'
        : this.outputTemplate.value
    commands.push(`-o "${template}"`)

    // Opções adicionais
    if (this.embedThumbnail.checked) {
      commands.push('--embed-thumbnail')
    }

    if (this.noOverwrites.checked) {
      commands.push('-w')
    }

    // JavaScript Runtime
    const runtime = this.jsRuntime.value
    if (runtime !== 'none') {
      commands.push(`--js-runtimes ${runtime}`)
    }

    // Cookies
    if (this.useCookies.checked) {
      commands.push('--cookies cookie.txt')
    }

    // URL (sempre por último)
    commands.push(`"${url}"`)

    return commands
  }

  buildCommand() {
    // Para preview: comando em linha única (funciona no PowerShell)
    const commands = this.buildCommandArray()
    return `yt-dlp ${commands.join(' ')}`
  }

  normalizeYouTubeUrl(input) {
    if (!input || !input.trim()) {
      return { valid: false, url: '', error: 'URL vazia' }
    }

    input = input.trim()

    // Valida e normaliza URL completa HTTP(S)
    if (input.startsWith('http://') || input.startsWith('https://')) {
      // Remove parâmetros extras de playlist (como &si=...)
      let cleaned = input

      // Se é URL de playlist, remove tudo após &
      if (cleaned.includes('playlist?list=')) {
        const playlistMatch = cleaned.match(/playlist\?list=([a-zA-Z0-9_-]+)/)
        if (playlistMatch) {
          return {
            valid: true,
            url: `https://www.youtube.com/playlist?list=${playlistMatch[1]}`,
            error: '',
          }
        }
      }

      // Se é URL de vídeo com playlist, pega só o vídeo
      const videoIdMatch = cleaned.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
      const playlistMatch = cleaned.match(/[?&]list=([a-zA-Z0-9_-]+)/)

      if (videoIdMatch && playlistMatch) {
        return {
          valid: true,
          url: `https://www.youtube.com/watch?v=${videoIdMatch[1]}`,
          error: '',
        }
      }

      // Se é apenas vídeo
      if (videoIdMatch) {
        return {
          valid: true,
          url: `https://www.youtube.com/watch?v=${videoIdMatch[1]}`,
          error: '',
        }
      }

      // Se é apenas playlist (sem parâmetros extras)
      if (playlistMatch) {
        return {
          valid: true,
          url: `https://www.youtube.com/playlist?list=${playlistMatch[1]}`,
          error: '',
        }
      }

      // Se é URL curta youtu.be/ID (com ou sem parâmetros como ?si=...)
      const shortUrlMatch = cleaned.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
      if (shortUrlMatch) {
        return {
          valid: true,
          url: `https://www.youtube.com/watch?v=${shortUrlMatch[1]}`,
          error: '',
        }
      }

      // Se é URL de YouTube Shorts (com ou sem parâmetros)
      const shortsMatch = cleaned.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/)
      if (shortsMatch) {
        return {
          valid: true,
          url: `https://www.youtube.com/watch?v=${shortsMatch[1]}`,
          error: '',
        }
      }

      // URL inválida
      if (cleaned.includes('youtube.com') || cleaned.includes('youtu.be')) {
        return { valid: false, url: '', error: 'URL inválida do YouTube' }
      }

      return { valid: false, url: '', error: 'URL não é do YouTube' }
    }

    // Detecta ID puro de vídeo (exatamente 11 caracteres)
    const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
    if (videoIdPattern.test(input)) {
      return {
        valid: true,
        url: `https://www.youtube.com/watch?v=${input}`,
        error: '',
      }
    }

    // Detecta youtu.be/ID
    const shortUrlPattern = /^youtu\.be\/([a-zA-Z0-9_-]{11})$/
    const shortMatch = input.match(shortUrlPattern)
    if (shortMatch) {
      return {
        valid: true,
        url: `https://www.youtube.com/watch?v=${shortMatch[1]}`,
        error: '',
      }
    }

    // Detecta playlist ID (PLxxxx...)
    const playlistIdPattern = /^(PL[a-zA-Z0-9_-]+)$/
    if (playlistIdPattern.test(input)) {
      return {
        valid: true,
        url: `https://www.youtube.com/playlist?list=${input}`,
        error: '',
      }
    }

    // Detecta watch?v=ID (sem protocolo)
    const watchPattern = /^watch\?v=([a-zA-Z0-9_-]{11})$/
    if (watchPattern.test(input)) {
      const match = input.match(watchPattern)
      return {
        valid: true,
        url: `https://www.youtube.com/watch?v=${match[1]}`,
        error: '',
      }
    }

    // Detecta playlist?list= (sem protocolo)
    const playlistPattern = /^playlist\?list=([a-zA-Z0-9_-]+)$/
    if (playlistPattern.test(input)) {
      const match = input.match(playlistPattern)
      return {
        valid: true,
        url: `https://www.youtube.com/playlist?list=${match[1]}`,
        error: '',
      }
    }

    // Se não reconhecer
    return { valid: false, url: '', error: 'Formato não reconhecido' }
  }

  isValid() {
    // Valida se URL não está vazia
    const urlValue = this.urlInput.value.trim()
    if (!urlValue) {
      return false
    }

    // Valida formato da URL
    const urlValidation = this.normalizeYouTubeUrl(urlValue)
    if (!urlValidation.valid) {
      return false
    }

    // Valida output path não vazio
    const outputPath = this.outputPath.value.trim()
    if (!outputPath) {
      return false
    }

    return true
  }

  updatePreview() {
    // Validar URL e mostrar erros
    const urlValue = this.urlInput.value.trim()
    let isPlaylist = false

    if (urlValue) {
      const urlValidation = this.normalizeYouTubeUrl(urlValue)
      if (!urlValidation.valid) {
        this.urlError.textContent = `❌ ${urlValidation.error}`
        this.urlError.style.display = 'block'
      } else {
        this.urlError.style.display = 'none'
      }

      // Detecta se é uma playlist
      isPlaylist =
        urlValidation.url.includes('playlist?list=') ||
        urlValue.match(/^PL[a-zA-Z0-9_-]+$/) ||
        urlValue.includes('playlist?list=')
    } else {
      this.urlError.style.display = 'none'
    }

    // Mostrar/esconder aviso de playlist
    this.playlistWarning.style.display = isPlaylist ? 'block' : 'none'

    // Gerenciar opção 'custom' do template em playlists
    if (this.customTemplateOption) {
      if (isPlaylist) {
        // Desabilitar opção custom para playlist
        this.customTemplateOption.disabled = true
        // Se estava com custom selecionado, resetar para padrão
        if (this.outputTemplate.value === 'custom') {
          this.outputTemplate.value = '%(title)s.%(ext)s'
          this.toggleCustomTemplate()
        }
      } else {
        // Habilitar opção custom para vídeo único
        this.customTemplateOption.disabled = false
      }
    }

    const script = this.buildCommand()
    this.scriptPreview.textContent = script

    // Atualizar estado dos botões
    const isValid = this.isValid()
    this.copyBtn.disabled = !isValid
  }

  resetForm() {
    // Resetar inputs de texto
    this.urlInput.value = ''
    this.outputPath.value = '%USERPROFILE%\\Downloads\\yt-grabber\\videos'

    // Resetar radio buttons (video padrão)
    document.querySelector('input[name="downloadType"][value="video"]').checked = true

    // Resetar selects
    this.videoQuality.value = 'best'
    this.videoFormat.value = 'best'
    this.audioFormat.value = 'mp3'
    this.audioQuality.value = '128'
    this.outputTemplate.value = '%(title)s.%(ext)s'
    this.customTemplate.value = ''

    // Resetar checkboxes
    this.embedThumbnail.checked = false
    this.noOverwrites.checked = true
    this.useCookies.checked = false
    this.cookiesInfo.style.display = 'none'

    // Limpar mensagem persistente de CPU
    this.persistentMessage = null
    this.persistentType = null

    // Atualizar visualização
    this.toggleCustomTemplate()
    this.handleTypeChange()
    this.showFeedback('🔄 Formulário redefinido!', 'success')
  }

  copyToClipboard() {
    if (!this.isValid()) {
      this.showFeedback('❌ Preencha a URL do vídeo e o caminho de saída!', 'error')
      return
    }

    const script = this.scriptPreview.textContent

    navigator.clipboard
      .writeText(script)
      .then(() => {
        this.showFeedback('✅ Script copiado para clipboard!', 'success')
      })
      .catch(() => {
        // Fallback para navegadores antigos
        const textarea = document.createElement('textarea')
        textarea.value = script
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        this.showFeedback('✅ Script copiado para clipboard!', 'success')
      })
  }

  showFeedback(message, type, persistent = false) {
    this.feedback.textContent = message
    this.feedback.className = `feedback ${type}`
    this.feedback.style.display = 'block'

    if (persistent) {
      // Guardar mensagem persistente para restaurar depois
      this.persistentMessage = message
      this.persistentType = type
    } else {
      // Se há mensagem persistente, restaurá-la depois
      const hadPersistent = this.persistentMessage !== null
      setTimeout(() => {
        if (hadPersistent) {
          this.feedback.textContent = this.persistentMessage
          this.feedback.className = `feedback ${this.persistentType}`
          this.feedback.style.display = 'block'
        } else {
          this.feedback.style.display = 'none'
        }
      }, 3000)
    }
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new ScriptBuilder()
})
