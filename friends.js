const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/'
const INDEX_URL = BASE_URL + 'api/v1/users/'
const USERS_PER_PAGE = 24
const userListPanel = document.getElementById('user-list')
const removeFriendsBtn = document.getElementById('btn-remove-friends')
const paginator = document.getElementById('paginator')

const userList = []
let friendList = JSON.parse(localStorage.getItem('friendsList')) || []

function renderUserList(data) {
  let rawHTML = ''
  data.forEach((user) => {
    rawHTML += `
        <div class="col-6 col-md-4 col-lg-3 col-xl-2">
          <img src="${user.avatar}"
            class="img-fluid mt-3 img-thumbnail"
            id="user-avatar"
            alt="user-avatar"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            data-id="${user.id}"/>
          <h6 id="user-name" class="mt-2">${user.name + ' ' + user.surname}</h6>
        </div>`
  })
  userListPanel.innerHTML = rawHTML
}

// Extract userList data for its corresponding pages
function usersPerPage(page) {
  const list = JSON.parse(localStorage.getItem('friendsList')) || []
  const START_INDEX = (page - 1) * USERS_PER_PAGE
  const END_INDEX = START_INDEX + USERS_PER_PAGE

  return list.slice(START_INDEX, END_INDEX)
}

// render Paginator
function renderPaginator(amount) {
  let rawHTML = `
      <ul class="pagination justify-content-center">
        <li class="page-item disabled">
          <a class="page-link" data-page="previous">Previous</a>
        </li>`
  const totalPage = Math.ceil(amount / USERS_PER_PAGE)

  for (let page = 1; page <= totalPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  rawHTML += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="next">Next</a>
        </li>
      </ul>`

  paginator.innerHTML = rawHTML
}

// Show user info
function showUserInfo(id) {
  const userImage = document.getElementById('user-image')
  const userName = document.getElementById('modal-title')
  const userGender = document.getElementById('user-gender')
  const userAge = document.getElementById('user-age')
  const userRegion = document.getElementById('user-region')
  const userBirth = document.getElementById('user-birth')
  const userEmail = document.getElementById('user-email')

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data
      userName.innerText = data.name + ' ' + data.surname
      userGender.innerText = `Gender: ${data.gender}`
      userAge.innerText = `Age: ${data.age}`
      userRegion.innerText = `Region: ${data.region}`
      userBirth.innerText = `Birthday: ${data.birthday}`
      userEmail.innerText = `Email: ${data.email}`
      userImage.innerHTML = `<img src="${data.avatar}" alt="user-avatar" />`
      removeFriendsBtn.setAttribute('data-id', `${data.id}`)
    })
    .catch((error) => {
      console.log(error.message)
    })
}

// remove friends from localStorage
function removeFriends(id) {
  const list = JSON.parse(localStorage.getItem('friendsList')) || []

  if (!list || !list.length) return

  const filteredFriends = list.filter((friend) => friend.id !== id)
  localStorage.setItem('friendsList', JSON.stringify(filteredFriends))

  renderUserList(usersPerPage(1))
  renderPaginator(filteredFriends.length)
}

// GET request to get all users data and render friends
axios
  .get(INDEX_URL)
  .then((response) => {
    userList.push(...response.data.results)
    renderUserList(usersPerPage(1))
    renderPaginator(friendList.length)
  })
  .catch((error) => {
    console.log(error.message)
    Alert('Sorry something went wrong')
  })

// When user avatar is clicked, it will show its user info in modal form
userListPanel.addEventListener('click', (event) => {
  if (event.target.matches('#user-avatar')) {
    showUserInfo(event.target.dataset.id)
  }
})

// Remove friends from Friends list
removeFriendsBtn.addEventListener('click', (event) => {
  const userId = event.target.dataset.id
  removeFriends(Number(userId))
})

// To render its corresponding users list by page number and show current active page
paginator.addEventListener('click', (event) => {
  const target = event.target
  if (target.tagName !== 'A') return

  const pageLabel = paginator.querySelectorAll('A')
  pageLabel.forEach((page) => {
    if (page.classList.contains('active')) {
      page.classList.remove('active')
    }
  })
  target.classList.add('active')

  renderUserList(usersPerPage(Number(target.dataset.page)))
})
