const API_KEY = "AIzaSyB7n8zdo3TQQfODkFhZwGRFvcAJcclEglc";
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

let currentQuery = "";
let nextPageToken = null;

const openVideos = (videoId) => {
  const modal = document.getElementById("video-modal");
  document.getElementById(
    "video-player"
  ).src = `https://www.youtube.com/embed/${videoId}`;
  modal.style.display = "block";
};

const displayVideos = (videos) => {
  const container = document.getElementById("video-container");

  videos.forEach((video) => {
    const videoElement = document.createElement("div");
    videoElement.classList.add("video");
    videoElement.innerHTML = `
    <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
    <h3>${video.snippet.title}</h3>
    <p>${video.snippet.channelTitle}</p>
    `;

    videoElement.addEventListener("click", () => {
      openVideos(video.id.videoId);
    });

    container.appendChild(videoElement);
  });
};

const fetchVideos = (query, pageToken = "") => {
  currentQuery = query;
  const url = `${BASE_URL}?part=snippet&maxResults=10&q=${query}&type=video&key=${API_KEY}&pageToken=${pageToken}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayVideos(data.items);
      nextPageToken = data.nextPageToken || null;
      document.getElementById("load-more").style.display = nextPageToken
        ? "block"
        : "none";
    })
    .catch((error) => {
      console.log("Error fetching videos:", error);
    });
};

const searchVideos = () => {
  const query = document.getElementById("search-box").value.trim();

  if (query) {
    document.getElementById("video-container").innerHTML = "";
    fetchVideos(query);
  }
};

document.getElementById("load-more").addEventListener("click", () => {
  if (nextPageToken) fetchVideos(currentQuery, nextPageToken);
});

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("video-modal").style.display = "none";
  document.getElementById("video-player").src = "";
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("video-modal");
  if (event.target === modal) {
    modal.style.display = "none";
    document.getElementById("video-player").src = "";
  }
});

const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
};

document.addEventListener("DOMContentLoaded", () => {
  fetchVideos("ladakh bike rides 2025");
  document
    .getElementById("toggle-dark-mode")
    .addEventListener("click", toggleDarkMode);
});