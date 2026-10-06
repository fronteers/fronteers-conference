document.addEventListener("DOMContentLoaded", function () {
  const photoGrid = document.querySelector('[data-component="photo-grid"]');

  const lightbox = document.querySelector('[data-target="lightbox"]');
  const lightboxContent = lightbox.querySelector('[role="document"]');
  const lightboxImage = lightboxContent.querySelector(
    'img[data-target="image"]'
  );
  const actions = lightboxContent.querySelectorAll("button[data-action]");

  if (!lightbox) {
    throw new Error("Expected [data-target='lightbox'] to exist on page");
  }

  if (!lightboxContent) {
    throw new Error('Expected [role="document"] to exist inside lightbox');
  }

  if (!lightboxImage) {
    throw new Error(
      'Expected img[data-target="image"] to exist inside lightbox content'
    );
  }

  if (!("showModal" in lightbox)) {
    // Ignore, have links work as links
    return;
  }

  const downloadAction = lightboxContent.querySelector(
    '[data-action="download"]'
  );

  let currentActive;

  photoGrid.addEventListener("click", function (event) {
    if (!event.target || !(event.target instanceof Element)) {
      return;
    }

    if (event.ctrlKey) {
      return;
    }

    const image = event.target.closest("a") || event.target.closest("img");
    if (!image) {
      return;
    }

    event.preventDefault();
    setCurrent(image);

    lightbox.removeAttribute("hidden");
    lightbox.showModal(); // { source: image }

    document.body.classList.add("--has-dialog");

    lightbox.addEventListener(
      "close",
      () => {
        document.body.classList.remove("--has-dialog");
      },
      { once: true }
    );
  });

  function closeLightbox() {
    lightbox.close();
    lightbox.setAttribute("hidden", "");
    lightboxImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    currentActive.focus();
    currentActive = undefined;
  }

  function gotoNext() {
    const nextActive = currentActive
      .closest("li")
      .nextElementSibling?.querySelector("a,img");

    if (nextActive) {
      setCurrent(nextActive);
    }
  }

  function gotoPrev() {
    const nextActive = currentActive
      .closest("li")
      .previousElementSibling?.querySelector("a,img");

    if (nextActive) {
      setCurrent(nextActive);
    }
  }

  function setCurrent(newCurrent) {
    currentActive = newCurrent;

    const imageSrc =
      currentActive.href || currentActive.dataset.src || currentActive.src;
    lightboxImage.src = imageSrc;

    downloadAction.href =
      currentActive.href || currentActive.dataset.src || currentActive.src;
    downloadAction.download = downloadAction.href.split("/").pop();
  }

  function onAction(event) {
    if (!event.target || !(event.target instanceof Element)) {
      return;
    }

    const action = event.target.closest("[data-action]");

    switch (action.getAttribute("data-action")) {
      case "next": {
        gotoNext();
        break;
      }

      case "prev": {
        gotoPrev();
        break;
      }

      case "close": {
        closeLightbox();
        break;
      }
    }
  }

  actions.forEach((action) => {
    action.addEventListener("click", onAction);
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (event) {
    if (lightbox.hasAttribute("hidden")) {
      return;
    }

    switch (event.key) {
      case "Escape": {
        closeLightbox();
        break;
      }

      case "ArrowLeft": {
        gotoPrev();
        break;
      }

      case "ArrowRight": {
        gotoNext();
        break;
      }
    }
  });
});
