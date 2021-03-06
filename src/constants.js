export const CARD_STYLES = {
    GOLDEN: 0,
    POST_IT: 1
};

export const CREATION_OFFSET_STEP = 20;

export const CARD_TYPES_TO_CLASSNAMES = {
    [CARD_STYLES.GOLDEN]: 'goldenRatio',
    [CARD_STYLES.POST_IT]: 'postit'
};

export const TAGS = {
    REMOVED: 'Removed',
    COMPLETED: 'Completed',
    PENDING: 'Pending',
    ALL: 'All',
};

export const EMPTY_CARD = {
    id: -1,
    title: 'New Card',
    content: 'Empty content',
    index: 1,
    tags: [TAGS.ALL, TAGS.PENDING],
    position: {
        x: 200,
        y: 200
    }
};



export const LOCAL_STORAGE_KEY = 'stacker-reborn';

export const SERVER_URL = 'http://goirs.me:3003';