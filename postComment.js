export const postComment = ({ formattedComment, name, token }) => {
    return fetch("https://wedev-api.sky.pro/api/v2/:gleb-fokin/comments", {
            method: "POST",
            headers: {
                Authorization: token,
            },
            body: JSON.stringify({
                text: formattedComment,
                name: name
            })
        })
        .then((response) => {
            if (response.status === 201) {
            return response.json();
            } else if (response.status === 400) {
                if (nameSave.length < 3) {
                    alert("Имя меньше 3-х символов");
                } else if (commentSave.length < 3) {
                    alert("комментарий меньше 3-х символов");
                }
                throw new console.error("что то короткое");
            } else if (response.status === 500) {
                console.log("пробуем еще разок, вацок");
                postComment({ formattedComment, name, getComments });
            } else {
                throw new console.error("что то не так");
            } 
        })
}