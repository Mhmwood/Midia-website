function register() {
  const userNameRG = document.getElementById("user-name-rg").value;
  const passwordRg = document.getElementById("password-rg").value;
  const emailRg = document.getElementById("email-rg").value;
  const profileimageRG = document.getElementById("profileimage").files[0];

  let formData = new FormData();
  formData.append("username", userNameRG);
  formData.append("password", passwordRg);
  formData.append("image", profileimageRG);
  formData.append("name", userNameRG);
  formData.append("email", emailRg);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://tarmeezacademy.com/api/v1/register",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };
  toggleLoader("lds-rg");

  axios
    .request(config)

    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("userid", response.data.user.id);
      localStorage.setItem("profileImage", response.data.user.profile_image);
      const modale = document.getElementById("RegisterMod");
      const modaleIS = bootstrap.Modal.getInstance(modale);
      modaleIS.hide();
      location.reload();
    })
    .catch((error) => {
      let errormg = error.response.data.message;
      const errormsg = document.getElementById("errormsg");
      errormsg.innerText = errormg;
    })
    .finally(() => {
      // Always executed, whether the request was successful or not
      toggleLoader("lds-rg"); // Hide loader
    });
}
function Login() {
  const userName = document.getElementById("user-name").value;
  const password = document.getElementById("password").value;
  let data = { username: userName, password: password };
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://tarmeezacademy.com/api/v1/login",
    headers: {
      Accept: "application/json",
    },
    data: data,
  };
  toggleLoader("lds-lg");

  axios(config)
    .then(function (response) {
      console.log(response.data.user.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("userid", response.data.user.id);
      localStorage.setItem("profileImage", response.data.user.profile_image);
      const modale = document.getElementById("LoginMod");
      const modaleIS = bootstrap.Modal.getInstance(modale);
      modaleIS.hide();

      location.reload();
      success("LogIn is:");
    })
    .catch(function (error) {
      let errormg = error.response.data.message;
      const errormsg = document.getElementById("errormsg-ln");
      errormsg.innerText = errormg;
    })
    .finally(() => {
      // Always executed, whether the request was successful or not
      toggleLoader("lds-lg"); // Hide loader
    });
}

function success(text, ty = "success") {
  console.log("i caled");
  const alertPlaceholder = document.getElementById("sucssalrt");
  const appendAlert = (message, type) => {
    alertPlaceholder.innerHTML = "";
    const wrapper = document.createElement("div");

    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  setTimeout(() => {
    alertPlaceholder.innerHTML = "";
  }, 4000);
  appendAlert(text, ty);
}

function Logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("userid");

  const btus = document.getElementById("btus");
  btus.innerHTML = `
                      <button
                type="button"
                class="btn btn-outline-primary mx-1"
                data-bs-toggle="modal"
                data-bs-target="#LoginMod"
                data-bs-whatever="@mdo"
              >
                Login
              </button>
               <button
                type="button"
                class="btn btn-outline-primary mx-1"
                data-bs-toggle="modal"
                data-bs-target="#RegisterMod"
                data-bs-whatever="@mdo"
              >
                Register
              </button>
    
    `;

  success("LogOut is:");
  location.reload();
}

function setUI() {
  const addbtu = document.getElementById("addbtu");
  const btus = document.getElementById("btus");
  const spanTog = document.getElementById("spanTog");
  const navbarContainer = document.getElementById("navbarContainer");
  let userid = localStorage.getItem("userid");
  const addpost = document.getElementById("addpost");
  const profilePage = document.getElementById("proPage"); //kk

  const token = localStorage.getItem("token"); //her
  const profile_image = localStorage.getItem("profileImage");
  let imgHtml = `
    <div class="pimg" id="pimg">
      <img
        src="${profile_image}"
        alt=""
        style="
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: #404649 solid 0.1rem;
        "
      />
    </div>
  `;

  if (token) {
    btus.innerHTML = `
      <button onclick="Logout()" type="button" class="btn btn-outline-danger mx-1">
        Logout
      </button>
    `;

    if (addbtu) {
      addbtu.innerHTML += `      <button
        style="position: fixed; right: 50px; bottom: 50px"
        class="btn btn-light border border-info-subtle rounded-circle"
        id="addpost"
        data-bs-toggle="modal"
        data-bs-target="#addpost"
        data-bs-whatever="@mdo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-plus-circle"
          viewBox="0 0 16 19"
        >
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
          />
        </svg>
      </button>

    `;
    }

    spanTog.className = "";
    spanTog.innerHTML = imgHtml;
    navbarContainer.className =
      "navbar navbar-expand-lx shadow bg-body-tertiary rounded-bottom pt-3 w-75";

    profilePage.onclick = () => navigateToProfilePage(userid);
  } else {
    if (addpost) {
      addpost.remove();
    }
    navbarContainer.className =
      "navbar navbar-expand-lg shadow bg-body-tertiary rounded-bottom pt-3 w-75";
    spanTog.className = "navbar-toggler-icon";
    spanTog.innerHTML = "";
  }
}

function EditPost(isDel = false) {
  const id = localStorage.getItem("postid");
  const token = localStorage.getItem("token");
  const title = document.getElementById("title-ed").value;
  const body = document.getElementById("body-ed").value;
  const method = isDel ? "delete" : "put";
  const message = isDel ? "is delete" : "Post Edit";
  const url = `https://tarmeezacademy.com/api/v1/posts/${id}`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  toggleLoader("lds-ed");

  axios({
    method,
    url,
    headers,
    maxBodyLength: Infinity,
    data: { body, title },
  })
    .then(() => {
      const modale = document.getElementById(isDel ? "delete-post" : "EditMod");
      bootstrap.Modal.getInstance(modale).hide();
      success(message);

      isDel ? (window.location.href = "home.html") : loadPost(id);
    })
    .catch((error) => console.log(error))
    .finally(() => {
      // Always executed, whether the request was successful or not
      toggleLoader("lds-ed"); // Hide loader
    });
}
function navigateToPostPage(postId) {
  localStorage.setItem("postid", postId);
  window.location.href = `postPage.html?`;
}

function navigateToProfilePage(postId) {
  localStorage.setItem("proUesrId", postId);
  window.location.href = `ProfilePage.html?`;
}

function setIdPost(id) {
  let title = document.getElementById("post-title").innerText;
  let body = document.getElementById("post-body").innerText;
  document.getElementById("title-ed").value = title;
  document.getElementById("body-ed").innerText = body;

  localStorage.setItem("postid", id);
}

let cunost = 0
function toggleLoader(id) {
  const spinner = document.getElementById(id);
  if (!spinner) {
    console.error("Spinner element not found.");
    return;
  }

  const currentDisplay = getComputedStyle(spinner).display;
  if (currentDisplay === "none") {
    spinner.style.display = "inline"; // Show the spinner
  } else {
    spinner.style.display = "none"; // Hide the spinner
  }
  cunost++
  console.log(cunost)
}

setUI();
