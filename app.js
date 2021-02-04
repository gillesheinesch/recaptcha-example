const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
require('dotenv').config();
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(process.env.RECAPTCHA_WEBSITEKEY, process.env.RECAPTCHA_SECRETKEY, {
    callback: 'cb',
});
const app = express();

// Setup Handlebars
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  layoutsDir: `${__dirname}/views/layouts/`,
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* GET home page. */
app.get('/', recaptcha.middleware.render, async (req, res, next) => {
    return res.render('index', {
        captcha: res.recaptcha,
    })
});

/* POST home page. */
app.post('/', recaptcha.middleware.verify, async (req, res, next) => {
    if (!req.recaptcha.error) {
        return res.redirect('/?worked=true')
    } else {
        return res.json(`Recaptcha error: ${req.recaptcha.error}`)
    }
});

app.listen(80, () => {
    console.log(`Example app listening at http://localhost:80`)
});

module.exports = app;
