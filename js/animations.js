// Additional animations and UI enhancements for Randamoozham 3D

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Set up initial mode indicator state
  updateModeIndicator();

  // Add event listeners for keyboard shortcuts
  document.addEventListener("keydown", function (event) {
    if (event.key === " ") {
      // Space key
      updateModeIndicator("paused");
    } else if (event.key === "m" || event.key === "M") {
      updateModeIndicator("manual");
    } else if (event.key === "a" || event.key === "A") {
      updateModeIndicator("auto");
    }
  });

  // Function to update the mode indicator
  function updateModeIndicator(mode) {
    const modeIndicator = document.getElementById("modeIndicator");
    if (!modeIndicator) return;

    // Remove all existing classes
    modeIndicator.classList.remove("mode-auto", "mode-manual", "mode-paused");

    // Set the appropriate class and text based on the mode
    if (mode === "paused") {
      modeIndicator.classList.add("mode-paused");
      modeIndicator.textContent = "PAUSED";
    } else if (mode === "manual") {
      modeIndicator.classList.add("mode-manual");
      modeIndicator.textContent = "MANUAL MODE";
    } else {
      modeIndicator.classList.add("mode-auto");
      modeIndicator.textContent = "AUTO ADVANCING";
    }
  }

  // Function to create blood effects for Dushasana's death scene
  window.createBloodEffects = function () {
    // Remove any existing blood effects
    const existingEffects = document.querySelectorAll(
      ".blood-effect, .blood-effects-container"
    );
    existingEffects.forEach((effect) => effect.remove());

    // Create container for blood effects
    const bloodContainer = document.createElement("div");
    bloodContainer.className = "blood-effects-container";
    bloodContainer.style.position = "absolute";
    bloodContainer.style.top = "0";
    bloodContainer.style.left = "0";
    bloodContainer.style.width = "100%";
    bloodContainer.style.height = "100%";
    bloodContainer.style.pointerEvents = "none";
    bloodContainer.style.zIndex = "150";
    document.body.appendChild(bloodContainer);

    // Create multiple blood effects for a more dramatic scene
    for (let i = 0; i < 8; i++) {
      const bloodEffect = document.createElement("div");
      bloodEffect.className = "blood-effect";

      // Distribute effects across the screen
      bloodEffect.style.left = `${30 + Math.random() * 40}%`;
      bloodEffect.style.top = `${30 + Math.random() * 40}%`;

      // Vary the size for a more natural effect
      const size = 40 + Math.random() * 40;
      bloodEffect.style.width = `${size}px`;
      bloodEffect.style.height = `${size}px`;

      // Add random delay to animations
      bloodEffect.style.animationDelay = `${Math.random()}s`;

      // Add to container
      bloodContainer.appendChild(bloodEffect);
    }
  };

  // Check title and create blood effects if we're at Dushasana's death scene
  function checkForSpecialScenes() {
    const chapterTitle = document.getElementById("chapterTitle");
    if (chapterTitle && chapterTitle.textContent === "Dushasana's End") {
      if (!document.querySelector(".blood-effect")) {
        window.createBloodEffects();
      }
    } else {
      // Remove blood effects for other scenes
      const bloodEffects = document.querySelectorAll(
        ".blood-effect, .blood-effects-container"
      );
      bloodEffects.forEach((effect) => effect.remove());
    }
  }

  // Set up an observer to watch for changes to the chapter title
  const chapterTitle = document.getElementById("chapterTitle");
  if (chapterTitle) {
    const observer = new MutationObserver(checkForSpecialScenes);
    observer.observe(chapterTitle, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    // Check initially
    checkForSpecialScenes();
  }
});
