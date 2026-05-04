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
            cards.forEach((card) => {
                card.hidden = false;
            });
            showAllButton.hidden = true;
        });
    }
});
