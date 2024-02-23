const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.speed = 2 + Math.random() * 2;
}

Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + 10);
    ctx.stroke();
};

Particle.prototype.update = function() {
    this.y += this.speed;
    if (this.y > canvas.height) {
        this.y = 0;
    }
};

function createParticles() {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.draw();
        particle.update();
    });

    requestAnimationFrame(animate);
}

createParticles();
animate();