const form = document.getElementById("form")
const addOrRemove = document.querySelectorAll(".addOrRemove")
const amount = document.getElementById("amount")
const category = document.getElementById("category")
const description = document.getElementById("description")

function formatMoney(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value)
}

if (!localStorage.getItem("transaction")) {
    localStorage.setItem("transaction", JSON.stringify([]))
}

if (!localStorage.getItem("accountStatement")) {
    localStorage.setItem("accountStatement", JSON.stringify([]))
}

addOrRemove.forEach((buttonclick) => {
    buttonclick.addEventListener("click", () => {
        sessionStorage.setItem("selected", buttonclick.dataset.id)
    })
})

form.addEventListener("submit", (event) => {
    event.preventDefault()

    const sessionValue = sessionStorage.getItem("selected")

    if (!["0", "1"].includes(sessionValue)) {
        alert("Choose if it’s income or expense")
        return
    }

    const amountFloat = parseFloat(amount.value)

    const transactionValues = {
        amount: amountFloat,
        category: category.value,
        description: description.value,
        date: new Date().toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }),
        type: sessionValue
    }

    const data = JSON.parse(localStorage.getItem("transaction")) || []
    data.push(transactionValues)
    localStorage.setItem("transaction", JSON.stringify(data))

    sessionStorage.removeItem("selected")

    form.reset()

    reloadAccountHistory()
})

function reloadAccountHistory() {
    const total = document.getElementById("total")
    const cardExtract = document.getElementById("cardExtract")

    const data = JSON.parse(localStorage.getItem("accountStatement")) || []

    let totalCalc = 0

    cardExtract.innerHTML = ""

    data.forEach((item) => {
        const cardContent = document.createElement("div")
        cardContent.classList.add("extract")

        const amountValue = parseFloat(item.amount)

        if (item.type === "1") {
            cardContent.classList.add("income")
            totalCalc += amountValue
        } else {
            cardContent.classList.add("expense")
            totalCalc -= amountValue
        }

        const h1 = document.createElement("h1")
        const p = document.createElement("p")
        const p2 = document.createElement("p")
        const p3 = document.createElement("p")

        h1.textContent = item.category

        if (item.type === "1") {
            p.textContent = "deposited: " + formatMoney(amountValue)
        } else {
            p.textContent = "spent: " + formatMoney(amountValue)
        }

        p2.textContent = item.description || "No description"
        p3.textContent = item.date

        cardContent.append(h1, p, p2, p3)
        cardExtract.appendChild(cardContent)
    })

    total.textContent = formatMoney(totalCalc)
}

window.onload = () => {
    reloadAccountHistory()
}
