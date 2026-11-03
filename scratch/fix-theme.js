const fs = require('fs');

let css = fs.readFileSync('src/styles/services/mobile-app-development.css', 'utf8');

// Normalize CRLF to LF
const norm = s => s.replace(/\r\n/g, '\n');
css = norm(css);

// 1. ma-demo-yellow
css = css.replace('--ma-demo-yellow: #f5b83d;', '--ma-demo-yellow: #ffe401;');

// 2. ma-demo__track-pill
const trackOld = `.ma-demo__track-pill em {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
    padding: 5px 9px;
    border-radius: 99px;
    background: #fff4d6;
    color: #7a5300;
    font-size: 10.5px;
    font-style: normal;
}`;

const trackNew = `.ma-demo__track-pill em {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
    padding: 5px 9px;
    border-radius: 99px;
    background: #ffe401;
    color: #100563;
    font-weight: 700;
    font-size: 10.5px;
    font-style: normal;
}`;
css = css.replace(norm(trackOld), norm(trackNew));

// 3. board variables
css = css.replace('--yellow: #f5b83d;', '--yellow: #ffe401;');
css = css.replace('--yellow-soft: #fff4d6;', '--yellow-soft: #fffde6;');
css = css.replace('--yellow-ink: #7a5300;', '--yellow-ink: #100563;');

// 4. ma-slide__type
const slideTypeOld = `.ma-slide__type {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 13px;
    border-radius: 999px;
    background: #fff4d6;
    color: #7a5300;
    border: 1px solid rgba(245, 184, 61, 0.55);
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0 0 12px;
    width: fit-content;
}`;

const slideTypeNew = `.ma-slide__type {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 999px;
    background: #ffe401;
    color: #100563;
    border: 1px solid rgba(16, 5, 99, 0.12);
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0 0 12px;
    width: fit-content;
}`;
css = css.replace(norm(slideTypeOld), norm(slideTypeNew));

// 5. ma-slide__cap li:hover
const slideHoverOld = `.ma-slide__cap li:hover {
    background: #fff4d6;
    color: #7a5300;
    border-color: #f5b83d;
    transform: translateY(-1px);
}`;

const slideHoverNew = `.ma-slide__cap li:hover {
    background: #ffe401;
    color: #100563;
    border-color: #ffe401;
    transform: translateY(-1px);
}`;
css = css.replace(norm(slideHoverOld), norm(slideHoverNew));

// 6. Platform tabs & arrow
const platTabsOld = `.ma-plat__tab-arrow {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f1f5f9;
    color: #64748b;
    flex-shrink: 0;
    transition: all 0.25s ease;
}

.ma-plat__tabs button:hover {
    border-color: #f5b83d;
    transform: translateX(4px);
    box-shadow: 0 8px 24px -10px rgba(16, 5, 99, 0.12);
}

.ma-plat__tabs button:hover .ma-plat__tab-arrow {
    background: #fff4d6;
    color: #7a5300;
    transform: translateX(2px);
}

.ma-plat__tabs button.on {
    border-color: #f5b83d;
    background: #fffdf5;
    transform: translateX(8px);
    box-shadow: 0 16px 36px -16px rgba(16, 5, 99, 0.16), 0 0 0 1px #f5b83d;
}

.ma-plat__tabs button.on .ma-plat__tab-arrow {
    background: #ffe401;
    color: #100563;
    transform: translateX(3px);
}`;

const platTabsNew = `.ma-plat__tab-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f1f5f9;
    color: #64748b;
    flex-shrink: 0;
    transition: background 0.25s ease, color 0.25s ease;
}

.ma-plat__tab-arrow svg {
    display: block;
    margin-left: 2px;
    transition: transform 0.25s ease;
}

.ma-plat__tabs button:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
    box-shadow: 0 6px 18px -6px rgba(16, 5, 99, 0.08);
}

.ma-plat__tabs button:hover .ma-plat__tab-arrow {
    background: #ffe401;
    color: #100563;
}

.ma-plat__tabs button:hover .ma-plat__tab-arrow svg {
    transform: translateX(1.5px);
}

.ma-plat__tabs button.on {
    border-color: #ffe401;
    background: #ffffff;
    box-shadow: 0 0 0 2px #ffe401, 0 10px 24px -10px rgba(16, 5, 99, 0.12);
}

.ma-plat__tabs button.on .ma-plat__tab-arrow {
    background: #ffe401;
    color: #100563;
}

.ma-plat__tabs button.on .ma-plat__tab-arrow svg {
    transform: translateX(1.5px);
}`;
css = css.replace(norm(platTabsOld), norm(platTabsNew));

// 7. ma-plat__best b
const bestOld = `.ma-plat__best b {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: fit-content;
    padding: 4px 12px;
    border-radius: 999px;
    background: #fff4d6;
    color: #7a5300 !important;
    border: 1px solid rgba(245, 184, 61, 0.5);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0;
}`;

const bestNew = `.ma-plat__best b {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: fit-content;
    padding: 4px 12px;
    border-radius: 999px;
    background: #ffe401;
    color: #100563 !important;
    border: 1px solid rgba(16, 5, 99, 0.12);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0;
}`;
css = css.replace(norm(bestOld), norm(bestNew));

// 8. ma-plat__watch
const watchOld = `.ma-plat__watch {
    margin: 0;
    padding: 16px 18px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #f5b83d;
    color: #5b6785;
    font-size: 14px;
    line-height: 1.55;
}`;

const watchNew = `.ma-plat__watch {
    margin: 0;
    padding: 16px 20px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #5b6785;
    font-size: 14px;
    line-height: 1.55;
}`;
css = css.replace(norm(watchOld), norm(watchNew));

fs.writeFileSync('src/styles/services/mobile-app-development.css', css, 'utf8');
console.log('Update complete!');
