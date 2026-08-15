const speech = document.querySelector(".speech");
const closeButton = document.querySelector(".dialog-close");
let speechTimer;
const showSpeech = (message) => {
  speech.textContent = message;
  speech.classList.add("is-visible");
  clearTimeout(speechTimer);
  speechTimer = setTimeout(() => {
    speech.classList.remove("is-visible");
  }, 2600);
};
closeButton.addEventListener("click", () => {
  showSpeech("不可关闭，W阿姨会一直盯着你一直盯着你一直盯着你一直盯着你……");
});
document.querySelector('[data-message="知道就好"]').addEventListener("click", (event) => {
  event.currentTarget.animate(
    [{ transform: "translateY(3px) scale(.96)" }, { transform: "translateY(0) scale(1)" }],
    { duration: 180, easing: "ease-out" }
  );
  showSpeech("知道就好");
});
document.querySelector("[data-go-wiki]").addEventListener("click", () => {
  window.location.href = "/aobi/wiki/";
});
