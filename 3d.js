 
import { init3D, updateCabinet } from "./3d.js";

const container = document.getElementById("canvas-container");
const message = document.getElementById("message");
const updateButton = document.getElementById("update");

function readOptions() {
  return {
    width: Number(document.getElementById("width").value),
    height: Number(document.getElementById("height").value),
    depth: Number(document.getElementById("depth").value),
    doors: Number(document.getElementById("doors").value),
    color: document.getElementById("color").value
  };
}

function validate(options) {
  if (!Number.isFinite(options.width) ||
      options.width < 40 || options.width > 300) {
    return "العرض يجب أن يكون بين 40 و300 سم.";
  }

  if (!Number.isFinite(options.height) ||
      options.height < 60 || options.height > 300) {
    return "الارتفاع يجب أن يكون بين 60 و300 سم.";
  }

  if (!Number.isFinite(options.depth) ||
      options.depth < 20 || options.depth > 100) {
    return "العمق يجب أن يكون بين 20 و100 سم.";
  }

  return "";
}

init3D(container);

updateButton.addEventListener("click", () => {
  const options = readOptions();
  const error = validate(options);

  if (error) {
    message.textContent = error;
    return;
  }

  updateCabinet(options);
  message.textContent =
    `تم تحديث الخزانة: ${options.width} × ${options.height} × ${options.depth} سم، بعدد ${options.doors} أبواب.`;
});
