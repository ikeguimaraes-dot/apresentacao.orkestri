const progress = document.querySelector('#progressBar');
const header = document.querySelector('.topbar');
addEventListener('scroll', () => {
  const height = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${height > 0 ? scrollY / height * 100 : 0}%`;
  header.classList.toggle('scrolled', scrollY > 40);
}, { passive: true });
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .06 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
