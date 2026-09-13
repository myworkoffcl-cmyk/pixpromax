export function createCompareSlider(container, beforeSrc, afterSrc){

container.innerHTML = `
<div class="compare-container">
<img src="${beforeSrc}" class="compare-before">
<img src="${afterSrc}" class="compare-after">
<input type="range" min="0" max="100" value="50" class="compare-slider">
</div>
`

const slider = container.querySelector(".compare-slider")
const after = container.querySelector(".compare-after")

slider.addEventListener("input", () => {

after.style.width = slider.value + "%"

})

}