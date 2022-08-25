import Maze from "./models/maze.js";

let searchType = localStorage.getItem("SearchType") || "Deep First Search";

const maze = new Maze(searchType)
const mazeTitle = document.querySelector("[data-title]")

maze.remakeSearch()
mazeTitle.innerHTML = searchType

document.querySelectorAll("[data-search]").forEach(btn => {
    btn.addEventListener("click",(e) => {
        searchType = e.target.dataset.search
        mazeTitle.innerHTML = searchType
        localStorage.setItem("SearchType", searchType)
        
        maze.setSearchType(searchType)
        maze.clearIntervals()
        maze.remakeSearch()

    })
})