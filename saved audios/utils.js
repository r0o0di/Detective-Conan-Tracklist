export function stylePlaylist(timeOrNum, jpnTitle, rmjTitle, title, album) {
    const playlist = document.getElementById("playlist");
    const audio = `
        <tr>
            <td>${timeOrNum}</td>
            <td>${jpnTitle}</td>
            <td>${rmjTitle}</td>
            <td>${title}</td>
            <td>${album}</td>
        </tr>
    `;
    playlist.insertAdjacentHTML("beforeend", audio);
}


export function navigation(navElement, homeIconImgSrc, heartIconImgSrc) {
    const nav = `
            <div class="home-saved-container">
                <a href="../index.html"><img src="../00images/${homeIconImgSrc}.png" alt="home" class="nav-home"></a>
                <a href="../saved audios/savedAudios.html"><img src="../00images/${heartIconImgSrc}.png" alt="saved audios" class="nav-heart"></a>
            </div>
           
`;

    navElement.insertAdjacentHTML("afterbegin", nav);
}

