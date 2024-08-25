let currentpage = 1;
let leastpage = 1;

window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.scrollHeight;
  if (endOfPage && currentpage < leastpage) {
    currentpage++;
    GetPosts(currentpage);
  }
});

function GetPosts(page = 1) {
  const posts = document.getElementById("posts");
  const cardLod = document.querySelector(".cardLod");

  const shouldRemoveCardLod = cardLod !== null;

  const url = `https://tarmeezacademy.com/api/v1/posts?limit=10&page=${page}`;

  axios
    .get(url)
    .then((response) => {
      const data = response.data.data;
      leastpage = response.data.meta.last_page;

      if (shouldRemoveCardLod) cardLod.remove();

      posts.innerHTML += data.map(renderPost).join("");

      if (shouldRemoveCardLod) posts.appendChild(cardLod);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}

function renderPost(post) {
  const userid = localStorage.getItem("userid");
  const titlepost = post.title || "";
  let profileImage =
    typeof post.author.profile_image === "string"
      ? post.author.profile_image
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  let postImage = typeof post.image === "string" ? post.image : "";
  const check = userid == post.author.id ? "" : "display: none;";

  return `
    <div class="card shadow mb-5">
      <!-- Card header -->
      <div class="card-header d-flex justify-content-between">
        <!-- Author info -->
        <div>
          <span style="cursor:pointer;" onclick="navigateToProfilePage(${
            post.author.id
          })">
            <img src="${profileImage}" style="width: 2rem; height: 2rem; cursor:pointer;" class="border border-2 rounded-circle" alt="posts">
            <b style="font-size: x-small;">@${post.author.username}</b>
          </span>
        </div>
        <!-- Edit button -->
        <div style="${check}">
          <button type="button" class="btn btn-outline-primary" style="font-size: x-small;" data-bs-toggle="modal" data-bs-target="#EditMod" data-bs-whatever="@mdo" disabled>
            <i class="fas fa-edit"></i> Edit
          </button>
        </div>
      </div>
      <!-- Card body -->
      <div class="card-body d-flex flex-column justify-content-center p-0" onclick="navigateToPostPage(${
        post.id
      })">
        <!-- Post content -->
        <img src="${postImage}" alt="" class="img-thumbnail border-0">
        <h6 class="m-2 text-secondary">${post.created_at}</h6>
        <h5 class="mx-2">${titlepost}</h5>
        <p class="mx-2">${post.body}</p>
        <!-- Tags -->
        <div class="tags-container mx-2">
          ${post.tags
            .map(
              (tag) =>
                `<span id="tag" data-arabic-name="${tag.arabic_name}" data-description="${tag.description}">#${tag.name}</span>`
            )
            .join(" ")}
        </div>
        <hr>
        <!-- Comments count -->
        <div class="mx-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
          </svg>
          <span>(${post.comments_count}) comments</span>
        </div>
      </div>
    </div>`;
}

function createPost() {
  const token = localStorage.getItem("token");
  const title = document.getElementById("title-ct").value;
  const body = document.getElementById("body-ct").value;
  const image = document.getElementById("image-ct").files[0];
  const formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  if (image) {
    formData.append("image", image);
  }
  toggleLoader("lds-add");

  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      const modale = document.getElementById("addpost");
      bootstrap.Modal.getInstance(modale).hide();
      setTimeout(() => {
        success("create Post");
      }, 1000);

      GetPosts(1);
    })
    .catch((error) => {
      const errormsg = document.getElementById("errormsg-add");
      errormsg.innerText = error.response.data.message;
    })
    .finally(() => {
      // Always executed, whether the request was successful or not
      toggleLoader("lds-add"); // Hide loader
    });
}
GetPosts(1);
setUI();
