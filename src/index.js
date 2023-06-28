document.querySelector('.qoute-list')
const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")

newQuoteForm.addEventListener("submit", (event) => {
  event.preventDefault()
  console.log(newQuoteForm.quote)
  // create new quotes and add to the list 
  const newQuote = document.querySelector("#new-quote").value
  const newAuthor = document.querySelector("#author").value

  // POST 
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor
    })
  })
    .then(r => r.json())
    .then(newQuoteObj => {
      renderSingleQuote(newQuoteObj)
    })


  // then add it to our list of quotes

})

function renderSingleQuote(quote) {
  const newLi = document.createElement("li")
  newLi.className = "quote-card"

  let likesCount;
  if (quote.likes) {
    likesCount = quote.likes.length
  } else {
    likesCount = 0
  }

  newLi.innerHTML = `
  <blockquote id=${quote.id} class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${likesCount}</span></button>
    <button class='btn-danger'>Delete</button>
  </blockquote>
  `

  // NESTED EVENT LISTENERS
  const deleteBtn = newLi.querySelector(".btn-danger")
  const likeBtn = newLi.querySelector(".btn-success")

  likeBtn.addEventListener("click", () => {
    // debugger
    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteId: quote.id
      })
    })
      .then(r => r.json())
      .then(() => {
        const likesSpan = newLi.querySelector("span")
        likesSpan.textContent = parseInt(likesSpan.textContent) + 1
      })
  })

  deleteBtn.addEventListener("click", (event) => {
    // remove the quote from our list in the DOM
    newLi.remove()

    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: "DELETE"
    })
  })

  quoteList.append(newLi)
}

function renderAllQuotes(quoteArray) {
  // and render each element to the page
  quoteArray.forEach(quote => {
    renderSingleQuote(quote)
  })
}


fetch("http://localhost:3000/quotes?_embed=likes")
  .then(r => r.json())
  .then(quoteArray => renderAllQuotes(quoteArray))
