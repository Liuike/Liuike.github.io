const RESPONSE_PREVIEW_LIMIT = 4;

function shuffled(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
}

document.querySelectorAll('[data-response-section]').forEach((section) => {
    const cards = Array.from(section.querySelectorAll('[data-response-card]'));
    const showAllButton = section.querySelector('[data-show-all-responses]');
    const questionTitle = section.querySelector('.question-header h2')?.textContent || 'All responses';

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
    backButton.textContent = 'Back';

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
