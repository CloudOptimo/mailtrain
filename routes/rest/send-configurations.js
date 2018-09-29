'use strict';

const passport = require('../../lib/passport');
const sendConfigurations = require('../../models/send-configurations');

const router = require('../../lib/router-async').create();
const {castToInteger} = require('../../lib/helpers');


router.getAsync('/send-configurations-private/:sendConfigurationId', passport.loggedIn, async (req, res) => {
    const sendConfiguration = await sendConfigurations.getById(req.context, castToInteger(req.params.sendConfigurationId), true, true);
    sendConfiguration.hash = sendConfigurations.hash(sendConfiguration);
    return res.json(sendConfiguration);
});

router.getAsync('/send-configurations-public/:sendConfigurationId', passport.loggedIn, async (req, res) => {
    const sendConfiguration = await sendConfigurations.getById(req.context, castToInteger(req.params.sendConfigurationId), true, false);
    sendConfiguration.hash = sendConfigurations.hash(sendConfiguration);
    return res.json(sendConfiguration);
});

router.postAsync('/send-configurations', passport.loggedIn, passport.csrfProtection, async (req, res) => {
    return res.json(await sendConfigurations.create(req.context, req.body));
});

router.putAsync('/send-configurations/:sendConfigurationId', passport.loggedIn, passport.csrfProtection, async (req, res) => {
    const sendConfiguration = req.body;
    sendConfiguration.id = castToInteger(req.params.sendConfigurationId);

    await sendConfigurations.updateWithConsistencyCheck(req.context, sendConfiguration);
    return res.json();
});

router.deleteAsync('/send-configurations/:sendConfigurationId', passport.loggedIn, passport.csrfProtection, async (req, res) => {
    await sendConfigurations.remove(req.context, castToInteger(req.params.sendConfigurationId));
    return res.json();
});

router.postAsync('/send-configurations-table', passport.loggedIn, async (req, res) => {
    return res.json(await sendConfigurations.listDTAjax(req.context, req.body));
});

module.exports = router;