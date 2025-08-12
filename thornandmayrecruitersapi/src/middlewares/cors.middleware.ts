import cors, { CorsOptions } from 'cors';

const whitelist = [
    'http://example1.com',
    'http://example2.com'
];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

export default cors(corsOptions);
