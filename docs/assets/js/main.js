const RESPONSE_PREVIEW_LIMIT = 4;
const SUPPORTED_LANGUAGES = ['en', 'es', 'pt'];
const LANGUAGE_STORAGE_KEY = 'narratives-language';
const INITIAL_TITLE = document.title;
const TITLE_SUFFIX = INITIAL_TITLE.includes(' · ')
    ? INITIAL_TITLE.split(' · ').slice(1).join(' · ')
    : '';

let currentLanguage = 'en';

function shuffled(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
}

function getVisibleLanguageText(container, fallback = '') {
    const current = container.querySelector(`[data-lang-content="${currentLanguage}"]`);

    if (current) {
        return current.textContent.trim();
    }

    const english = container.querySelector('[data-lang-content="en"]');
    if (english) {
        return english.textContent.trim();
    }

    return fallback;
}

function applyLanguage(language) {
    const nextLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'en';
    currentLanguage = nextLanguage;

    document.documentElement.lang = nextLanguage;
    document.querySelectorAll('[data-lang-content]').forEach((node) => {
        node.hidden = node.dataset.langContent !== nextLanguage;
    });

    document.querySelectorAll('[data-language-option]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.language === nextLanguage);
        button.setAttribute('aria-pressed', button.dataset.language === nextLanguage ? 'true' : 'false');
    });

    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
        // Ignore localStorage errors (private mode, security restrictions).
    }

    const currentTitle = document.querySelector('.narratives-hero h1');
    if (currentTitle) {
        const localizedTitle = getVisibleLanguageText(currentTitle, INITIAL_TITLE);
        document.title = TITLE_SUFFIX ? `${localizedTitle} · ${TITLE_SUFFIX}` : localizedTitle;
    }
}

function initializeLanguageToggle() {
    const defaultLanguage = SUPPORTED_LANGUAGES.includes(document.documentElement.lang)
        ? document.documentElement.lang
        : 'en';
    let savedLanguage = defaultLanguage;

    try {
        const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (SUPPORTED_LANGUAGES.includes(storedLanguage)) {
            savedLanguage = storedLanguage;
        }
    } catch (error) {
        // Ignore localStorage errors (private mode, security restrictions).
    }

    document.querySelectorAll('[data-language-option]').forEach((button) => {
        button.addEventListener('click', () => {
            applyLanguage(button.dataset.language || 'en');
        });
    });

    applyLanguage(savedLanguage);
}

function hardenResponseLinks(container = document) {
    container.querySelectorAll('.response-body a').forEach((anchor) => {
        const href = anchor.getAttribute('href') || '';

        let parsed;
        try {
            parsed = new URL(href, window.location.origin);
        } catch (error) {
            const textNode = document.createTextNode(anchor.textContent || href);
            anchor.replaceWith(textNode);
            return;
        }

        const allowedProtocols = ['http:', 'https:', 'mailto:'];
        if (!allowedProtocols.includes(parsed.protocol)) {
            const textNode = document.createTextNode(anchor.textContent || href);
            anchor.replaceWith(textNode);
            return;
        }

        const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:';
        const isExternal = parsed.origin !== window.location.origin;

        if (isHttp && isExternal) {
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

document.querySelectorAll('[data-response-section]').forEach((section) => {
    const cards = Array.from(section.querySelectorAll('[data-response-card]'));
    const showAllButton = section.querySelector('[data-show-all-responses]');
    const questionTitleElement = section.querySelector('.question-header h2');
    const fallbackTitle = 'All responses';

    if (cards.length <= RESPONSE_PREVIEW_LIMIT) {
        if (showAllButton) {
            showAllButton.hidden = true;
        }
        return;
    }

    const endorsedCards = cards.filter((card) => card.dataset.endorsed === 'true');
    const regularCards = cards.filter((card) => card.dataset.endorsed !== 'true');
    const regularSlots = Math.max(RESPONSE_PREVIEW_LIMIT - endorsedCards.length, 0);
    const visibleCards = new Set([
        ...endorsedCards,
        ...shuffled(regularCards).slice(0, regularSlots),
    ]);

    cards.forEach((card) => {
        const shouldShow = visibleCards.has(card);
        card.hidden = !shouldShow;

        if (!shouldShow) {
            card.open = false;
        }
    });

    if (showAllButton) {
        showAllButton.addEventListener('click', () => {
            const questionTitle = questionTitleElement
                ? getVisibleLanguageText(questionTitleElement, fallbackTitle)
                : fallbackTitle;
            openResponsesModal(questionTitle, cards, showAllButton);
        });
    }
});

function openResponsesModal(questionTitle, cards, returnFocusTarget) {
    const overlay = document.createElement('div');
    overlay.className = 'responses-modal-overlay';
    overlay.setAttribute('role', 'presentation');

    const modal = document.createElement('div');
    modal.className = 'responses-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'responses-modal-title');

    const title = document.createElement('h2');
    title.id = 'responses-modal-title';
    title.textContent = questionTitle;

    const header = document.createElement('div');
    header.className = 'responses-modal-header';
    header.appendChild(title);

    const backButton = document.createElement('button');
    backButton.className = 'responses-modal-back';
    backButton.type = 'button';
    const globalToggle = document.querySelector('.language-toggle');
    const backFallback = 'Back';
    if (globalToggle) {
        const labelMap = {
            en: 'Back',
            es: 'Volver',
            pt: 'Voltar',
        };
        backButton.textContent = labelMap[currentLanguage] || backFallback;
    } else {
        backButton.textContent = backFallback;
    }

    const footer = document.createElement('div');
    footer.className = 'responses-modal-footer';
    footer.appendChild(backButton);

    const list = document.createElement('div');
    list.className = 'responses-modal-list';

    cards.forEach((card) => {
        const cardCopy = card.cloneNode(true);
        cardCopy.hidden = false;
        cardCopy.open = false;
        list.appendChild(cardCopy);
    });

    modal.append(header, list, footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.classList.add('responses-modal-open');
    hardenResponseLinks(overlay);

    const closeOnEscape = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };

    const closeModal = () => {
        document.removeEventListener('keydown', closeOnEscape);
        overlay.remove();
        document.body.classList.remove('responses-modal-open');
        returnFocusTarget.focus();
    };

    backButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', closeOnEscape);

    backButton.focus();
}

initializeLanguageToggle();
hardenResponseLinks();
