(function () {
  function insertProgram() {
    const programContainer = document.querySelector(".program-container");

    $.getScript("archive/2021/resources/acts.js", () => {
      window.acts.forEach((act) => {
        const actDiv = document.createElement("div");
        actDiv.classList.add("event", act.type);

        const titleDiv = document.createElement("div");
        titleDiv.classList.add("event-title");
        titleDiv.innerHTML = act.name;
        actDiv.appendChild(titleDiv);

        const youtubeButton = document.createElement("div");
        if (act.youtubeID) {
          youtubeButton.classList.add("youtube-button");
          const youtubeIcon = document.createElement("svg");
          youtubeButton.appendChild(youtubeIcon);

          // copied from https://icons.getbootstrap.com/icons/youtube/
          youtubeIcon.outerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/></svg>';

          actDiv.appendChild(youtubeButton);
        }

        const subtitleDiv = document.createElement("div");
        subtitleDiv.classList.add("event-subtitle");
        subtitleDiv.innerHTML = act.details;
        actDiv.appendChild(subtitleDiv);

        // exmaple of a youtube iframe:
        // <iframe width="560" height="315" src="https://www.youtube.com/embed/qC7G4k7HN0o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        const iframe = document.createElement("iframe");
        if (act.youtubeID) {
          actDiv.appendChild(iframe);
        }

        const closeButton = document.createElement("div");
        closeButton.classList.add("close-button");
        const closeIcon = document.createElement("i");
        closeIcon.classList.add("bi", "bi-x-circle");
        closeButton.appendChild(closeIcon);
        actDiv.appendChild(closeButton);

        programContainer.appendChild(actDiv);

        actDiv.onclick = () => {
          if (actDiv.classList.contains("open")) {
            closeButton.onclick();
          } else {
            closeButton.onclick();

            actDiv.classList.add("open");
            if (!iframe.src) {
              iframe.src = `https://www.youtube.com/embed/${act.youtubeID}?enablejsapi=1`;
              iframe.title = "YouTube video player";
              iframe.frameborder = 0;
              iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
              iframe.allowFullscreen = true;
            }
            iframe.height = actDiv.clientWidth * 0.5625;
          }
        };

        new ResizeObserver(() => {
          iframe.height = actDiv.clientWidth * 0.5625;
        }).observe(actDiv);

        closeButton.onclick = () => {
          document.querySelectorAll("iframe").forEach((element) => {
            element.contentWindow.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              "*",
            ); // stop the youtube video (https://stackoverflow.com/questions/15164942/stop-embedded-youtube-iframe)
          });

          document.querySelectorAll(".open").forEach((element) => {
            element.classList.remove("open");
          });
        };
      });

      for (let index = 0; index < 5; index += 1) {
        const filler = document.createElement("div");
        filler.classList.add("event", "filler");
        programContainer.appendChild(filler);
      }
    });
  }

  $(document).ready(() => {
    insertProgram();
  });
})();
