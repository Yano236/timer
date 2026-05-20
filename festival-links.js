(function () {
  function getFestivalPage(date) {
    const current = date || new Date();
    const month = current.getMonth() + 1;
    const day = current.getDate();

    if (month === 5 && day === 20) {
      return {
        href: "love-520.html",
        label: "520情书"
      };
    }

    return {
      href: "birthday-countdown.html",
      label: "生日倒计时"
    };
  }

  function applyFestivalLinks() {
    const festivalPage = getFestivalPage();
    document.querySelectorAll("[data-festival-link]").forEach(function (link) {
      link.href = festivalPage.href;
      link.textContent = festivalPage.label;
      link.setAttribute("aria-label", festivalPage.label);
    });
  }

  window.getFestivalPage = getFestivalPage;
  window.applyFestivalLinks = applyFestivalLinks;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFestivalLinks);
  } else {
    applyFestivalLinks();
  }
}());
