// AOS Animate On Scroll Initialization
AOS.init({
    duration: 1000,
    once: true, // only animate once
  });
  
  // Smooth Scroll to Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
  
  // Navbar Background Change on Scroll
  window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      nav.classList.add("bg-dark", "shadow");
    } else {
      nav.classList.remove("shadow");
    }
  });
  
  // Booking Form Animation Trigger
  const bookingSection = document.querySelector("#booking");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bookingSection.classList.add("show");
        }
      });
    },
    { threshold: 0.5 }
  );
  observer.observe(bookingSection);
  
  // Button Animation on Hover
  document.querySelectorAll("a.btn, button").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.05)";
      btn.style.transition = "0.2s ease-in-out";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
    });
  });
  