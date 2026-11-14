import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSiteMotion(pathname: string): () => void {
  const mm = gsap.matchMedia();
  const cleanups: Array<() => void> = [];

  const ctx = gsap.context(() => {
    // 1. Entrada coordinada e interacción luminosa/tipográfica de portada (estilo drake-apartments)
    if (pathname === '/') {
      const heroSection = document.getElementById('hero-section');
      const heroRule = document.querySelector<HTMLElement>('[data-hero-rule]');
      const heroTitle = document.getElementById('hero-title');
      const heroLineMasks = Array.from(document.querySelectorAll<HTMLElement>('.hero-line-mask'));
      const heroLines = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-line]'));
      const interactiveChars = heroTitle
        ? Array.from(heroTitle.querySelectorAll<HTMLElement>('.hero-char:not(.hero-char-space)'))
        : [];
      const heroSupport = document.querySelector<HTMLElement>('[data-hero-support]');
      const heroCtas = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-cta]'));
      const introLayer = document.querySelector<HTMLElement>('[data-hero-intro-layer]');
      const scrollLayer = document.querySelector<HTMLElement>('[data-hero-scroll-layer]');
      const pointerLayer = document.querySelector<HTMLElement>('[data-hero-pointer-layer]');
      const ambientGlow = document.querySelector<HTMLElement>('[data-hero-ambient-glow]');

      if (heroSection) {
        let destroyedHero = false;
        let interactionArmed = false;
        let isArmedFired = false;
        let hasPointerPos = false;
        let isHeroVisible = true;
        let pointerInHero = false;
        let rafId: number | null = null;
        let resizeRafId: number | null = null;
        const lastPointer = { x: 0, y: 0 };

        const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
        const makeXTo = (el: HTMLElement) => gsap.quickTo(el, 'x', { duration: 0.24, ease: 'power3.out' });
        const makeYTo = (el: HTMLElement) => gsap.quickTo(el, 'y', { duration: 0.24, ease: 'power3.out' });
        const makeRotTo = (el: HTMLElement) => gsap.quickTo(el, 'rotation', { duration: 0.24, ease: 'power3.out' });

        // Capa aislada de parallax al desplazarse (scroll scrub independiente)
        if (scrollLayer) {
          gsap.fromTo(
            scrollLayer,
            { y: -10, scale: 1.03 },
            {
              y: 10,
              scale: 1.03,
              ease: 'none',
              scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.65,
              },
            },
          );
        }

        const hasFinePointer =
          window.matchMedia('(any-hover: hover), (any-pointer: fine), (hover: hover), (pointer: fine)').matches ||
          !('ontouchstart' in window);

        if (ambientGlow) {
          gsap.set(ambientGlow, { xPercent: -50, yPercent: -50, opacity: 0 });
        }

        interface CharItem {
          el: HTMLElement;
          offsetX: number;
          offsetY: number;
          displaced: boolean;
          returnTween: gsap.core.Tween | null;
          xTo: ReturnType<typeof makeXTo> | null;
          yTo: ReturnType<typeof makeYTo> | null;
          rotTo: ReturnType<typeof makeRotTo> | null;
        }

        const charItems: CharItem[] = interactiveChars.map((el) => ({
          el,
          offsetX: 0,
          offsetY: 0,
          displaced: false,
          returnTween: null,
          xTo: hasFinePointer ? makeXTo(el) : null,
          yTo: hasFinePointer ? makeYTo(el) : null,
          rotTo: hasFinePointer ? makeRotTo(el) : null,
        }));

        const measureCharRestPositions = () => {
          if (destroyedHero || !heroTitle || charItems.length === 0) return;
          const titleRect = heroTitle.getBoundingClientRect();
          charItems.forEach((item) => {
            const rect = item.el.getBoundingClientRect();
            const curX = Number(gsap.getProperty(item.el, 'x')) || 0;
            const curY = Number(gsap.getProperty(item.el, 'y')) || 0;
            item.offsetX = rect.left + rect.width * 0.5 - curX - titleRect.left;
            item.offsetY = rect.top + rect.height * 0.5 - curY - titleRect.top;
          });
        };

        const restoreCharToOrigin = (item: CharItem) => {
          if (!item.displaced && !item.returnTween) return;
          item.displaced = false;
          if (item.returnTween) {
            item.returnTween.kill();
            item.returnTween = null;
          }
          gsap.killTweensOf(item.el);
          item.returnTween = gsap.to(item.el, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.68,
            ease: 'elastic.out(1.1, 0.5)',
            overwrite: 'auto',
            onComplete: () => {
              item.returnTween = null;
              if (!destroyedHero) {
                gsap.set(item.el, { clearProps: 'transform' });
              }
            },
          });
        };

        const imgXTo =
          hasFinePointer && pointerLayer
            ? gsap.quickTo(pointerLayer, 'x', { duration: 0.55, ease: 'power3.out' })
            : null;
        const imgYTo =
          hasFinePointer && pointerLayer
            ? gsap.quickTo(pointerLayer, 'y', { duration: 0.55, ease: 'power3.out' })
            : null;
        const glowXTo =
          hasFinePointer && ambientGlow
            ? gsap.quickTo(ambientGlow, 'x', { duration: 0.45, ease: 'power2.out' })
            : null;
        const glowYTo =
          hasFinePointer && ambientGlow
            ? gsap.quickTo(ambientGlow, 'y', { duration: 0.45, ease: 'power2.out' })
            : null;
        const glowOpacityTo =
          hasFinePointer && ambientGlow
            ? gsap.quickTo(ambientGlow, 'opacity', { duration: 0.38, ease: 'power2.out' })
            : null;

        const resetPointerTargets = () => {
          pointerInHero = false;
          if (imgXTo && imgYTo) {
            imgXTo(0);
            imgYTo(0);
          }
          if (glowOpacityTo) {
            glowOpacityTo(0);
          }
          charItems.forEach(restoreCharToOrigin);
        };

        const applyPointerFrame = () => {
          rafId = null;
          if (destroyedHero || !interactionArmed || !hasFinePointer || document.hidden || !isHeroVisible) return;

          const heroRect = heroSection.getBoundingClientRect();
          const insideHero =
            lastPointer.x >= heroRect.left &&
            lastPointer.x <= heroRect.right &&
            lastPointer.y >= heroRect.top &&
            lastPointer.y <= heroRect.bottom;

          if (!insideHero || heroRect.width <= 0 || heroRect.height <= 0) {
            if (pointerInHero) resetPointerTargets();
            return;
          }

          pointerInHero = true;

          // 1. Desplazamiento arquitectónico suave del fondo (±16 px X / ±12 px Y)
          if (imgXTo && imgYTo) {
            const nx = clamp(((lastPointer.x - heroRect.left) / heroRect.width) * 2 - 1, -1, 1);
            const ny = clamp(((lastPointer.y - heroRect.top) / heroRect.height) * 2 - 1, -1, 1);
            imgXTo(-nx * 16);
            imgYTo(-ny * 12);
          }

          // 2. Halo luminoso ambiental sutil que acompaña el puntero sobre la escena
          if (glowXTo && glowYTo && glowOpacityTo) {
            glowXTo(lastPointer.x - heroRect.left);
            glowYTo(lastPointer.y - heroRect.top);
            glowOpacityTo(0.88);
          }

          // 3. Dispersión y recomposición elástica letra a letra sobre el titular
          if (!heroTitle || charItems.length === 0) return;
          const titleRect = heroTitle.getBoundingClientRect();
          const RADIUS = 160;
          const MAX_OFFSET = 19;
          const MAX_ROT = 4.8;

          if (
            lastPointer.x < titleRect.left - RADIUS ||
            lastPointer.x > titleRect.right + RADIUS ||
            lastPointer.y < titleRect.top - RADIUS ||
            lastPointer.y > titleRect.bottom + RADIUS
          ) {
            charItems.forEach(restoreCharToOrigin);
            return;
          }

          charItems.forEach((item) => {
            const origX = titleRect.left + item.offsetX;
            const origY = titleRect.top + item.offsetY;
            const dx = origX - lastPointer.x;
            const dy = origY - lastPointer.y;
            const dist = Math.hypot(dx, dy);

            if (dist < RADIUS) {
              const t = 1 - dist / RADIUS;
              const falloff = t * t * (3 - 2 * t);
              const ux = dist > 1 ? dx / dist : 0;
              const uy = dist > 1 ? dy / dist : -1;
              const targetX = ux * MAX_OFFSET * falloff;
              const targetY = uy * MAX_OFFSET * falloff;
              const targetRot = clamp(ux * MAX_ROT * falloff - uy * 1.4 * falloff, -5.2, 5.2);

              if (item.returnTween) {
                item.returnTween.kill();
                item.returnTween = null;
                item.xTo = makeXTo(item.el);
                item.yTo = makeYTo(item.el);
                item.rotTo = makeRotTo(item.el);
              }

              item.displaced = true;
              item.xTo?.(targetX);
              item.yTo?.(targetY);
              item.rotTo?.(targetRot);
            } else if (item.displaced) {
              restoreCharToOrigin(item);
            }
          });
        };

        const schedulePointerUpdate = () => {
          if (destroyedHero || !interactionArmed || !hasFinePointer || document.hidden || !isHeroVisible) return;
          if (rafId !== null) return;
          rafId = requestAnimationFrame(applyPointerFrame);
        };

        if (hasFinePointer) {
          const onPointerMove = (e: MouseEvent | PointerEvent) => {
            if ('pointerType' in e && e.pointerType === 'touch') return;
            hasPointerPos = true;
            lastPointer.x = e.clientX;
            lastPointer.y = e.clientY;
            schedulePointerUpdate();
          };

          const onLeaveOrHide = () => {
            hasPointerPos = false;
            resetPointerTargets();
          };

          const onVisibilityChange = () => {
            if (document.hidden) {
              resetPointerTargets();
            } else {
              measureCharRestPositions();
            }
          };

          const onResize = () => {
            if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
            charItems.forEach((item) => {
              item.displaced = false;
              if (item.returnTween) {
                item.returnTween.kill();
                item.returnTween = null;
              }
              gsap.killTweensOf(item.el);
              gsap.set(item.el, { clearProps: 'transform' });
              item.xTo = makeXTo(item.el);
              item.yTo = makeYTo(item.el);
              item.rotTo = makeRotTo(item.el);
            });
            if (imgXTo && imgYTo) {
              imgXTo(0);
              imgYTo(0);
            }
            if (glowOpacityTo) glowOpacityTo(0);
            resizeRafId = requestAnimationFrame(() => {
              resizeRafId = null;
              measureCharRestPositions();
            });
          };

          window.addEventListener('pointermove', onPointerMove, { passive: true });
          window.addEventListener('mousemove', onPointerMove, { passive: true });
          heroSection.addEventListener('pointerleave', onLeaveOrHide, { passive: true });
          heroSection.addEventListener('mouseleave', onLeaveOrHide, { passive: true });
          document.documentElement.addEventListener('mouseleave', onLeaveOrHide, { passive: true });
          window.addEventListener('blur', onLeaveOrHide);
          window.addEventListener('resize', onResize, { passive: true });
          document.addEventListener('visibilitychange', onVisibilityChange);

          let heroObserver: IntersectionObserver | null = null;
          if ('IntersectionObserver' in window) {
            heroObserver = new IntersectionObserver(
              (entries) => {
                const entry = entries[0];
                if (!entry) return;
                isHeroVisible = entry.isIntersecting;
                if (!isHeroVisible) resetPointerTargets();
              },
              { threshold: 0.02 },
            );
            heroObserver.observe(heroSection);
          }

          if (document.fonts?.ready) {
            document.fonts.ready.then(() => {
              if (!destroyedHero && interactionArmed) measureCharRestPositions();
            });
          }

          cleanups.push(() => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('mousemove', onPointerMove);
            heroSection.removeEventListener('pointerleave', onLeaveOrHide);
            heroSection.removeEventListener('mouseleave', onLeaveOrHide);
            document.documentElement.removeEventListener('mouseleave', onLeaveOrHide);
            window.removeEventListener('blur', onLeaveOrHide);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            heroObserver?.disconnect();
          });
        }

        const armHeroInteraction = () => {
          if (destroyedHero || isArmedFired) return;
          isArmedFired = true;
          heroLineMasks.forEach((mask) => mask.classList.add('is-settled'));
          interactionArmed = true;
          measureCharRestPositions();
          if (hasPointerPos) {
            schedulePointerUpdate();
          }
        };

        const introTl = gsap.timeline({
          onComplete: armHeroInteraction,
        });

        if (introLayer) {
          introTl.fromTo(
            introLayer,
            { scale: 1.08 },
            { scale: 1, duration: 1.25, ease: 'power3.out', clearProps: 'transform' },
            0,
          );
        }

        if (heroRule) {
          introTl.fromTo(
            heroRule,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,opacity' },
            0.06,
          );
        }

        if (heroLines.length > 0) {
          introTl.fromTo(
            heroLines,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.82,
              stagger: 0.14,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            },
            0.1,
          );
        }

        if (interactiveChars.length > 0) {
          introTl.fromTo(
            interactiveChars,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.62,
              stagger: 0.022,
              ease: 'back.out(1.6)',
              clearProps: 'transform,opacity',
              onComplete: armHeroInteraction,
            },
            0.14,
          );
        }

        if (heroSupport) {
          introTl.fromTo(
            heroSupport,
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.56, ease: 'power2.out', clearProps: 'transform,opacity' },
            0.34,
          );
        }

        if (heroCtas.length > 0) {
          introTl.fromTo(
            heroCtas,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.52,
              stagger: 0.08,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            },
            0.42,
          );
        }

        cleanups.push(() => {
          destroyedHero = true;
          if (rafId !== null) cancelAnimationFrame(rafId);
          if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
          introTl.kill();
          charItems.forEach((item) => {
            item.returnTween?.kill();
          });
          gsap.killTweensOf(
            [introLayer, scrollLayer, pointerLayer, ambientGlow, ...interactiveChars, ...heroLines].filter(
              (node): node is HTMLElement => Boolean(node),
            ),
          );
        });
      }
    } else {
      // 2. Entrada coordinada en páginas interiores
      const pageHero = document.querySelector<HTMLElement>('.page-hero-section');
      if (pageHero) {
        const targets = Array.from(
          pageHero.querySelectorAll<HTMLElement>('.breadcrumb, .section-eyebrow, .page-title, .page-lead, .detail-header-aside'),
        );
        if (targets.length > 0) {
          gsap.fromTo(
            targets,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.065,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            },
          );
        }
      }
    }

    // 3. Sistema compartido de despliegue suave de imágenes en todas las secciones
    const containers = Array.from(document.querySelectorAll<HTMLElement>('[data-animate-image]'));
    if (containers.length > 0) {
      const viewportThreshold = window.innerHeight * 0.94;
      const aboveFold: HTMLElement[] = [];
      const belowFold: HTMLElement[] = [];

      containers.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportThreshold) {
          aboveFold.push(el);
        } else {
          belowFold.push(el);
        }
      });

      const animateImageNode = (el: HTMLElement, delay: number, duration: number, offsetY: number) => {
        const innerImg = el.querySelector<HTMLImageElement>('img');
        gsap.fromTo(
          el,
          { y: offsetY, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration,
            delay,
            ease: 'power3.out',
            overwrite: 'auto',
            clearProps: 'transform,opacity,clipPath',
          },
        );

        if (innerImg) {
          gsap.fromTo(
            innerImg,
            { scale: 1.14, filter: 'brightness(0.9)' },
            {
              scale: 1,
              filter: 'brightness(1)',
              duration: duration + 0.25,
              delay,
              ease: 'power3.out',
              overwrite: 'auto',
              clearProps: 'transform,filter',
            },
          );
        }
      };

      // Imágenes visibles al entrar en la ruta seleccionada desde el menú
      aboveFold.forEach((el, idx) => {
        const delay = Math.min(0.46, 0.14 + idx * 0.1);
        animateImageNode(el, delay, 1.05, 28);
      });

      // Imágenes inferiores desplegadas suavemente una única vez al entrar en el viewport
      if (belowFold.length > 0) {
        belowFold.forEach((el) => {
          gsap.set(el, { y: 34, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' });
          const innerImg = el.querySelector<HTMLImageElement>('img');
          if (innerImg) {
            gsap.set(innerImg, { scale: 1.14, filter: 'brightness(0.9)' });
          }
        });

        ScrollTrigger.batch(belowFold, {
          start: 'top 92%',
          once: true,
          interval: 0.08,
          batchMax: 3,
          onEnter: (batch: Element[]) => {
            batch.forEach((el, idx) => {
              animateImageNode(el as HTMLElement, Math.min(0.28, idx * 0.09), 1.05, 34);
            });
          },
        });
      }
    }

    // Planeo sutil sobre fotografías al pasar el mouse en escritorio
    mm.add('(min-width: 1024px)', () => {
      const plates = Array.from(document.querySelectorAll<HTMLElement>('[data-animate-image]'));
      const hoverCleanups: Array<() => void> = [];

      plates.forEach((plate) => {
        const innerImg = plate.querySelector<HTMLImageElement>('img');
        if (!innerImg) return;

        const onEnter = (event: PointerEvent) => {
          if (event.pointerType === 'touch') return;
          gsap.to(innerImg, {
            scale: 1.045,
            filter: 'brightness(1.04) contrast(1.02)',
            duration: 0.85,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        const onLeave = (event: PointerEvent) => {
          if (event.pointerType === 'touch') return;
          gsap.to(innerImg, {
            scale: 1,
            filter: 'brightness(1) contrast(1)',
            duration: 0.85,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        plate.addEventListener('pointerenter', onEnter);
        plate.addEventListener('pointerleave', onLeave);
        hoverCleanups.push(() => {
          plate.removeEventListener('pointerenter', onEnter);
          plate.removeEventListener('pointerleave', onLeave);
        });
      });

      return () => {
        hoverCleanups.forEach((fn) => fn());
      };
    });
  });

  // Recalcular ScrollTrigger tras la carga de fuentes e imágenes
  let destroyed = false;
  const refreshTriggers = () => {
    if (!destroyed) {
      ScrollTrigger.refresh();
    }
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(refreshTriggers);
  }

  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('#main-content img'));
  imgs.forEach((img) => {
    if (!img.complete) {
      img.addEventListener('load', refreshTriggers, { once: true });
      cleanups.push(() => img.removeEventListener('load', refreshTriggers));
    }
  });

  return () => {
    destroyed = true;
    cleanups.forEach((fn) => fn());
    mm.revert();
    ctx.revert();
  };
}
