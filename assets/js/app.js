const cl = console.log

const postContainer = document.getElementById("postContainer")
const blogForm = document.getElementById("blogForm")
const titleCntrl = document.getElementById("title")
const contentCntrl = document.getElementById("content")
const userIdCntrl = document.getElementById("userId")
const addPostBtn = document.getElementById("addPostBtn")
const updatePostBtn = document.getElementById("updatePostBtn")
const loader = document.getElementById("loader")



function toggleSpinner(flag){
      if (flag === true) {
        loader.classList.remove('d-none')
    } else {
        loader.classList.add('d-none')
    }
}

function snackBar(title, icon){
    Swal.fire({
        title,
        icon,
        timer: 1000
    })
}

function blogObjToArr (obj){
    let blogsArr = []
    for (const key in obj) {
        obj[key].id = key
        blogsArr.push(obj[key])
    }
    return blogsArr
}

let BASE_URL = `https://blog-c8064-default-rtdb.firebaseio.com`;

let POST_URL = `${BASE_URL}/blogs.json`;


function fetchAllBlogs(){
    toggleSpinner(true)
    
fetch(POST_URL, {
    method: "GET",
    body: null,
    headers : {
        Auth : "Token From LS",
        "content-type" : "application/json"
    }
})
.then(res => {
    return res.json()
})
.then(data => {
    cl(data)
    let blogsArr = blogObjToArr(data)
    createCards(blogsArr)
})
.catch(cl)
.finally(() => {
            toggleSpinner(false)
        })

}

fetchAllBlogs()



const createCards = arr =>{
    let res = arr.map(post=>{
        return `
        <div class="card mb-3 shadow rounded" id="${post.id}">
                    <div class="card-header">
                        <h3 class="m-0">${post.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="mb-0">
                        ${post.content}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                    </div>
                </div> `;
    }).join("")
    cl(res)
    postContainer.innerHTML = res;
}





function onBlogAdd(eve) {
    eve.preventDefault();

    const blogObj = {
        title: titleCntrl.value,
        content: contentCntrl.value,
        userId: userIdCntrl.value

    };
    toggleSpinner(true);

    fetch(POST_URL, {
        method: 'POST',
        body: JSON.stringify(blogObj),
        headers: {
            "Auth": "Token From LS",
            "content-type": "application/json"
        }
    })
        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                return res.json()
            }
        })
        .then(data => {
            cl(data)
            blogForm.reset()

            let card = document.createElement('div')
            card.className = 'card mb-5 shadow rounded'
            card.id = data.name;
            card.innerHTML = `<div class="card-header">
                        <h3>${blogObj.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${blogObj.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-outline-danger btn-sm " onclick="onRemove(this)">Remove</button>
                    </div>`
            postContainer.append(card)

        })
        .catch(err => {
            snackBar('something went wrong while creating new blog', 'error')
        })
         toggleSpinner(false)
}



const onRemove = (ele) => {
    Swal.fire({
        title: "Do you want to Remove this blog",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Remove it!"
    }).then((result) => {
        if (result.isConfirmed) {
             toggleSpinner(true)
            let REMOVE_ID = ele.closest('.card').id
            cl(REMOVE_ID)
            let REMOVE_URL = `${BASE_URL}/blogs/${REMOVE_ID}.json`;
            //API CALL
           
            fetch(REMOVE_URL, {
                method: "DELETE",
                body: null,
                headers: {
                    "Auth": "Token From LS",
                    "content-type": "application/json"
                }
            })
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    cl(data)
                    ele.closest('.card').remove();
                    snackBar(`The blog with id ${REMOVE_ID} is removed successfully!!!`, "success");
                })
                .catch(err => {
                    cl(err);
                    snackBar("Something went wrong while Rremoving!", "error");
                })
               
        }
          toggleSpinner(false)
    })
}






function onEdit(ele) {
    toggleSpinner(true);
    let EDIT_ID = ele.closest('.card').id
    cl(EDIT_ID)
    localStorage.setItem("EDIT_ID", EDIT_ID)

    const EDIT_URL = `${BASE_URL}/blogs/${EDIT_ID}.json`;
    cl(EDIT_URL)

    
    
    fetch(EDIT_URL, {
        method: "GET",
        body: null,
        headers: {
            Auth: "Token From LS",
            'content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            titleCntrl.value = data.title;
            contentCntrl.value = data.content;
            userIdCntrl.value = data.userId;

            updatePostBtn.classList.remove("d-none");
            addPostBtn.classList.add("d-none");
        })
        .catch(err => snackBar(err, 'error'))
        .finally(() => {
            toggleSpinner(false)
        })
}

function onUpdate() {
    toggleSpinner(true);
    let UPDATED_ID = localStorage.getItem('EDIT_ID')
    cl(UPDATED_ID)

    let UPDATED_URL = `${BASE_URL}/blogs/${UPDATED_ID}.json`
    cl(UPDATED_URL)
    let UPDATED_OBJ = {
        title: titleCntrl.value,
        content: contentCntrl.value,
        userId: userIdCntrl.value,
        id: UPDATED_ID
    }
    cl(UPDATED_OBJ)
    //blogForm.reset()
    fetch(UPDATED_URL, {
        method: 'PATCH',
        body: JSON.stringify(UPDATED_OBJ),
        headers: {
            Auth: "Token From LS",
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            cl(data) 
            let card = document.getElementById(UPDATED_ID)
            card.querySelector('.card-header h3').innerText = data.title
            card.querySelector('.card-body p').innerText = data.content

            

            blogForm.reset();
            updatePostBtn.classList.add("d-none");
            addPostBtn.classList.remove("d-none");

            snackBar(`The post with id ${UPDATED_ID} is updated successfully`, "success")
        })
        .catch(err => {
            cl(err);
            snackBar(`Something went wrong while updating BLOG`, "error");
        })
          toggleSpinner(false)
}

updatePostBtn.addEventListener("click", onUpdate);
blogForm.addEventListener("submit", onBlogAdd)