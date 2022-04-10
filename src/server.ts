import APP from '.';
import ENV from './constants/env';

APP.listen(ENV.PORT || 3000, (err) => {
    if (err) throw err;
});
