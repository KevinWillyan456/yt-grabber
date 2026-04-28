# 🎬 YT Grabber

> **Construtor Visual de Comandos para yt-dlp**

Um gerador interativo e intuitivo de comandos `yt-dlp` para download e conversão de vídeos do YouTube, sem precisar decorar sintaxe complexa!

---

## ✨ Características

- 📹 **Download de Vídeos** - Selecione qualidade e formato
- 🎵 **Extração de Áudio** - Converta vídeos em MP3, M4A, OPUS e mais
- 🔄 **Conversão de Formatos** - Converta entre MP4, WebM, MKV, AVI, FLV
- 📷 **Gerenciamento de Thumbnails** - Baixe e embuta capas de vídeo
- 📝 **Metadados** - Salve informações JSON do vídeo
- ⚡ **Preview em Tempo Real** - Veja o comando enquanto configura
- 🎯 **Validação Inteligente** - Detecta e valida URLs automaticamente
- 📋 **Copiar com Um Clique** - Copie o comando direto para o clipboard

---

## 🚀 Começando

### Dependências Obrigatórias

Antes de usar o YT Grabber, você precisa instalar:

#### 1️⃣ **yt-dlp**

O coração da ferramenta - faz o download real dos vídeos.

**Windows:**
Siga as instruções no [GitHub do yt-dlp](https://github.com/yt-dlp/yt-dlp#installation).

**Linux/macOS:**

```bash
pip install yt-dlp
```

**Ou via Homebrew (macOS):**

```bash
brew install yt-dlp
```

#### 2️⃣ **FFmpeg**

Necessário para conversão de formatos e extração de áudio.

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get install ffmpeg
```

**macOS:**

```bash
brew install ffmpeg
```

**Windows:**
Baixe do [site oficial](https://ffmpeg.org/download.html) e adicione ao PATH.

#### ⚠️ **Adicionar ao PATH**

Após instalar, você **DEVE** adicionar ambos os programas ao PATH do seu sistema para acessá-los pelo terminal:

**Windows:**

1. Abra "Variáveis de Ambiente"
2. Vá em "Editar as variáveis de ambiente do sistema"
3. Clique em "Variáveis de Ambiente"
4. Edite a variável `Path` e adicione os caminhos de instalação

**macOS/Linux:**
Geralmente já vem no PATH após instalar via package manager.

---

## 📖 Como Usar

1. **Abra `index.html`** em seu navegador
2. **Cole a URL** do vídeo do YouTube (aceita múltiplos formatos)
3. **Escolha o tipo** de download (vídeo ou áudio)
4. **Configure as opções** desejadas (qualidade, formato, etc.)
5. **Clique em "Copiar"** para copiar o comando
6. **Cole no terminal** e execute

### Formatos de URL Aceitos

- ✅ `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- ✅ `https://youtu.be/dQw4w9WgXcQ`
- ✅ `dQw4w9WgXcQ` (apenas o ID)
- ✅ `https://www.youtube.com/playlist?list=PLxxxx`
- ✅ `PLxxxx` (apenas o ID da playlist)

### 📋 Opções Disponíveis

| Opção                  | Descrição                                  |
| ---------------------- | ------------------------------------------ |
| 📹 Tipo de Download    | Escolha entre Vídeo ou Áudio               |
| 🎬 Qualidade de Vídeo  | Melhor, 1080p, 720p, 480p, 360p, Pior      |
| 🎞️ Formato de Vídeo    | MP4, WebM, MKV, AVI, FLV                   |
| 🎵 Formato de Áudio    | MP3, M4A, OPUS, Vorbis, WAV, AAC           |
| 📊 Qualidade de Áudio  | 0 (VBR), 128, 192, 256, 320 kbps           |
| 💾 Local de Salvamento | Personalize onde os arquivos serão salvos  |
| 📝 Nome do Arquivo     | Use variáveis: `%(title)s`, `%(id)s`, etc. |
| 📷 Incluir Thumbnail   | Baixe a capa do vídeo                      |
| 🖼️ Embutir Thumbnail   | Adicione a capa ao arquivo de áudio        |
| 📄 Metadados JSON      | Salve informações do vídeo                 |
| 🔒 Não Sobrescrever    | Proteja arquivos existentes                |

---

## 💡 Dicas

### Para Playlists

⚠️ **Importante:** A playlist deve estar como **PÚBLICA** ou **NÃO LISTADA** para ser acessada pelo yt-dlp.

### Variáveis de Nome de Arquivo

Use no campo "Nome do Arquivo":

- `%(title)s` - Título do vídeo
- `%(id)s` - ID do vídeo
- `%(ext)s` - Extensão do arquivo
- `%(uploader)s` - Nome do uploader
- `%(upload_date)s` - Data de upload

---

## 🎯 Exemplos de Comandos Gerados

### Exemplo 1: Download de vídeo em 720p

```bash
yt-dlp -f "bestvideo[height<=720]+bestaudio/best" --recode-video mp4 -P "%USERPROFILE%\Downloads\yt-grabber\videos" -o "%(title)s.%(ext)s" "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Exemplo 2: Extrair áudio em MP3 320kbps

```bash
yt-dlp -f "bestaudio/best" -x --audio-format mp3 --audio-quality 320 -P "%USERPROFILE%\Downloads\yt-grabber\audios" -o "%(title)s.%(ext)s" "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

---

## 🖥️ Requisitos

- **Navegador Moderno**: Chrome, Firefox, Safari, Edge
- **yt-dlp**: Instalado e no PATH
- **FFmpeg**: Instalado e no PATH (para conversão de áudio/vídeo)

---

## 📝 Notas Importantes

- ⚠️ Respeite os direitos autorais ao baixar conteúdo
- ⚠️ Verifique se está autorizado a baixar o conteúdo
- ⚠️ O YT Grabber é apenas uma interface para yt-dlp
- ⚠️ yt-dlp pode não funcionar se o YouTube bloquear sua conexão

---

## 🔗 Links Úteis

- 🌐 [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- 🌐 [FFmpeg Official](https://ffmpeg.org)
- 📚 [yt-dlp Documentação](https://github.com/yt-dlp/yt-dlp#readme)

---

## 📄 Licença

Este projeto é de código aberto e livre para uso pessoal.

---

> Desenvolvido com ❤️ para facilitar downloads do YouTube
