import * as uuid from 'uuid';

export const products = [
    {
        id: uuid.v4(),
        description: '88-Key Weighted Digital Piano',
        title: 'Yamaha P45',
        price: 400
    },
    {
        id: uuid.v4(),
        description: '88-Key Weighted Digital Piano, White',
        title: 'Yamaha P515',
        price: 450
    },
    {
        id: uuid.v4(),
        description: '61-Key Lightweight Portable Keyboard, Black (Power Adapter Sold Separately)',
        title: 'Yamaha NP12',
        price: 500
    },
    {
        id: uuid.v4(),
        description: '76-key Portable Keyboard with Power Supply',
        title: 'Yamaha PSR-EW310',
        price: 400
    },
    {
        id: uuid.v4(),
        description: '88-Key Weighted Digital Piano',
        title: 'Yamaha PSR-E273',
        price: 710
    },
    {
        id: uuid.v4(),
        description: '76-Key Synthesizer Workstation, Black & FC4A Assignable Piano Sustain Foot Pedal,MultiColored',
        title: 'Yamaha MODX7',
        price: 650
    },
    {
        id: uuid.v4(),
        description: 'Arius Series Console Digital Piano with Bench, Dark Rosewood & amaha UDWL01 WiFi USB/MIDI Adapter',
        title: 'Yamaha YDP184',
        price: 400
    },
];

export const requestItems = products.map((product) => {
    return {
        PutRequest: {
            Item: {
                id: product.id,
                description: product.description,
                title: product.title,
                price: product.price.toString()
            }
        }
    }
});