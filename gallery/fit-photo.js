const figure = document.querySelector('.collection-photo');
const intro = document.querySelector('.collection-intro');
const navigation = document.querySelector('.photo-navigation');
const ratio = Number(figure.style.getPropertyValue('--photo-ratio'));

function fitPhoto() {
  const viewport = window.visualViewport;
  const viewportHeight = viewport?.scale === 1 ? viewport.height : window.innerHeight;
  const top = figure.getBoundingClientRect().top + window.scrollY;
  const bottomPadding = parseFloat(getComputedStyle(document.body).paddingBottom);
  const availableHeight = viewportHeight - top - bottomPadding;
  let width = Math.min(figure.parentElement.clientWidth, Math.floor(availableHeight * ratio));

  while (width > 0) {
    figure.style.setProperty('--photo-fit-width', `${width}px`);
    const overflow = figure.getBoundingClientRect().height - availableHeight;
    if (overflow <= 0) return;

    // the caption can wrap onto more lines as the photo gets narrower
    width -= Math.ceil(overflow * ratio);
  }

  // keep the photo and caption scrollable if the window is too short for both
  figure.style.removeProperty('--photo-fit-width');
}

let frame = 0;
function scheduleFit() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(fitPhoto);
}

const observer = new ResizeObserver(scheduleFit);
observer.observe(intro);
observer.observe(navigation);
observer.observe(figure);
window.addEventListener('resize', scheduleFit);
window.visualViewport?.addEventListener('resize', scheduleFit);
fitPhoto();
