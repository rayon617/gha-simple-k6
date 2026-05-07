import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const DP_TOKEN_URL = __ENV.DP_TOKEN_URL;

function getToken() {
    if (!DP_TOKEN_URL) {
        throw new Error('DP_TOKEN_URL not set');
    }

    const payload = JSON.stringify({
        NetbankId: 'TESTUSER001'
    });

    const res = http.post(DP_TOKEN_URL, payload, {
        headers: { 'Content-Type': 'application/json' }
    });

    check(res, {
        'token api success': (r) => r.status === 200
    });

    try {
        return JSON.parse(res.body).DpTok;
    } catch (e) {
        return null;
    }
}

export default function () {

    const token = getToken();

    const res = http.get(`${BASE_URL}/property/favourites`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
