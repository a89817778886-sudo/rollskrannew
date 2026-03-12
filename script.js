// Конфигурация CMS
const API_URL = 'http://localhost:1337'; // если на хостинге, замените на ваш домен
const API_TOKEN = 'ВАШ_ТОКЕН_ИЗ_ШАГА_9'; // вставьте скопированный токен

// Функция загрузки данных из CMS
async function loadFromCMS() {
    try {
        // Загружаем продукты
        const productsResponse = await fetch(`${API_URL}/api/products?populate=*`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        const products = await productsResponse.json();
        
        // Загружаем услуги
        const servicesResponse = await fetch(`${API_URL}/api/services?populate=*`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        const services = await servicesResponse.json();
        
        // Загружаем проекты
        const projectsResponse = await fetch(`${API_URL}/api/projects?populate=*`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        const projects = await projectsResponse.json();
        
        // Загружаем документы
        const docsResponse = await fetch(`${API_URL}/api/documents?populate=*`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        const documents = await docsResponse.json();
        
        // Обновляем страницу с загруженными данными
        updatePageWithData({ products, services, projects, documents });
        
    } catch (error) {
        console.error('Ошибка загрузки из CMS:', error);
        // Если CMS не доступна, используем локальные данные
        useLocalData();
    }
}

// Функция обновления страницы данными из CMS
function updatePageWithData(data) {
    console.log('Данные загружены:', data);
    
    // Здесь можно обновить HTML-контент
    // Например, заполнить продукты:
    if (data.products?.data) {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = '';
            data.products.data.forEach(product => {
                const imageUrl = product.attributes.image?.data?.attributes?.url 
                    ? `${API_URL}${product.attributes.image.data.attributes.url}` 
                    : 'images/placeholder.jpg';
                
                const productCard = `
                    <a href="#" class="product-card">
                        <div class="product-image-wrapper">
                            <img src="${imageUrl}" alt="${product.attributes.title}" class="product-image">
                        </div>
                        <div class="product-content">
                            <h3 class="product-title">${product.attributes.title}</h3>
                            <p class="product-description">${product.attributes.description}</p>
                            <span class="product-link">
                                Подробнее
                                <svg class="link-icon" viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </span>
                        </div>
                    </a>
                `;
                productsGrid.innerHTML += productCard;
            });
        }
    }
    
    // Аналогично для услуг, проектов, документов...
}

// Запасной вариант - локальные данные
function useLocalData() {
    console.log('Используются локальные данные');
    // Здесь можно оставить статический HTML как есть
}

// Запускаем загрузку при загрузке страницы
window.addEventListener('load', loadFromCMS);

// Мобильное меню (как было раньше)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
}

// Слайдер
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
const prevBtn = document.querySelector('.slider-arrow:first-child');
const nextBtn = document.querySelector('.slider-arrow:last-child');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// Калькулятор (без изменений)
const calculateBtn = document.querySelector('.calculator-btn');
if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
        const capacity = parseFloat(document.querySelector('input[name="capacity"]').value) || 0;
        const span = parseFloat(document.querySelector('input[name="span"]').value) || 0;
        
        let resultHtml = '';
        
        if (capacity && span) {
            const beamType = capacity <= 500 ? 'Легкая серия' : capacity <= 1000 ? 'Средняя серия' : 'Тяжелая серия';
            const profileType = span <= 6 ? 'Профиль RC30' : span <= 10 ? 'Профиль RC35' : 'Профиль RC59';
            const motor = capacity <= 500 ? '0.8 кВт' : capacity <= 1000 ? '1.5 кВт' : '2.2 кВт';
            const price = Math.round(capacity * span * 1.5);
            
            resultHtml = `
                <div class="calculation-result">
                    <h4 class="result-title">Результат расчета:</h4>
                    <div class="result-grid">
                        <div class="result-item">
                            <span class="result-label">Тип балки:</span>
                            <span class="result-value">${beamType}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Профиль:</span>
                            <span class="result-value">${profileType}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Рекомендуемый двигатель:</span>
                            <span class="result-value">${motor}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Ориентировочная стоимость:</span>
                            <span class="result-value">${price.toLocaleString()} ₽</span>
                        </div>
                    </div>
                    <p class="result-note">* Для точного расчета обратитесь к нашим инженерам</p>
                </div>
            `;
        } else {
            resultHtml = '<p class="result-note">Пожалуйста, заполните обязательные поля (грузоподъемность и пролет)</p>';
        }
        
        const existingResult = document.querySelector('.calculation-result');
        if (existingResult) {
            existingResult.remove();
        }
        
        calculateBtn.insertAdjacentHTML('afterend', resultHtml);
    });
}

// FAQ аккордеон
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach((question, index) => {
    question.addEventListener('click', () => {
        const isOpen = question.classList.contains('open');
        
        faqQuestions.forEach(q => {
            q.classList.remove('open');
            const answer = q.nextElementSibling;
            if (answer && answer.classList.contains('faq-answer')) {
                answer.style.display = 'none';
            }
        });
        
        if (!isOpen) {
            question.classList.add('open');
            const answer = question.nextElementSibling;
            if (answer && answer.classList.contains('faq-answer')) {
                answer.style.display = 'block';
            }
        }
    });
});

// Форма обратной связи
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = 'Отправка...';
        submitBtn.disabled = true;
        
        const formData = {
            name: document.querySelector('input[name="name"]').value,
            company: document.querySelector('input[name="company"]').value,
            phone: document.querySelector('input[name="phone"]').value,
            email: document.querySelector('input[name="email"]').value,
            message: document.querySelector('textarea[name="message"]').value
        };
        
        setTimeout(() => {
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.';
            
            const existingSuccess = contactForm.querySelector('.form-success');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            contactForm.appendChild(successMessage);
            contactForm.reset();
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }, 1000);
    });
}

// Анимация при прокрутке
function checkScroll() {
    const elements = document.querySelectorAll('.stat-item, .product-card, .service-card, .project-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

document.querySelectorAll('.stat-item, .product-card, .service-card, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
        }
    });
});