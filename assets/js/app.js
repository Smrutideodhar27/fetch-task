const cl=console.log;

const postContainer = document.getElementById('postContainer');
const postForm = document.getElementById('postForm');
const titleControle = document.getElementById('title');
const contentControle = document.getElementById('content');
const userIdControle = document.getElementById('userId');
const addPostBtn = document.getElementById('addPostBtn');
const updatePostBtn = document.getElementById('updatePostBtn');

function snackBar (title,icon){
    Swal.fire({
        title,
        icon,
        timer:1000
    })

}let BASE_URL = `https://jsonplaceholder.typicode.com/`;
let POST_URL =`${BASE_URL}/posts`;

function fetchAllPosts(){

    const loader = document.getElementById('loader');

    let xhr = new XMLHttpRequest();
    xhr.open('GET',POST_URL);			
	
    xhr.setRequestHeader('Auth','Token from LS');

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            let data = JSON.parse(xhr.response);
                createCards(data);
        }
        const loader = document.getElementById('loader');
    };
    xhr.send(null);
}

fetchAllPosts();

const createCards = (arr) =>{
    let result = arr.map(post =>{
        return `
        <div class="card mb-3 shadow rounded" id="${post.id}">
            <div class="card-header">
                <h3 class="m-0">${post.title}</h3>
            </div>
            <div class="card-body">
                <p class="m-0">${post.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
            </div>
        </div>`;
    }).join('');

    postContainer.innerHTML = result;
};

	

function onRemove(btn){
    Swal.fire({
        title:"Do you want to remove the post?",
			showCancelButton:true,
			confirmButtonText:"Remove",
    }).then((result)=>{
        if(result.isConfirmed){
            
            loader.classList.remove('d-none');

            let REMOVE_id = btn.closest('.card').id;
            let REMOVE_URL = `${POST_URL}/${REMOVE_id}`;

            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", REMOVE_URL);

            xhr.onload = function(){
                loader.classList.add('d-none');

                if(xhr.status >= 200 && xhr.status < 300){
                  let res = xhr.response;
                  
                    // UI se card remove
                    btn.closest('.card').remove();

                    snackBar("Post removed successfully!", "success");
                }else{
                    snackBar("Something went wrong!", "error");
                }
            };

            xhr.send(null);
        }
    });
}

function onEdit(btn){
    loader.classList.remove('d-none');

    let Edit_id = btn.closest('.card').id;
    cl(Edit_id);

    localStorage.setItem("Edit_id", Edit_id);

    let EDIT_URL = `${POST_URL}/${Edit_id}`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", EDIT_URL);

    xhr.onload = function(){
        loader.classList.add('d-none');

        if(xhr.status >= 200 && xhr.status < 300){
            let res = JSON.parse(xhr.response);

            titleControle.value = res.title;
            contentControle.value = res.body;
            userIdControle.value = res.userId;

            addPostBtn.classList.add("d-none");
            updatePostBtn.classList.remove("d-none");
        }else{
            snackBar("Something went wrong!", "error");
        }
    };

    xhr.send(null);
}

function onUpdatePost() {
    let update_id = localStorage.getItem('Edit_id');
    cl(update_id);

    let UPDATED_OBJ = {
        title : titleControle.value,
        body : contentControle.value,
        userId: userIdControle.value,
        id : update_id
    }
    // cl(UPDATED_OBJ);

    let update_url = `${BASE_URL}/posts/${update_id}`;

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH",update_url);

    xhr.setRequestHeader("content-Type","application/json");

    xhr.onload = function(){
        cl(xhr.status);
        if(xhr.status >= 200 && xhr.status < 300){
            let res = JSON.parse(xhr.response);
            cl(res);
            let card = document.getElementById(update_id);
             card.querySelector('.card-header h3').innerText = UPDATED_OBJ.title;
            card.querySelector('.card-body p').innerText = UPDATED_OBJ.body;

            postForm.reset();
		
            addPostBtn.classList.remove('d-none');
            updatePostBtn.classList.add('d-none');

            snackBar(`POST updated successfully !!!`,'success');


        }else{
            snackBar(`Something went wrong !!!`,'error');
        }
        
    }

   xhr.send(JSON.stringify(UPDATED_OBJ));

}
    
		



function onPostSubmit(eve){
    eve.preventDefault();

    let postObj = {
        title: titleControle.value,
        body:contentControle.value,
        userId:userIdControle.value
    };

    let xhr = new XMLHttpRequest()
    xhr.open("POST",POST_URL)
    xhr.setRequestHeader("content-type","application/json");

    xhr.onload = function(){
        if(xhr.status === 201){
            let res = JSON.parse(xhr.response);

            let card = document.createElement('div')
            card.className =`card mb-3 shadow rounded`;
            card.id = res.id;

            card.innerHTML = `<div class="card-header">
                            <h3 class="m-0">${postObj.title}</h3>
                        </div>
                        <div class="card-body">
                            <p>${postObj.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                        </div>`

                        postContainer.append(card);
                        snackBar("New post is created successfully !!","success");
                        eve.target.reset();

        }else{
            snackBar('somthing went wrong !!!','error');
        }
    };
    xhr.send(JSON.stringify(postObj));

}


postForm.addEventListener('submit',onPostSubmit);
updatePostBtn.addEventListener('click', onUpdatePost);



																																																																					;	






