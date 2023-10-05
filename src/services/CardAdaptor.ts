export default class CardAdaptor {
    image_front: string;
    image_back: string;
    name: string;
    type_id: string;
    number: string;
    note: string;

    constructor(card: {
        image_front: string;
        image_back?: string;
        name?: string;
        type_id: string;
        number?: string;
        note?: string;
    }) {
        this.image_front = card.image_front;
        this.image_back = card.image_back || '';
        this.name = card.name || '';
        this.type_id = card.type_id;
        this.number = card.number || '';
        this.note = card.note || '';
    }
}
