let toolsData = []

fetch("data/tools.json")
.then(res => res.json())
.then(data => {

toolsData = data

renderTools(data)

renderTrending(data)

renderMostUsed(data)

renderPopular(data)

renderNew(data)

renderMegaLinks(data)

})

function renderTools(tools){

const container = document.getElementById("toolsContainer")

container.innerHTML=""

tools.forEach(tool=>{

const card=document.createElement("div")

card.className="tool-card"

card.innerHTML=`

<div class="tool-icon">${tool.icon}</div>
<h3>${tool.name}</h3>
<p>${tool.description}</p>
`

card.onclick=()=>{window.location=tool.url}

container.appendChild(card)

})

}

function renderTrending(data){

const container=document.getElementById("trendingTools")

data.slice(0,6).forEach(tool=>{

container.innerHTML+=`<div class="trend-card">${tool.name}</div>`

})

}

function renderMostUsed(data){

const container=document.getElementById("mostUsedTools")

data.slice(0,6).forEach((tool,i)=>{

container.innerHTML+=`

<div class="most-tool">
<span class="rank">${i+1}</span>
<span>${tool.icon}</span>
<span>${tool.name}</span>
</div>
`

})

}

function renderPopular(data){

const container=document.getElementById("popular")

const popular=data.filter(t=>t.popular)

popular.forEach(tool=>{
container.innerHTML+=`${tool.name}<br>`
})

}

function renderNew(data){

const container=document.getElementById("new")

data.sort((a,b)=>new Date(b.created)-new Date(a.created))

data.slice(0,5).forEach(tool=>{
container.innerHTML+=`${tool.name}<br>`
})

}

function renderMegaLinks(data){

const container=document.getElementById("megaLinks")

data.forEach(tool=>{
container.innerHTML+=`<a href="${tool.url}">${tool.name}</a>`
})

}

const tabs=document.querySelectorAll(".tooltab")
const panels=document.querySelectorAll(".tab-panel")

tabs.forEach(tab=>{

tab.addEventListener("click",()=>{

tabs.forEach(t=>t.classList.remove("active"))
panels.forEach(p=>p.classList.remove("active"))

tab.classList.add("active")

document.getElementById(tab.dataset.tab).classList.add("active")

})

})

const catBtns=document.querySelectorAll(".cat")

catBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

catBtns.forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

const cat=btn.dataset.cat

const filtered=toolsData.filter(t=>t.category===cat)

renderTools(filtered)

})

})

const menuBtn = document.querySelector(".menu")
const mobileMenu = document.getElementById("mobileMenu")

if(menuBtn && mobileMenu){

menuBtn.addEventListener("click", () => {

mobileMenu.classList.toggle("open")

})

}
