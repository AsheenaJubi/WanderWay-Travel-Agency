document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const topBtn = document.querySelector(".to-top");

  if(menuBtn) menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
    menuBtn.innerHTML = nav.classList.contains("open")
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => nav?.classList.remove("open"));
  });

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 40);
    topBtn?.classList.toggle("show", window.scrollY > 500);
  });

  topBtn?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if(id && id !== "#"){
        const el = document.querySelector(id);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:"smooth"}); }
      }
    });
  });

  // Category filters
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".filter-wrap");
      group?.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      const target = btn.dataset.target;
      document.querySelectorAll(`${target} .filterable`).forEach(item => {
        item.style.display = filter === "all" || item.dataset.category.includes(filter) ? "" : "none";
      });
    });
  });

  // Gallery lightbox
  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = document.querySelector(".lightbox img");
  let current = 0;

  function openLightbox(index){
    if(!lightbox || !galleryItems.length) return;
    current = index;
    lightboxImg.src = galleryItems[current].querySelector("img").src;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox(){
    lightbox?.classList.remove("show");
    document.body.style.overflow = "";
  }
  function changeImage(step){
    current = (current + step + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[current].querySelector("img").src;
  }

  galleryItems.forEach((item, index) => item.addEventListener("click", () => openLightbox(index)));
  document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  document.querySelector(".lightbox-prev")?.addEventListener("click", () => changeImage(-1));
  document.querySelector(".lightbox-next")?.addEventListener("click", () => changeImage(1));
  lightbox?.addEventListener("click", e => { if(e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if(!lightbox?.classList.contains("show")) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") changeImage(-1);
    if(e.key === "ArrowRight") changeImage(1);
  });

  // Booking validation
  const bookingForm = document.querySelector("#bookingForm");
  if(bookingForm){
    const dateInput = bookingForm.querySelector('[name="travelDate"]');
    if(dateInput) dateInput.min = new Date().toISOString().split("T")[0];

    bookingForm.addEventListener("submit", e => {
      e.preventDefault();
      if(!bookingForm.checkValidity()){
        bookingForm.reportValidity();
        return;
      }
      const phone = bookingForm.querySelector('[name="phone"]').value.trim();
      if(!/^[+]?[\d\s()-]{10,15}$/.test(phone)){
        alert("Please enter a valid phone number.");
        return;
      }
      const success = document.querySelector("#bookingSuccess");
      success.classList.add("show");
      bookingForm.reset();
      if(dateInput) dateInput.min = new Date().toISOString().split("T")[0];
      success.scrollIntoView({behavior:"smooth", block:"center"});
    });
  }

  const contactForm = document.querySelector("#contactForm");
  contactForm?.addEventListener("submit", e => {
    e.preventDefault();
    if(!contactForm.checkValidity()){
      contactForm.reportValidity();
      return;
    }
    const msg = document.querySelector("#contactSuccess");
    msg.classList.add("show");
    contactForm.reset();
  });

  // Entrance animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});
