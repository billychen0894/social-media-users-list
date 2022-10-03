const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/'
const INDEX_URL = BASE_URL + 'api/v1/users/'
const userListPanel = document.getElementById('user-list')
const searchForm = document.getElementById('searchForm')
const searchInput = document.getElementById('searchInput')
const addToFriendsBtn = document.getElementById('btn-addToFriends')

const userList = []
let filteredUserList = []

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
      addToFriendsBtn.setAttribute('data-id', `${data.id}`)
    })
    .catch((error) => {
      console.log(error.message)
    })
}

// Add friends to localStorage
function addToFriends(id) {
  const friendsList = JSON.parse(localStorage.getItem('friendsList')) || []
  const user = userList.find((user) => user.id === id)

  if (friendsList.some((friend) => friend.id === id)) {
    alert(`${user.name + ' ' + user.surname} is already in your friend list.`)
  } else {
    friendsList.push(user)
    localStorage.setItem('friendsList', JSON.stringify(friendsList))
  }
}

// GET request to get all users data and render all users
axios
  .get(INDEX_URL)
  .then((response) => {
    userList.push(...response.data.results)
    renderUserList(userList)
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

// To search users with search keywords
searchForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const input = searchInput.value.trim().toLowerCase()

  // if input has spaces only, remove spaces and will not do anything
  if (!input.length) return (searchInput.value = '')

  filteredUserList = userList.filter(function(user) {
    const fullName = user.name + ' ' + user.surname
    return fullName.toLowerCase().includes(input)
  })
  renderUserList(filteredUserList)
})

// Add to Friends list
addToFriendsBtn.addEventListener('click', (event) => {
  const userId = event.target.dataset.id
  addToFriends(Number(userId))
})
