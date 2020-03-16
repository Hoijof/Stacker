import { TAGS } from '../constants';

export default {
    type: 0,
    grid: false,
    cards: [
        {
            id: 1,
            title: "Welcome to Stacker",
            content: "Do stuff bla bla bla",
            index: 1,
            tags: [TAGS.ALL, TAGS.PENDING],
            position: {
                x: 200,
                y: 200
            }
        },
        {
            id: 2,
            title: "Shortcuts",
            content: `Always press 'ctrl' or 'cmd' key :D
            e: Edit selected card
            i: Create new card
            d: Delete selected card
            z: undo last removed card
            s: save
            c: complete / uncomplete card`,
            
            index: 4,
            tags: [TAGS.ALL, TAGS.PENDING],
            position: {
                x: 360,
                y: 800
            }
        }
    ]
};