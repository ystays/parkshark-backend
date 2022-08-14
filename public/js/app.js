console.log("Client side javascript file is loaded.")

const weatherForm = document.querySelector("form")
const search = document.querySelector("input")
const messageOne = document.querySelector("#message-1")
const messageTwo = document.querySelector("#message-2")

//messageOne.textContent = ""
//messageTwo.textContent = ""


function isValidAddress(str) {
    return /^[A-Za-z0-9 ,]*$/.test(str)
}

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault()
  
    const location = search.value

    messageOne.textContent = "loading..."
    messageOne.textContent = ""

    if (!isValidAddress(location)) {
        messageOne.textContent = "Invalid input. Please try again."
        messageTwo.textContent = ""
    }
    else {
        fetch("http://localhost:3000/weatherapp?address=" + location).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    messageOne.textContent = data.error
                    messageOne.textContent = ""
                }
                else {
                    messageOne.textContent = data.location
                    messageTwo.textContent = data.forecast
                }
            })    
        })
    }
})