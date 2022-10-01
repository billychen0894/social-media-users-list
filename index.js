const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/'
const INDEX_URL = BASE_URL + 'api/v1/users/'
const userListPanel = document.getElementById('user-list')

const userList = []

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
          <h6 id="user-name" class="mt-2">${user.name + user.surname}</h6>
        </div>`
  })
  userListPanel.innerHTML = rawHTML
}

axios.get(INDEX_URL).then((response) => {
  userList.push(...response.data.results)
  renderUserList(userList)
})

userListPanel.addEventListener('click', (event) => {
  if (event.target.matches('#user-avatar')) {
    console.log(event.target)
  }
})
