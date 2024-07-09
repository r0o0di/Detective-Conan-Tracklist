
function lazyLoad() {
  const images = document.querySelectorAll("img");
  images.forEach(img => {
    img.setAttribute("loading", "lazy");
    document.body.appendChild(img);
  });
}

lazyLoad();

















