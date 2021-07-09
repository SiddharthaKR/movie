function toggle_visibility(id1,id2,id3,id4,id5) {
    var e = document.getElementById(id1);
    var f = document.getElementById(id2);
    var g = document.getElementById(id3);
    var h = document.getElementById(id4);
    var i = document.getElementById(id5);
    if(e.style.display == 'block'){
    e.style.display = 'none';
    i.style.display = 'block';}
    else {
        e.style.display="none";
       f.style.display = 'none';
       g.style.display = 'none';
       h.style.display = 'none';
       i.style.display = 'block';
    }
}
const imgUrl = "https://image.tmdb.org/t/p/w1280"
const url ="https://api.themoviedb.org/3/search/movie?api_key=396f7abead7b7b21aaeabbfc5a6f1929&language=en-US"
const pageUrl ="https://www.themoviedb.org/search?query=avengers"
const api_key= "396f7abead7b7b21aaeabbfc5a6f1929";

const inputElement= document.querySelector("#inputValue");
const buttonElement= document.querySelector("#search");


buttonElement.onclick = function(event){
    event.preventDefault();
    const value = inputElement.value;




    const newUrl = url+ "&query=" +value;
    const newPageUrl= pageUrl+ "&query=" +value;

fetch(newUrl)
.then((res) => res.json())
.then((data) => {

   let arr= document.querySelectorAll(".changeimage")
   let names = document.getElementsByClassName("moviedes");

for(var i=0;i<arr.length;i++){

    let rating= data.results[i].vote_average
    let title= data.results[i].original_title;
    let backDropPath = data.results[i].backdrop_path
    let newImgUrl = imgUrl+backDropPath;
    // document.getElementsByTagName("a")[i].setAttribute("href",newPageUrl)
    names[i].innerHTML= title+"<br>"+"Rating:"+rating;
    arr[i].setAttribute("src",newImgUrl);
document.getElementsByClassName("wb")[i].value= newImgUrl;
document.getElementsByClassName("hid")[i].value= title;
}

}).catch((err) =>{
    console.log("error: "+ err);
})
console.log("name= "+ value);
}
