export const getCommentsModule = ({ arrayComments }) => {
return fetch("https://wedev-api.sky.pro/api/v2/:gleb-fokin/comments", {
    method: "GET"
})
.then((response) => {
    return response.json();
})
.then((answer) => {
    arrayComments = answer.comments;
    /*Переберем все объекты внутри массива и добавим свойство isEdit*/
    for (const objectItem of arrayComments) {
        objectItem.isEdit = false;
    }
    return arrayComments;
})
}