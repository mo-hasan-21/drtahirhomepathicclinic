document.addEventListener('DOMContentLoaded', () => {
    
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    const consultForm = document.getElementById('consultForm');
    const formStatus = document.getElementById('formStatus');

    if (consultForm) {
        consultForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const contactInfo = document.getElementById('contactInfo').value.trim();
            const description = document.getElementById('description').value.trim();

            if (!name || !contactInfo || !description) {
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.style.color = 'red';
                formStatus.style.marginTop = '10px';
                return;
            }

            formStatus.textContent = 'Sending request...';
            formStatus.style.color = '#2b7a78';
            formStatus.style.marginTop = '10px';

            const formData = new FormData(consultForm);
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    formStatus.textContent = "Thank you! Your consultation request has been sent successfully.";
                    formStatus.style.color = 'green';
                    consultForm.reset();
                } else {
                    console.log(response);
                    formStatus.textContent = json.message || "Something went wrong! Please check if the Web3Forms Access Key is set correctly.";
                    formStatus.style.color = 'red';
                }
            })
            .catch(error => {
                console.log(error);
                formStatus.textContent = "Note: Form submission disabled as it uses a placeholder key. In production, this would send an email.";
                formStatus.style.color = '#e67e22';
            });
        });
    }
});
