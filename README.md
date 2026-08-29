<div align="center">

# 🎬 YT Grabber

**Construtor Visual de Comandos para yt-dlp**

[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26?logo=html5&style=for-the-badge)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-%231572B6?logo=css3&style=for-the-badge)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-%23F7DF1E?logo=javascript&style=for-the-badge)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Prettier](https://img.shields.io/badge/Prettier-Formatado-%23F7B93E?logo=prettier&style=for-the-badge)](https://prettier.io)

<hr />

**Interface web para montar comandos `yt-dlp` de forma visual e intuitiva.** Configure, copie e cole no terminal. Sem precisar decorar sintaxe.

</div>

---

## ✨ Funcionalidades

<details open>
<summary><strong>📋 Recursos Principais</strong></summary>
<br />

| Recurso                      | Descrição                                                          |
| :--------------------------- | :----------------------------------------------------------------- |
| **📹 Download de Vídeo**     | Selecione qualidade (1080p, 720p, etc.) e formato (MP4, WebM, MKV) |
| **🎵 Extração de Áudio**     | Converta para MP3, M4A, Opus, Vorbis, WAV, AAC                     |
| **🔄 Conversão de Formato**  | Re-encode com `--recode-video` via FFmpeg                          |
| **📷 Embutir Thumbnail**     | Adicione a capa do vídeo ao arquivo final                          |
| **⚙️ JS Runtime**            | Suporte a Node.js, Deno, Bun e QuickJS                             |
| **🍪 Autenticação**          | Cookies para vídeos com restrição de idade                         |
| **⚡ Preview em Tempo Real** | Syntax highlighting no terminal estilo VS Code                     |
| **💾 Persistência**          | Configurações salvas no localStorage (vídeo/áudio separados)       |
| **📎 Drag & Drop**           | Arraste links diretamente para o campo de URL                      |
| **🎯 Intervalo de Playlist** | Baixe apenas faixas específicas: `1:10`, `1,3,5`, `5:` etc.        |
| **🔄 Resetar**               | Limpa formulário e configurações salvas com um clique              |

</details>

---

## 🚀 Pré-requisitos

<details open>
<summary><strong>📦 Dependências Obrigatórias</strong></summary>
<br />

### 1. yt-dlp

O motor de download. Siga as instruções de instalação oficial:

- **Windows:** [GitHub — yt-dlp](https://github.com/yt-dlp/yt-dlp#windows)
- **macOS / Linux:** [GitHub — yt-dlp](https://github.com/yt-dlp/yt-dlp#installation)

### 2. FFmpeg

Necessário para conversão de formatos e extração de áudio.

**Windows:**
Baixe em [ffmpeg.org](https://ffmpeg.org/download.html) e adicione ao PATH.

**macOS:**

```bash
brew install ffmpeg
```

**Linux:**

```bash
sudo apt install ffmpeg
```

### 3. JavaScript Runtime (recomendado)

O YouTube usa desafios JS para proteger vídeos. Sem um runtime, downloads podem falhar com erro **403 Forbidden**.

**Node.js** (recomendado — já vem com a maioria dos setups):
Baixe em [nodejs.org](https://nodejs.org)

**Deno** (alternativa):

```powershell
irm https://deno.land/install.ps1 | iex
```

> ⚠️ Após instalar, reinicie o terminal e selecione o runtime no formulário.

</details>

---

## 📖 Como Usar

<details open>
<summary><strong>🎯 Passo a Passo</strong></summary>
<br />

1. Abra `index.html` no navegador
2. Cole a URL do vídeo no campo de entrada
3. Escolha o tipo de download (vídeo ou áudio)
4. Configure qualidade, formato e opções
5. Clique em **📋 Copiar Comando**
6. Cole no terminal e execute

</details>

---

## 🔗 Formatos de URL Aceitos

| Formato       | Exemplo                            | Descrição                   |
| :------------ | :--------------------------------- | :-------------------------- |
| URL completa  | `youtube.com/watch?v=dQw4w9WgXcQ`  | Formato padrão              |
| URL curta     | `youtu.be/dQw4w9WgXcQ`             | Encurtada                   |
| ID puro       | `dQw4w9WgXcQ`                      | Apenas o ID (11 caracteres) |
| Playlist      | `youtube.com/playlist?list=PLxxxx` | Playlist completa           |
| Playlist ID   | `PLxxxx`                           | Apenas o ID da playlist     |
| Shorts        | `youtube.com/shorts/ID`            | Vídeos curtos               |
| Mix/Rádio     | `watch?v=ID&list=RDxxxx`           | Tratado como vídeo único    |
| Sem protocolo | `youtube.com/watch?v=ID`           | Auto-detecta `https://`     |

---

## 📋 Opções Disponíveis

<details open>
<summary><strong>📹 Modo Vídeo</strong></summary>
<br />

| Opção     | Valores                               | Flag                                          |
| :-------- | :------------------------------------ | :-------------------------------------------- |
| Qualidade | Melhor, 1080p, 720p, 480p, 360p, Pior | `-f "bestvideo[height<=QUAL]+bestaudio/best"` |
| Formato   | Original, MP4, WebM, MKV, AVI, FLV    | `--recode-video FORMATO`                      |

</details>

<details open>
<summary><strong>🎵 Modo Áudio</strong></summary>
<br />

| Opção             | Valores                               | Flag                     |
| :---------------- | :------------------------------------ | :----------------------- |
| Formato           | MP3, M4A, Opus, Vorbis, WAV, AAC      | `--audio-format FORMATO` |
| Bitrate           | VBR (melhor), 128, 192, 256, 320 kbps | `--audio-quality VALOR`  |
| Embutir Thumbnail | Sempre ativo                          | `--embed-thumbnail`      |

</details>

<details open>
<summary><strong>⚙️ Geral</strong></summary>
<br />

| Opção               | Padrão                   | Flag                    |
| :------------------ | :----------------------- | :---------------------- |
| Local de salvamento | `~\Downloads\yt-grabber` | `-P "CAMINHO"`          |
| Template do nome    | `%(title)s.%(ext)s`      | `-o "TEMPLATE"`         |
| Não sobrescrever    | Ativado                  | `-w`                    |
| JS Runtime          | Node.js                  | `--js-runtimes RUNTIME` |
| Cookies             | Desativado               | `--cookies cookie.txt`  |
| Intervalo Playlist  | Vazio (todas)            | `-I "INTERVALO"`        |

</details>

---

## 🎯 Exemplos de Comando

<details>
<summary><strong>📹 Vídeo em 720p</strong></summary>
<br />

```bash
yt-dlp -f "bestvideo[height<=720]+bestaudio/best" -P "~\Downloads\yt-grabber" -o "%(title)s.%(ext)s" -w --js-runtimes node "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

</details>

<details>
<summary><strong>🎵 Áudio em MP3 320kbps</strong></summary>
<br />

```bash
yt-dlp -f "bestaudio/best" -x --audio-format mp3 --audio-quality 320 -P "~\Downloads\yt-grabber" -o "%(title)s.%(ext)s" --embed-thumbnail -w --js-runtimes node "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

</details>

<details>
<summary><strong>🍪 Com cookies (vídeo restrito)</strong></summary>
<br />

```bash
yt-dlp -f "bestvideo*+bestaudio/best" -P "~\Downloads\yt-grabber" -o "%(title)s.%(ext)s" -w --js-runtimes node --cookies cookie.txt "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

</details>

<details>
<summary><strong>🎯 Playlist — baixar faixas específicas</strong></summary>
<br />

O campo **Intervalo de Playlist** aceita diversos formatos para selecionar quais itens baixar:

| Formato      | Exemplo  | Descrição                       |
| :----------- | :------- | :------------------------------ |
| `inicio:fim` | `1:10`   | Itens do 1 ao 10                |
| `inicio:`    | `5:`     | A partir do 5° item até o final |
| `:fim`       | `:10`    | Os 10 primeiros itens           |
| Lista        | `1,3,5`  | Itens específicos por posição   |
| Misto        | `1:5,10` | Itens 1 a 5 e o 10              |

**Exemplo — baixar as 10 primeiras músicas de uma playlist:**

```bash
yt-dlp -f "bestaudio/best" -x --audio-format mp3 --audio-quality 320 -P "~\Downloads\yt-grabber" -o "%(title)s.%(ext)s" --embed-thumbnail -w --js-runtimes node -I "1:10" "https://www.youtube.com/playlist?list=PLxxxx"
```

**Exemplo — baixar músicas específicas (1, 3 e 5):**

```bash
yt-dlp -f "bestaudio/best" -x --audio-format mp3 --audio-quality 192 -P "~\Downloads\yt-grabber" -o "%(title)s.%(ext)s" --embed-thumbnail -w --js-runtimes node -I "1,3,5" "https://www.youtube.com/playlist?list=PLxxxx"
```

**Exemplo — baixar a partir do 5° item:**

```bash
yt-dlp -f "bestaudio/best" -x --audio-format mp3 --audio-quality 128 -P "~\Downloads\yt-grabber" -o "%(title)s.%(ext)s" --embed-thumbnail -w --js-runtimes node -I "5:" "https://www.youtube.com/playlist?list=PLxxxx"
```

</details>

---

## 🛡️ Solução de Problemas

<details>
<summary><strong>❌ Erro 403 Forbidden</strong></summary>
<br />

Causado pela falta de JavaScript runtime ou autenticação.

**Passo 1:** Verifique se tem um runtime selecionado — Node.js é o mais comum.

**Passo 2:** Se persistir, ative a opção **🍪 Cookies** e siga o passo a passo:

1. Instale a extensão [Get cookies.txt LOCALLY](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
2. Faça login no YouTube
3. Exporte os cookies e salve como `cookie.txt`
4. Execute o comando gerado na mesma pasta do arquivo

</details>

<details>
<summary><strong>❌ Vídeo não baixa</strong></summary>
<br />

- Verifique se o yt-dlp e ffmpeg estão no PATH
- Teste no terminal: `yt-dlp --version`
- Teste com outro vídeo para isolar o problema
- Verifique se o vídeo não está restrito por idade

</details>

<details>
<summary><strong>⚠️ Aviso: No supported JavaScript runtime</strong></summary>
<br />

O yt-dlp precisa de um runtime JS para resolver desafios do YouTube.

- **Node.js**: [nodejs.org](https://nodejs.org)
- **Deno**: `irm https://deno.land/install.ps1 | iex`

Reinicie o terminal após instalar.

</details>

---

## 🖥️ Requisitos

| Requisito | Versão                        | Obrigatório      |
| :-------- | :---------------------------- | :--------------- |
| Navegador | Chrome, Firefox, Safari, Edge | ✅               |
| yt-dlp    | Última versão                 | ✅               |
| FFmpeg    | Última versão                 | ✅ (conversão)   |
| Node.js   | Última versão                 | ⚠️ (recomendado) |

---

## 📁 Estrutura do Projeto

```plaintext
yt-grabber/
├── index.html          # 📄 Página principal
├── src/
│   ├── style.css       # 🎨 Estilos (Glassmorphism Neon)
│   └── script.js       # ⚙️ Lógica do builder
├── favicon.png         # 🖼️ Ícone
├── package.json        # 📦 Configuração do projeto
├── pnpm-lock.yaml      # 📦 Lock de dependências
├── .prettierrc         # ✨ Configuração do Prettier
├── .prettierignore     # 🚫 Arquivos ignorados pelo Prettier
├── LICENSE             # 📄 Licença MIT
└── README.md           # 📖 Este arquivo
```

---

## 🔧 Desenvolvimento

### Comandos

```bash
# Formatar código
pnpm format

# Verificar formatação
pnpm format:check

# Ou diretamente
pnpm dlx prettier . --write
pnpm dlx prettier . --check
```

### Tech Stack

| Camada            | Tecnologia         | Propósito                                 |
| :---------------- | :----------------- | :---------------------------------------- |
| 📄 **Estrutura**  | HTML5              | Semântica e acessibilidade                |
| 🎨 **Estilo**     | CSS3               | Glassmorphism Neon, animações, responsivo |
| ⚙️ **Lógica**     | JavaScript vanilla | Builder, validação, localStorage          |
| ✨ **Formatação** | Prettier           | Código consistente                        |

---

## 📄 Licença

[MIT](LICENSE) © 2026 Kevin Souza

---

<div align="center">

### 💙 Feito com dedicação para facilitar downloads do YouTube

[⬆ Voltar ao topo](#-yt-grabber)

</div>
