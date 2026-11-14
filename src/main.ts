import gsap from 'gsap';
import './styles/main.css';
import { renderFullAppShell, resolveRoute } from './router';
import { initSideMenuController, type SideMenuController } from './components/sideMenu';
import { initLightboxController } from './components/lightbox';
import { initRegionalMapInteractions } from './components/regionalMap';
import { initSiteMotion } from './animations/motion';
import { contactService, validateContactPayload, type ContactValidationErrors } from './services/contactService';

let cleanupMotion: (() => void) | null = null;
let cleanupMap: (() => void) | null = null;
let cleanupForm: (() => void) | null = null;
let cleanupHeaderScroll: (() => void) | null = null;
let sideMenuController: SideMenuController | null = null;

function updateHeadMetadata(title: string, description: string): void {
  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description);
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title);
  }
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', description);
  }
}

function setupHeaderScrollState(isDarkHero: boolean): () => void {
  const header = document.getElementById('site-header');
  if (!header) return () => undefined;

  const update = () => {
    if (!isDarkHero) {
      header.classList.remove('is-scrolled');
      return;
    }
    header.classList.toggle('is-scrolled', window.scrollY > 48);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });

  return () => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  };
}

function initContactFormController(): () => void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return () => undefined;

  const fullNameInput = document.getElementById('contact-fullname') as HTMLInputElement | null;
  const emailInput = document.getElementById('contact-email') as HTMLInputElement | null;
  const phoneInput = document.getElementById('contact-phone') as HTMLInputElement | null;
  const messageInput = document.getElementById('contact-message') as HTMLTextAreaElement | null;
  const honeypotInput = document.getElementById('contact-company-website') as HTMLInputElement | null;
  const feedbackEl = document.getElementById('contact-form-feedback');

  const errorEls: Record<keyof ContactValidationErrors, HTMLElement | null> = {
    fullName: document.getElementById('contact-fullname-error'),
    email: document.getElementById('contact-email-error'),
    phone: document.getElementById('contact-phone-error'),
    message: document.getElementById('contact-message-error'),
  };

  const applyFieldErrors = (errors: ContactValidationErrors) => {
    const map: Array<[keyof ContactValidationErrors, HTMLInputElement | HTMLTextAreaElement | null]> = [
      ['fullName', fullNameInput],
      ['email', emailInput],
      ['phone', phoneInput],
      ['message', messageInput],
    ];

    map.forEach(([key, input]) => {
      const msg = errors[key] ?? '';
      const errEl = errorEls[key];
      if (errEl) {
        errEl.textContent = msg;
      }
      if (input) {
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      }
    });
  };

  const readPayload = () => ({
    fullName: fullNameInput?.value ?? '',
    email: emailInput?.value ?? '',
    phone: phoneInput?.value ?? '',
    message: messageInput?.value ?? '',
    honeypot: honeypotInput?.value ?? '',
  });

  const onInput = () => {
    if (!feedbackEl?.hasAttribute('hidden')) {
      const errors = validateContactPayload(readPayload());
      applyFieldErrors(errors);
    }
  };

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const payload = readPayload();
    const result = await contactService.submit(payload);
    applyFieldErrors(result.errors ?? {});

    if (feedbackEl) {
      feedbackEl.removeAttribute('hidden');
      feedbackEl.textContent = result.message;
      feedbackEl.className = `form-feedback-banner is-${result.status}`;
    }
  };

  form.addEventListener('submit', onSubmit);
  form.addEventListener('input', onInput);

  return () => {
    form.removeEventListener('submit', onSubmit);
    form.removeEventListener('input', onInput);
  };
}

function mountRouteFeatures(normalizedPath: string, isDarkHero: boolean): void {
  cleanupMotion?.();
  cleanupMap?.();
  cleanupForm?.();
  cleanupHeaderScroll?.();

  cleanupHeaderScroll = setupHeaderScrollState(isDarkHero);
  cleanupMap = initRegionalMapInteractions();
  cleanupForm = initContactFormController();
  cleanupMotion = initSiteMotion(normalizedPath);
  sideMenuController?.updateCurrentPath(normalizedPath);
}

function navigateTo(targetHref: string, pushHistory = true): void {
  const url = new URL(targetHref, window.location.origin);
  if (url.origin !== window.location.origin) return;

  const resolved = resolveRoute(url.pathname);
  sideMenuController?.close({ restoreScroll: false, returnFocus: false });

  if (pushHistory && window.location.pathname !== resolved.normalizedPath) {
    window.history.pushState({ path: resolved.normalizedPath }, '', resolved.normalizedPath);
  }

  updateHeadMetadata(resolved.meta.title, resolved.meta.description);

  const mainEl = document.getElementById('main-content');
  const headerEl = document.getElementById('site-header');
  if (mainEl && headerEl) {
    headerEl.classList.toggle('site-header--hero-dark', resolved.isDarkHero);
    headerEl.classList.toggle('site-header--solid-light', !resolved.isDarkHero);
    headerEl.setAttribute('data-dark-hero', resolved.isDarkHero ? 'true' : 'false');
    mainEl.innerHTML = resolved.mainHtml;
  } else {
    const appRoot = document.getElementById('app');
    if (appRoot) {
      appRoot.innerHTML = renderFullAppShell(resolved);
      sideMenuController?.destroy();
      sideMenuController = initSideMenuController();
    }
  }

  window.scrollTo(0, 0);
  mountRouteFeatures(resolved.normalizedPath, resolved.isDarkHero);

  const activeMain = document.getElementById('main-content');
  if (activeMain) {
    gsap.killTweensOf(activeMain);
    gsap.fromTo(
      activeMain,
      { opacity: 0.01, y: 10 },
      { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out', clearProps: 'transform,opacity' },
    );
  }

  if (pushHistory) {
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }
}

function bootstrap(): void {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  const resolved = resolveRoute(window.location.pathname);
  updateHeadMetadata(resolved.meta.title, resolved.meta.description);

  // Render initial shell if not already pre-rendered
  const existingMain = appRoot.querySelector('#main-content');
  if (!existingMain) {
    appRoot.innerHTML = renderFullAppShell(resolved);
  }

  sideMenuController = initSideMenuController();
  initLightboxController();
  mountRouteFeatures(resolved.normalizedPath, resolved.isDarkHero);

  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const link = target?.closest<HTMLAnchorElement>('a[data-nav-link]');
    if (!link) return;

    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      link.target === '_blank'
    ) {
      return;
    }

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      return;
    }

    event.preventDefault();
    navigateTo(href, true);
  });

  window.addEventListener('popstate', () => {
    navigateTo(window.location.pathname, false);
  });
}

bootstrap();
