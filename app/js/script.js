window.addEventListener('DOMContentLoaded', () => {
  console.log('%cInterno PWA', 'font-size: 15px; font-weight: 700; color: darkcyan;');

  // Common
  // Replacing the page title if the browser tab is changed
  const pageTitle = document.title;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      document.title = '👀 I see you switched tabs...';
    } else {
      document.title = pageTitle;
    }
  })

  // Register ScrollTrigger plugin 
  gsap.registerPlugin(ScrollTrigger);

  // The function of checking the presence of elements
  const isElExisted = (...elements) => {
    return elements.every(element => document.querySelectorAll(element).length > 0);
  }
  // ----- //

  const faqsToggler = (itemEl, itemContentEl, showClass) => {
    const questions = document.querySelectorAll(itemEl);

    const questionHandler = (question) => {
      const questionText = question.querySelector(itemContentEl);

      questionText.style.height = question.classList.contains(showClass)
        ? `${questionText.scrollHeight}px`
        : 0;
    }

    questions.forEach(question => {
      question.style.cssText += `
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      `;
      question.querySelector(itemContentEl).style.cssText += `
        transition: .5s;
        overflow: hidden;
        height: 0;
      `;
      question.addEventListener('click', ({ currentTarget }) => {
        questions.forEach(question => {
          question !== currentTarget && question.classList.remove(showClass);
          questionHandler(question);
        })

        currentTarget.classList.toggle(showClass);
        questionHandler(currentTarget);
      });

      questionHandler(question);
    })
  }

  // ----- //

  // Custom horizontal scrollbar
  if (isElExisted('#progress-bar')) {
    const progressX = () => {
      const windowScrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentScrollHeight = document.documentElement.scrollHeight;

      const progressEl = document.querySelector('#progress-bar');
      const progress = (windowScrollTop / (documentScrollHeight - windowHeight)) * 100;

      progressEl.style.width = `${progress}% `;
    };

    progressX();

    window.addEventListener('scroll', progressX);
  }

  // Fixed header when page is scrolled
  const fixedHeader = () => {
    const header = document.querySelector('.header');
    header.classList[window.scrollY > 1 ? 'add' : 'remove']('fixed');
  }

  fixedHeader();

  window.addEventListener('scroll', fixedHeader);

  // Toggle search field in header
  const searchField = document.querySelector('.search__field');
  const searchBtn = document.querySelector('.search__btn');

  searchBtn.addEventListener('click', (evt) => {
    evt.preventDefault();

    if (searchField.classList.contains('open') && searchField.value.length > 0) {
      searchField.closest('form').submit();
    } else {
      searchField.classList.toggle('open');
    }
  })

  // Menu toggler
  const wrapEl = document.querySelector('.wrapper');
  const navMenu = document.querySelector('.nav-menu');
  const menuWrapper = navMenu.querySelector('.menu-wrapper');
  const burger = navMenu.querySelector('.burger');

  const menuHadler = (actionClass) => {
    document.body.style.overflow = actionClass === 'add' ? 'hidden' : '';
    wrapEl.classList[actionClass]('slideX');
    burger.classList[actionClass]('go-back');
    menuWrapper.classList[actionClass]('open');
    if (actionClass === 'add') {
      menuWrapper.append(burger);
    } else {
      navMenu.append(burger);
    }
  }

  burger.addEventListener('click', () => {
    menuHadler('add');
  })

  menuWrapper.addEventListener('click', ({ currentTarget, target }) => {
    if (currentTarget.contains(burger) && target.closest('.burger')) {
      menuHadler('remove');
    }
  })


  // Close the menu when the menu item is clicked
  const menuItems = document.querySelectorAll('.menu__item-link');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      burger.classList.remove('go-back');

      const sectionId = e.currentTarget.dataset?.sectionId;

      if (sectionId && document.querySelector(sectionId)) {
        e.preventDefault();

        menuHadler('remove');

        const getElTopPos = (selector) => {
          const el = document.querySelector(selector);
          const elClientTop = el.getBoundingClientRect().top;
          const docScrollTop = document.documentElement.scrollTop;

          const elTopPos = elClientTop + docScrollTop;

          return elTopPos;
        }

        window.scrollTo({
          top: getElTopPos(sectionId) - 50,
          behavior: 'smooth'
        })
      }
    });
  });

  // Animation of the appearance of the Header and the Hero section
  const animate = (selector, values = null) => {
    gsap.from(selector, {
      duration: 2,
      opacity: 0,
      onComplete: () => {
        document.querySelector(selector)?.removeAttribute('style');
      },
      ...values
    })
  }

  isElExisted('.header') && animate('.header', { top: -100 });
  isElExisted('.hero') && animate('.hero', { xPercent: -100, rotation: 40 });

  // Animation og the Works section
  if (isElExisted('.work')) {
    const worksTl = gsap.timeline({
      defaults: {
        opacity: 0,
      },
      scrollTrigger: {
        trigger: '.work',
        start: 'top-=30% center',
        end: 'bottom-=50% center',
        scrub: .5
      }
    })

    worksTl
      .from('.work__card:nth-child(3n+1)', {
        rotation: -40,
        xPercent: -30
      }, '<')
      .from('.work__card:nth-child(3n+2)', {
        yPercent: 50
      }, '<')
      .from('.work__card:nth-child(3n+3)', {
        rotation: 40,
        xPercent: 30
      }, '<')
  }

  // Animated about section
  if (isElExisted('.about')) {
    const aboutTl = gsap.timeline({
      defaults: {
        opacity: 0
      },
      scrollTrigger: {
        trigger: '.about__body',
        start: 'top-=40% center+=200',
        end: 'center+=10% bottom-=150',
        scrub: 1
      }
    })

    aboutTl
      .from('.about__info', {
        xPercent: -100,
      })
      .from('.about__picture', {
        xPercent: 100,
      }, '<')
  }

  // Animation of the Testimonial section
  if (isElExisted('.testimonial')) {
    const testimonialTl = gsap.timeline({
      defaults: {
        opacity: 0
      },
      scrollTrigger: {
        trigger: '.testimonial',
        start: 'top center+=30%',
        end: 'bottom-=20% top+=20%'
      }
    })

    testimonialTl
      .from('.testimonial__body', {
        background: 'transparent'
      })
      .from('.testimonial__body > .main-title', {
        rotateX: 90
      }, '<')
      .from('.testimonial__card', {
        stagger: .3,
        y: 100,
      }, '<10%')
  }

  // Animation of the Partners section
  if (isElExisted('.partners')) {
    const partnersTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.partners',
        start: 'top-=200 center+=200',
        end: 'bottom+=100 center-=300'
      }
    })

    partnersTl
      .from('.partners__item', {
        stagger: .2,
        xPercent: 100,
        opacity: 0,
        ease: 'back',
      }, '<10%')
  }

  // Animation of the Projects section
  if (isElExisted('.projects')) {
    gsap.from('.projects__caption', {
      xPercent: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: '.projects',
        start: 'top-=10% center+=20%',
        end: 'top+=20% center-=10%'
      }
    })

    gsap.from('.projects__item', {
      scale: .4,
      opacity: 0,
      rotation: 40,
      stagger: .3,
      scrollTrigger: {
        trigger: '.projects',
        start: 'top+=10% center+=20%',
        end: 'bottom-=5% top+=20%'
      }
    })
  }

  // Counters functionality and animation
  if (isElExisted('.counter')) {
    const counterLauncher = () => {

      const counter = (elSelector, durTime) => {
        let elems = document.querySelectorAll(elSelector),
          duration = durTime;

        elems.forEach(elem => {
          let final = +elem.dataset.counter,
            initial = 0,
            range = final - initial,
            increment = final > initial ? 1 : -1,
            step = Math.abs(Math.floor(duration / range)),
            timer = setInterval(() => {
              initial += increment;
              elem.textContent = initial;
              (initial == final) && clearInterval(timer);
            }, step)
        })
      }

      const counterSect = document.querySelector('.counter');
      const scrollTop = document.documentElement.scrollTop;
      const counterTop = counterSect.getBoundingClientRect().top + window.scrollY - 900;

      if (scrollTop >= counterTop) {
        counter('.counter__item-number', 3000);

        window.removeEventListener('scroll', counterLauncher);
      }
    }

    window.addEventListener('scroll', counterLauncher);

    // Animation
    gsap.from('.counter__item', {
      opacity: 0,
      xPercent: 100,
      stagger: .2,
      ease: 'back',
      scrollTrigger: {
        trigger: '.counter',
        start: 'top-=50% bottom-=20%',
        end: 'bottom top+=30%'
      }
    })
  }

  // Animation of the Blog section
  if (isElExisted('.blog__caption')) {
    gsap.from('.blog__caption', {
      xPercent: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: '.blog',
        start: 'top-=15% center+=20%',
        end: 'center-=10% top+=20%'
      }
    })
  }

  if (isElExisted('.blog__article')) {
    gsap.from('.blog__article', {
      rotation: 50,
      opacity: 0,
      stagger: .1,
      scrollTrigger: {
        trigger: '.blog',
        start: 'top+=20% bottom-=20%',
        end: 'bottom-=10% top+=30%'
      }
    })
  }

  // Animation of the Contact section
  if (isElExisted('.contact')) {
    gsap.from('.contact__body', {
      backgroundColor: 'transparent',
      duration: 1,
      scrollTrigger: {
        trigger: '.contact',
        start: 'top-=20% center+=20%'
      }
    })

    gsap.from('.contact__info', {
      yPercent: 70,
      opacity: 0,
      delay: .3,
      duration: 1,
      scrollTrigger: {
        trigger: '.contact',
        start: 'top-=20% center+=25%'
      }
    })
  }

  // Animation of the Page-caption section
  isElExisted('.page-caption') &&
    animate('.page-caption', { scale: 1.3, onComplete: () => { }, opacity: 1 });

  isElExisted('.page-caption__info') &&
    animate('.page-caption__info', { yPercent: 100, duration: 1.6, onComplete: () => { }, opacity: 1 });

  // Toggle inputs text marks and animation
  if (isElExisted('.mailbox__input')) {
    const mailboxInputs = document.querySelectorAll('.mailbox__input');

    const toggleInputMark = (input) => {
      const inputLabel = input.closest('label');
      const inputMark = inputLabel.querySelector('.mark');
      let inputValue = input.value;

      inputMark.classList.toggle('filled', inputValue.length > 0);
    }

    mailboxInputs.forEach(input => {
      toggleInputMark(input);

      input.addEventListener('input', ({ currentTarget }) => {
        inputValue = currentTarget.value;
        toggleInputMark(input);
      });
    })

    // Submit mailbox
    const mailboxForm = document.querySelector('.mailbox__form');

    mailboxForm.addEventListener('submit', (e) => {
      e.preventDefault();

      alert('Your request has been accepted. Thank you ;)');

      mailboxInputs.forEach(input => {
        input.value = ''
        setTimeout(() => toggleInputMark(input));
      });
    })
  }

  // Description of the current year
  document.querySelector('#year').innerHTML = new Date().getFullYear()

  // Inserting info block after images in Process section
  if (isElExisted('.process') && window.matchMedia('(max-width: 768px)').matches) {
    const processRow = document.querySelectorAll('.process__row')

    processRow.forEach(row => {
      row.append(row.querySelector('.process__row-heading'))
    })
  }

  // Open video popup
  if (isElExisted('.video')) {
    const videoSection = document.querySelector('.video')
    const videoPopup = document.querySelector('.video__popup')
    const videoIframe = videoPopup.querySelector('iframe')

    videoSection.addEventListener('click', ({ target }) => {
      target.closest('.video__btn') && videoPopup.classList.add('open')
      document.body.style.overflow = 'hidden'

      if (target === videoPopup) {
        target.classList.remove('open')
        document.body.style.overflow = ''
        videoIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
      }
    });
  }

  // Projects tabs
  if (isElExisted('.gallery')) {
    const tabsContentsContainer = document.querySelector('.gallery__tabs-content');
    const activeCategory = tabsContentsContainer.dataset?.activeCategory || 'all';
    mixitup(tabsContentsContainer, {
      animation: {
        duration: 500,
        queue: false
      },
      classNames: {
        block: 'tab',
      },
      load: {
        filter: activeCategory
      }
    });
  }

  // Article tags toggle
  if (isElExisted('.article-aside__tags')) {
    const tags = document.querySelectorAll('.article-aside__tag');

    tags.forEach(tag => {
      tag.addEventListener('click', ({ currentTarget }) => {
        tags.forEach(tag => tag.classList.remove('active'));
        currentTarget.classList.add('active');
      })
    })
  }

  // Skillbox dynamic progress calc
  if (isElExisted('.skillbox')) {
    const skills = document.querySelectorAll('.skillbox__item');
    const animationDur = 3000;
    let startTime = 0;

    const progressAnim = (timestamp) => {
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / animationDur, 1);

      skills.forEach(skill => {
        const percent = skill.querySelector('.skillbox__bar').dataset.percent;
        const progressLine = skill.querySelector('.skillbox__progress');
        const tooltip = skill.querySelector('.skillbox__progress-tooltip');

        const width = Math.min(progress * percent, percent);

        progressLine.style.width = `${width}% `;
        tooltip.textContent = `${Math.round(width)}% `;
      })

      progress < animationDur && requestAnimationFrame(progressAnim);
    }

    requestAnimationFrame(progressAnim);
  }

  // Teammate questions toggler
  if (isElExisted('.bio-faq .questions')) {
    faqsToggler('.question', '.question__text', 'open');
  }

  // Faqs question toggler
  if (isElExisted('.faq-section__questions')) {
    faqsToggler('.faq-section__question', '.faq-section__question-text', 'open');
  }

});