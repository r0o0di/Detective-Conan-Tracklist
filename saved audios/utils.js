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
