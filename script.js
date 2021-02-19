const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    flag: true,
    mic: false,
    sound: false
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div")
    this.elements.keysContainer = document.createElement("div")

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden")
    this.elements.keysContainer.classList.add("keyboard__keys")
    this.elements.keysContainer.appendChild(this._createKeys())

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key")

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer)
    document.body.appendChild(this.elements.main)

    let input = document.querySelector('.use-keyboard-input')
    if (input.setSelectionRange) {
      input.focus()
    }
    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue
        })
      })
    })
  },

  _setCaretPosition() {
    const input = document.querySelector(".use-keyboard-input")

    if (input.setSelectionRange) {

      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  },

  _createKeys() {
    const fragment = document.createDocumentFragment()
    let keyLayout = []
    let breakLineElems = []
    let flag = localStorage.getItem('flag')
    let lang = localStorage.getItem('lang')

    if (flag === 'true' || flag === null) {
      if (lang === 'ru') {
        keyLayout = [
          "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
          'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ё',
          "caps", 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', "enter",
          "shift", 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ",", ".", "?",
          'mic', "done", 'ru', "space",'sound', "<", ">"
        ]
        breakLineElems = ["backspace", 'ё', "enter", "?"]
      } else {
        keyLayout = [
          "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
          "caps", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
          "shift", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
          "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
          'mic', 'en', "space", 'sound', "<", ">"
        ]
        breakLineElems = ["backspace", "p", "enter", "?"]
      }
    } else {
      keyLayout = [
        "!", "@", "#", "$", "%", "&", "*", "(", ")", "backspace",
        "caps", "-", "+", "[", "]", "{", "}", "|", "/", "^",
        "shift", "~", "—", "\'", "\"", "\\", ':', "_", "∞", "enter",
        "done", "€", "‹", "›", "·", "°", "‡", "±", "`", "<", ">",
        'sound',"space"
      ]
      breakLineElems = ["backspace", "^", "enter", ">"]
    }

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`
    }

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button")
      const keyboard = document.querySelectorAll('.keyboard')
      const insertLineBreak = breakLineElems.indexOf(key) !== -1

      // Add attributes/classes
      keyElement.setAttribute("type", "button")
      keyElement.classList.add("keyboard__key")

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide")
          keyElement.innerHTML = createIconHTML("backspace")

          keyElement.addEventListener("click", () => {
            this._addSpecClickSound(keyElement)
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1)
            this._triggerEvent("oninput")
            this._setCaretPosition()
          })

          break

          case "sound":
          keyElement.classList.add("keyboard__key--thin")
          keyElement.innerHTML = createIconHTML("volume_off")

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) {
              this.properties.sound = false
            } else {
              this.properties.sound = true
            }
            keyElement.classList.toggle("keyboard__shift--active", this.properties.sound)
          })
         
          break

        case "mic":
          keyElement.classList.add("keyboard__key--thin")
          keyElement.innerHTML = createIconHTML("mic")

          this._recognizeSpeech(keyElement)

          break

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable")
          keyElement.innerHTML = createIconHTML("keyboard_capslock")

          keyElement.addEventListener("click", () => {
            this._addSpecClickSound(keyElement)
            this._toggleCapsLock()
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock)
          })

          break

        case "shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable")

          if (localStorage.getItem('flag') === 'false') {
            keyElement.classList.add("keyboard__key--active")
          }
          else {
            keyElement.classList.remove("keyboard__key--active")
          }

          keyElement.innerHTML = '<span>shift</span>'

          keyElement.addEventListener("dblclick", () => {
            if(this.properties.shift) {
              localStorage.setItem("symbols", true)
            } else {
              localStorage.setItem("symbols", false)
            }
            
            keyElement.removeEventListener("click", () => {
              this._toggleShift()
              keyElement.classList.toggle("keyboard__shift--active", !this.properties.shift)
            })
            this._toggleDblShift(keyElement)
            keyboard.forEach(elem => {
              elem.classList.add('keyboard--hidden')
            })
          })
          
            keyElement.addEventListener("click", () => {

              if (!this.properties.sound) {
                if (localStorage.getItem('lang') === 'ru') {
                  document.querySelector('.shift-ru').play()
                } else {
                  document.querySelector('.shift-en').play()
                }
              } else {
                console.log('no sound')
              }

            this._toggleShift()
            keyElement.classList.toggle("keyboard__shift--active", this.properties.shift)
          })

          break

        case "enter":
          keyElement.classList.add("keyboard__key--wide")
          keyElement.innerHTML = createIconHTML("keyboard_return")

          keyElement.addEventListener("click", () => {
            this._addSpecClickSound(keyElement)
            this.properties.value += "\n"
            this._triggerEvent("oninput")
            this._setCaretPosition()
          })

          break

        case "en":
          keyElement.classList.add("keyboard__key--thin")
          keyElement.innerHTML = '<span>en</span>'

          keyElement.addEventListener("click", () => {
            this._addClickSound(keyElement)
            localStorage.setItem('lang', 'ru')
            keyboard.forEach(elem => {
              elem.classList.add('keyboard--hidden')
            })
            this.init()

          })

          break

        case "ru":
          keyElement.classList.add("keyboard__key--thin")
          keyElement.innerHTML = '<span>ru</span>'

          keyElement.addEventListener("click", () => {
            this._addClickSound(keyElement)
            localStorage.setItem('lang', 'en')
            keyboard.forEach(elem => {
              elem.classList.add('keyboard--hidden')
            })
            this.init()

          })

          break

        case "<":
          keyElement.classList.add("keyboard__key--thin")
          keyElement.innerHTML = '<span> < </span>'
          let input = document.querySelector(".use-keyboard-input")
          localStorage.removeItem('pos')
          let posLeft = 0
          keyElement.addEventListener("click", (posLeft) => {
            this._addClickSound(keyElement)

            if (input.setSelectionRange) {
              if (localStorage.getItem('pos') !== null) {
                posLeft = localStorage.getItem('pos')
                posLeft--
              } else {
                posLeft = input.value.length
              }

              input.focus()
              input.setSelectionRange(posLeft, posLeft)

              if (posLeft === 0) {
                localStorage.removeItem('pos')
              } else {
                localStorage.setItem('pos', posLeft)
              }
            }
          })
          break

        case ">":
          keyElement.classList.add("keyboard__key--thin")
          keyElement.innerHTML = '<span> > </span>'
          let sameInput = document.querySelector(".use-keyboard-input")

          localStorage.removeItem('pos')
          let pos = 0

          keyElement.addEventListener("click", (pos) => {
            this._addClickSound(keyElement)
            
            if (sameInput.setSelectionRange) {
              if (localStorage.getItem('pos') !== null) {
                pos = localStorage.getItem('pos')
                pos++
              } else {
                pos = 0
              }

              sameInput.focus()
              sameInput.setSelectionRange(pos, pos)

              if (pos === sameInput.value.length) {
                localStorage.removeItem('pos')
              } else {
                localStorage.setItem('pos', pos)
              }
            }
          })
          break

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide")
          keyElement.innerHTML = createIconHTML("space_bar")

          keyElement.addEventListener("click", () => {
            this._addClickSound(keyElement)
            this.properties.value += " "
            this._triggerEvent("oninput")
            this._setCaretPosition()
          })

          break

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark")
          keyElement.innerHTML = createIconHTML("check_circle")

          keyElement.addEventListener("click", () => {
            this._addClickSound(keyElement)
            this.close()
            this._triggerEvent("onclose")
          })

          break

        default:
          keyElement.textContent = key.toLowerCase()

          keyElement.addEventListener("click", () => {
            this._addClickSound(keyElement)

            let caps = this.properties.capsLock
            let shift = this.properties.shift
            this.properties.value += (caps && !shift) || (!caps && shift) ? key.toUpperCase() : key.toLowerCase()
            this._triggerEvent("oninput")
            this._setCaretPosition()
          })

          break
      }

      fragment.appendChild(keyElement)

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"))
      }
    })

    return fragment
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value)
    }
  },

  _addClickSound() {
    if (this.properties.sound) {
      return
    }
    if (localStorage.getItem('lang') === 'ru') {
      document.querySelector('.audio-ru').play()
    } else {
      document.querySelector('.audio-en').play()
    }
  },

  _addSpecClickSound (keyElement) {
    
    if (this.properties.sound) {
      return
    }
    switch (keyElement.querySelector('.material-icons').textContent) {
      case "backspace":
        if (localStorage.getItem('lang') === 'ru') {
          document.querySelector('.backspace-ru').play()
        } else {
          document.querySelector('.backspace-en').play()
        }
        break

      case "keyboard_capslock":
        if (localStorage.getItem('lang') === 'ru') {
          document.querySelector('.caps-ru').play()
        } else {
          document.querySelector('.caps-en').play()
        }
        break

      case "keyboard_return":
        if (localStorage.getItem('lang') === 'ru') {
          document.querySelector('.enter-ru').play()
        } else {
          document.querySelector('.enter-en').play()
        }
        break

      default:
        if (localStorage.getItem('lang') === 'ru') {
          document.querySelector('.shift-ru').play()
        } else {
          document.querySelector('.shift-en').play()
        }
        break
    }
    
  },

  _recognizeSpeech(keyElement) {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    let recognition = new SpeechRecognition()
    recognition.interimResults = true
    recognition.lang = localStorage.getItem('lang') === 'ru' ? 'ru' : 'en-US'

    let transcript = ''
    let prevousTranscript = ''
    keyElement.addEventListener('click', () => {
      this._addClickSound(keyElement)
      this.properties.mic = !this.properties.mic
      keyElement.classList.toggle("keyboard__shift--active", this.properties.mic)

      if (!this.properties.mic) {
        recognition.stop()
        return
      }
      recognition.start()
      recognition.addEventListener('result', e => {
        transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        if (prevousTranscript) {
          this.properties.value = `${prevousTranscript} ${transcript}`
        } else {
          this.properties.value = transcript
        }

        this._triggerEvent("oninput")
        this._setCaretPosition()
      })
      recognition.addEventListener("end", e => {
        if (transcript) {
          prevousTranscript = `${prevousTranscript} ${transcript}`

          if (!this.properties.mic) {
            recognition.stop()
          } else {
            recognition.start()
          }
        }
      })
    })
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.shift && this.properties.capsLock || !this.properties.capsLock && !this.properties.shift) {
          key.textContent = key.textContent.toLowerCase()
        } else {
          key.textContent = key.textContent.toUpperCase()
        }
      }
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.shift && this.properties.capsLock || !this.properties.capsLock && !this.properties.shift) {
          key.textContent = key.textContent.toLowerCase()
        } else {
          key.textContent = key.textContent.toUpperCase()
        }
      }

    }
  },

  _toggleDblShift(keyElement) {
    if (localStorage.getItem('flag') === 'false') {
      localStorage.setItem('flag', true)
    } else {
      localStorage.setItem('flag', false)
    }
    this.init()
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || ""
    this.eventHandlers.oninput = oninput
    this.eventHandlers.onclose = onclose
    this.elements.main.classList.remove("keyboard--hidden")
  },

  close() {
    this.properties.value = ""
    this.eventHandlers.oninput = oninput
    this.eventHandlers.onclose = onclose
    this.elements.main.classList.add("keyboard--hidden")
  }
}

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init()
  document.querySelector('.use-keyboard-input').blur()
})
