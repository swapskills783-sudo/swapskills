// Sample skills data
const skills = [
    { name: "Web Development", description: "Learn HTML, CSS, JavaScript and more", category: "tech", time: 2 },
    { name: "Graphic Design", description: "Master Photoshop, Illustrator and design principles", category: "art", time: 1.5 },
    { name: "Self Defense", description: "Basic self defense techniques for personal safety", category: "defense", time: 1 },
    { name: "Cooking", description: "Learn to cook delicious meals from scratch", category: "diy", time: 2 },
    { name: "Yoga", description: "Yoga for flexibility and stress relief", category: "sports", time: 1 }
];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Generate skill cards
    const skillsGrid = document.getElementById('skillsGrid');

    if (skillsGrid) {
        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <p class="time">Time required: ${skill.time} hours/session</p>
            `;
            skillsGrid.appendChild(skillCard);
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Update active class
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');

                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                const hamburger = document.getElementById('hamburger');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }

                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });

    // Add hover effect to all interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .skill-card, .step, .benefit, .testimonial');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });

        element.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Hamburger menu functionality
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');

            // Change icon
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on nav links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Form submission handling - FIXED VERSION
    const skillForm = document.getElementById('skillForm');
    const formMessage = document.getElementById('formMessage');

    if (skillForm) {
        skillForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Skill...';
            submitButton.disabled = true;

            // Get form data
            const formData = new FormData(this);

            // Send to Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success message
                        formMessage.innerHTML = '<div class="success-message">Skill added successfully! Thank you for contributing to SkillSwap.</div>';
                        formMessage.style.display = 'block';

                        // Reset form
                        skillForm.reset();

                        // Add to skills grid (optional)
                        addSkillToGrid({
                            name: document.getElementById('skillName').value,
                            description: document.getElementById('skillDescription').value,
                            category: document.getElementById('skillCategory').value,
                            time: parseFloat(document.getElementById('timeRequired').value)
                        });
                    } else {
                        throw new Error(data.message || 'Form submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    formMessage.innerHTML = '<div class="error-message">There was an error submitting your skill. Please try again.</div>';
                    formMessage.style.display = 'block';
                })
                .finally(() => {
                    // Restore button
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;

                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                });
        });
    }

    // Function to add new skill to grid
    function addSkillToGrid(skill) {
        const skillsGrid = document.getElementById('skillsGrid');
        if (skillsGrid) {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <p class="time">Time required: ${skill.time} hours/session</p>
            `;
            skillsGrid.appendChild(skillCard);
        }
    }

    // Add loading animation to buttons (except form submit)
    document.querySelectorAll('.btn').forEach(button => {
        if (button.type !== 'submit') {
            button.addEventListener('click', function () {
                if (!this.href.includes('#')) {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    this.disabled = true;

                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 2000);
                }
            });
        }
    });
});

// Map Modal Functionality
function openMap() {
    const mapModal = document.getElementById('mapModal');
    if (mapModal) {
        mapModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMap() {
    const mapModal = document.getElementById('mapModal');
    if (mapModal) {
        mapModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside or pressing Escape
document.addEventListener('DOMContentLoaded', function () {
    const mapModal = document.getElementById('mapModal');

    if (mapModal) {
        // Close when clicking outside the content
        mapModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeMap();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMap();
            }
        });
    }
});