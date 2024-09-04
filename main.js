import { postComment } from "./postComment.js";
import { getCommentsModule } from "./getComments.js";
import { formatDateToRu, formatDateToUs } from "./lib/formatDate/formatDate.js"

const appEl = document.getElementById("app");

let arrayComments = [];
let token = '';

function getComments() {
    getCommentsModule({ arrayComments })
        .then((answer) => {
            arrayComments = answer;
            renderComments(arrayComments);
            return answer;
        })
        .catch((error) => {
            console.log(error.message);
        })
};


const renderComments = (arrayComments) => {
    const commentsHtml = arrayComments.map((item, index) => {
        let dateCommentTime = new Date(item.date);
        const formatterDate = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(dateCommentTime);
        const formatterTime = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(dateCommentTime);
        let dateComment = String(formatterDate) + " " + String(formatterTime);
        console.log(formatDateToRu(dateCommentTime));

        let text = "";
        let classLike = (item.isLiked) ? '"like-button like-button-active"' : '"like-button"';
        if (item.isEdit) {
            text = `<li id="li" class="comment">
            <div class="comment-header">
            <div>${item.author.name}</div>
            <div>${dateComment}</div>
            </div>
            <div class="comment-body">
            <div class="comment-text">
                <textarea id="edit" type="textarea" class="add-form-text"
            rows="4">${item.text}</textarea>
            </div>
            </div>
            <div class="comment-footer">
               <button data-id=${item.id} data-index=${index} class="save-button"></button> 
            </div>
            </li>`;
        }
        else {
            text = `<li id="li" class="comment">
            <div class="comment-header">
            <div>${item.author.name}</div>
            <div>${dateComment}</div>
            </div>
            <div class="comment-body">
            <div data-id=${item.id} data-index=${index} class="comment-text">
                ${item.text}
            </div>
            </div>
            <div class="comment-footer">
            <div class="likes">
            <span class="likes-counter">${Number(item.isLiked)}</span>
            <div class="buttons-icons">
            <button data-id=${item.id} data-index=${index} class="edit-button"></button>
            <button data-id=${item.id} data-index=${index} class=${classLike}></button>
            </div>
            </div>
            </div>
            </li>`;
        }
        return text;
    })
    appEl.innerHTML =
        `<ul id="ul" class="comments">
            ${commentsHtml.join("")}
        </ul>

        <div id="add-form" class="add-form">
            <input id="name" type="text" class="add-form-name" placeholder="Введите ваше имя" />
            <textarea id="comment" type="textarea" class="add-form-text" placeholder="Введите ваш коментарий"
                rows="4"></textarea>
            <div class="add-form-row">
                <button id="button" class="add-form-button">Написать</button>
            </div>
        </div>
        <p id="loginText">Чтобы добавить комментарий, <span class="loginLink">авторизуйтесь</span></p>`;

    /* Получим элементы после отрисовки */
    const ulEl = document.getElementById("ul");
    const nameEl = document.getElementById("name");
    const commentEl = document.getElementById("comment");
    const buttonEl = document.getElementById("button");
    const loginTextEl = document.getElementById("loginText");
    const addFormEl = document.getElementById("add-form");
    if (token === "") {
        addFormEl.style.display = 'none';
        loginTextEl.style.display = 'block';
    } else if (token.length > 5) {
        addFormEl.style.display = 'block';
        loginTextEl.style.display = 'none';
        buttonEl.disabled = false;
        buttonEl.textContent = "Написать";
    };

    ulEl.addEventListener('click', function (event) {
        if (event.target.classList.contains('like-button')) {
            console.log(event.target.dataset.index);
            if (arrayComments[event.target.dataset.index].isLiked) {
                arrayComments[event.target.dataset.index].isLiked = false;
            } else {
                arrayComments[event.target.dataset.index].isLiked = true;
            }
            /*(arrayComments[event.target.dataset.index].like = true) ? arrayComments[event.target.dataset.index].like = true : arrayComments[event.target.dataset.index].like = false; */
            renderComments({ arrayComments, ulEl });
        }
        else if (event.target.classList.contains('edit-button')) {
            if (arrayComments[event.target.dataset.index].isEdit) {
                arrayComments[event.target.dataset.index].isEdit = false;
            } else {
                arrayComments[event.target.dataset.index].isEdit = true;
            }
            renderComments({ arrayComments, ulEl });
        }
        else if (event.target.classList.contains('save-button')) {
            if (arrayComments[event.target.dataset.index].isEdit) {
                const editTextEl = document.getElementById("edit");
                if (editTextEl.value !== '') {
                    arrayComments[event.target.dataset.index].text = editTextEl.value;
                }
                arrayComments[event.target.dataset.index].isEdit = false;
            }

            renderComments({ arrayComments, ulEl });
        }
        else if (event.target.classList.contains('comment-text')) {
            let replyText =
                '&lt;' +
                String(arrayComments[event.target.dataset.index].text) +
                '\n' +
                String(arrayComments[event.target.dataset.index].author.name) +
                "., "
                ;

            commentEl.value = replyText;
            buttonEl.classList.remove("add-form-button");
            buttonEl.classList.add("add-form-button-active");
        }
    })

    nameEl.addEventListener('input', function (e) {
        if (nameEl.value !== '' && commentEl !== '') {
            console.log(nameEl.value);
            buttonEl.classList.remove("add-form-button");
            buttonEl.classList.add("add-form-button-active");
        } else {
            buttonEl.classList.add("add-form-button");
            buttonEl.classList.remove("add-form-button-active");
        }
    });

    commentEl.addEventListener('input', function (e) {
        if (nameEl.value !== '' && commentEl.value !== '') {
            buttonEl.classList.remove("add-form-button");
            buttonEl.classList.add("add-form-button-active");
        } else {
            buttonEl.classList.add("add-form-button");
            buttonEl.classList.remove("add-form-button-active");
        }
    });

    buttonEl.addEventListener('click', function (e) {
        if (nameEl.value !== '' && commentEl.value !== '') {
            let dateToday = new Date();
            let formattedComment = commentEl.value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

            let name = nameEl.value;

            buttonEl.disabled = true;
            buttonEl.textContent = "Отправляем...";

            postComment({ formattedComment, name, token })
                .then((answer) => {
                    console.log(answer.result);
                    nameEl.value = "";
                    commentEl.value = "";
                    getComments();
                })
                .catch((error) => {
                    console.log(error.message);
                });

            buttonEl.classList.add("add-form-button");
            buttonEl.classList.remove("add-form-button-active");
        } else {
            return;
        }

    });

    loginTextEl.addEventListener('click', (event) => {
        if (event.target.classList.contains("loginLink")) {
            renderAuthPage();
        }
    })
}


const renderAuthPage = () => {

    appEl.innerHTML = `<form id="authForm" class="authorization" action="">
            <input class="authorization__input" id="inputLogin" type="text" placeholder="Введите логин">
            <input class="authorization__input" id="inputPassword" type="password" placeholder="Введите пароль">
            <button type="submit" class="authorization__button" id="buttonAuthorization">Войти</button>
            <a class="authorization__link" id="linkRegistration" href="">Зарегистрироваться</a>
        </form>`;

    const loginEl = document.getElementById("inputLogin");
    const passwordEl = document.getElementById("inputPassword");
    const buttonAuthorizationEl = document.getElementById("buttonAuthorization");
    const linkRegistrationEl = document.getElementById("linkRegistration");
    const authFormEl = document.getElementById("authForm");

    authFormEl.addEventListener("submit", (event) => {
        event.preventDefault();
        fetch("https://wedev-api.sky.pro/api/user/login", {
            method: "POST",
            body: JSON.stringify({
                login: loginEl.value,
                password: passwordEl.value,
            })
        })
            .then((response) => {
                if (response.status === 201) {
                    return response.json();
                } else if (response.status === 400) {
                    throw new console.error("неправильный логин или пароль");
                } else {
                    throw new console.error("что то не так");
                }
            })
            .then((responseData) => {
                token = "Bearer " + responseData.user.token;
                renderComments(arrayComments);
                return responseData;
            })
            .catch((error) => {
                console.log(error.message);
            })
    });

};



/*
const renderMainPage = () => {

};
*/



getComments();