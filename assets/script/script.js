import { criptografar, descriptografar } from "./util.js"

const textareaInput = document.querySelector(".box-principal textarea")
const textareaOutput = document.querySelector("textarea#resultado")
const areaResultadoEmpty = document.querySelector(".resultado-empty")
const areaResultadoNormal = document.querySelector(".resultado-normal")
const btnCriptografar = document.querySelector("#btn-criptografar")
const btnDescriptografar = document.querySelector("#btn-descriptografar")
const btnCopy = document.querySelector(".button-copy")

let data = JSON.parse(window.localStorage.getItem('_aluracrypto')) || {}

btnCriptografar.addEventListener('click', e => {
    if (!textareaInput.value.trim()) {
        areaResultadoEmpty.classList.remove("hidden")
        areaResultadoNormal.classList.add("hidden")
        return textareaInput.focus()
    }
    data.action = "criptografar"
    changeOutputValue(criptografar(textareaInput.value))
})

btnDescriptografar.addEventListener('click', e => {
    if (!textareaInput.value.trim()) return textareaInput.focus()
    data.action = "descriptografar"
    changeOutputValue(descriptografar(textareaInput.value))
})

btnCopy.addEventListener("click", e => {
    let button = e.currentTarget
    let icon = e.currentTarget.querySelector('.icon')
    let span = e.currentTarget.querySelector('span')

    let oldValue = span.textContent
    let oldIconClass = Array.from(icon.classList).filter(c => c.includes("ph-"))

    let copyText = document.getElementById("resultado")
    try {
        copyText.select()
        copyText.setSelectionRange(0, copyText.value.length)
        document.execCommand("copy")
        icon.classList.remove(oldIconClass)
        icon.classList.add("ph-check-bold", "success")
        button.disabled = true
        span.textContent = "Copiado!"
        unselect()
        setTimeout(() => {
            button.disabled = false
            span.textContent = oldValue
            icon.classList.remove("ph-check-bold", "success")
            icon.classList.add(oldIconClass)

        }, 2000)
    }
    catch (err) {
        console.log(err)
        alert("Não foi possível copiar!")
    }
})

const scrollToBoxResult = () => {
    setTimeout(() => {
        document.querySelector('#box-resultado').scrollIntoView({
            behavior: 'smooth'
        })
    }, 200)
}

const changeOutputValue = (string, read = false) => {
    areaResultadoEmpty.classList.add("hidden")
    areaResultadoNormal.classList.remove("hidden")
    textareaOutput.innerHTML = string

    if (!read) {
        saveDataLocalStorage()
    }
    scrollToBoxResult()
}

const unselect = () => window.getSelection().removeAllRanges()


/* LOCAL STORAGE */
textareaInput.addEventListener('input', () => {
    delete data.action
    saveDataLocalStorage()
})
textareaInput.addEventListener('change', () => {
    delete data.action
    saveDataLocalStorage()
})

const saveDataLocalStorage = () => {
    data.txt = textareaInput.value
    window.localStorage.setItem('_aluracrypto', JSON.stringify(data))
}

const loadDataInitial = () => {

    if (!data.txt) return

    textareaInput.value = data.txt

    if (data.action === "criptografar") {
        changeOutputValue(criptografar(data.txt), true)
    }

    else if (data.action === "descriptografar") {
        changeOutputValue(descriptografar(data.txt), true)
    }

}

loadDataInitial()