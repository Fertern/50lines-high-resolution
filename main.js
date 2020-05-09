const sourceCanvas = document.getElementById('source');
const resultCanvas = document.getElementById('result');
const fileInput = document.getElementById('file-input');
const actionButton = document.getElementById('actionButton');
const labelNumber = document.querySelectorAll('.variables > div');
const swapButton = document.getElementById('swap');

const sourceCtx = sourceCanvas.getContext('2d');
const resultCtx = resultCanvas.getContext('2d');

console.log(document.querySelectorAll('.variables > div'));

let imageWidth = 0;
let imageHeight = 0;

const updateCanvasSize = () => {
  sourceCanvas.width = imageWidth;
  sourceCanvas.height = imageHeight;
  resultCanvas.width = imageWidth;
  resultCanvas.height = imageHeight;
};

const readAsDataUrl = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });

const decel = (x) => 1 - (x - 1) * (x - 1);

swapButton.addEventListener('click', () => {
  const prevColor = document.getElementById('color').value;
  document.getElementById('color').value = document.getElementById(
    'background'
  ).value;
  document.getElementById('background').value = prevColor;
});

actionButton.addEventListener('click', async (e) => {
  console.log();
  const HEIGHT = document.getElementById('resolution').value || 700;
  const linesCount = document.getElementById('linesCount').value || 50;
  const waveFactor = document.getElementById('waveFactor').value || 700;
  const mainColor = document.getElementById('color').value;
  const backgrond = document.getElementById('background').value;

  const wave = HEIGHT / waveFactor;

  const values = [HEIGHT, linesCount, waveFactor, mainColor, backgrond];

  labelNumber.forEach((div, index) => (div.innerHTML = values[index]));

  console.log(e);
  if (fileInput.files && fileInput.files[0]) {
    console.log(fileInput.files[0]);
    const dataUrl = await readAsDataUrl(fileInput.files[0]);
    const img = await loadImage(dataUrl);

    imageWidth = Math.floor((img.width * HEIGHT) / img.height);
    imageHeight = HEIGHT || 700;

    updateCanvasSize();

    sourceCtx.drawImage(img, 0, 0, imageWidth, imageHeight);

    const imgd = sourceCtx.getImageData(0, 0, imageWidth, imageHeight);
    const pix = imgd.data;
    const n = pix.length;

    for (let i = 0; i < n; i += 4) {
      const grayscale =
        pix[i + 3] === 0
          ? 255
          : pix[i] * 0.3 + pix[i + 1] * 0.59 + pix[i + 2] * 0.11;
      pix[i] = grayscale;
      pix[i + 1] = grayscale;
      pix[i + 2] = grayscale;
      pix[i + 3] = 255;
    }

    resultCtx.strokeStyle = mainColor;
    resultCtx.fillStyle = backgrond;
    resultCtx.fillRect(0, 0, imageWidth, imageHeight);

    resultCtx.fillRect(0, 0, imageWidth, imageHeight);

    for (let y = 0; y < linesCount; ++y) {
      resultCtx.beginPath();
      resultCtx.lineWidth = 2 * wave;
      resultCtx.lineJoin = 'round';

      let l = 0;

      for (let x = 0; x < imageWidth; ++x) {
        const c =
          pix[(((y * imageHeight) / linesCount + 6) * imageWidth + x) * 4];

        l += (255 - c) / 255;

        const m = (255 - c) / 255;

        resultCtx.lineTo(
          x,
          ((y + 0.5) * imageHeight) / linesCount +
            Math.sin(((l / wave) * Math.PI) / 2) * 5 * wave * decel(m)
        );
      }
      resultCtx.stroke();
    }
  }
});
