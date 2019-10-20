export const CARD_STYLES = {
    GOLDEN: 0,
    POST_IT: 1
};

export const CREATION_OFFSET_STEP = 20;

export const CARD_TYPES_TO_CLASSNAMES = {
    [CARD_STYLES.GOLDEN]: 'goldenRatio',
    [CARD_STYLES.POST_IT]: 'postit'
};

export const EMPTY_CARD = {
    id: -1,
    title: 'New Card',
    content: 'Empty content',
    index: 1,
    tags: [],
    position: {
        x: 200,
        y: 200
    }
};

export const TAGS = {
    REMOVED: 0
};