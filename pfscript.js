function fitSlant() {
    const el = document.querySelector('.profiles');
    if (!el) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 75° lean, capped so a slice never leans more than its own width
    const ideal = h * Math.tan(15 * Math.PI / 180);
    const off = Math.min(ideal, w / 6);
    const angle = Math.atan(off / h) * 180 / Math.PI;

    el.style.setProperty('--off', off + 'px');
    el.style.setProperty('--a', angle + 'deg');
}

fitSlant();
window.addEventListener('resize', fitSlant);