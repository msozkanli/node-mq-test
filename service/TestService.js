const request = require("request");

let TestService = {

    getTest: async (req, res, next) => {

        res.locals.messages = "Test endpoint works";

        next();

    },

    writeRequest: async (req, res, next) => {

        console.log(req.headers);
        console.log(req.body);

        next();
    },
    sapTestRequest: async (req, res, next) => {

        let jar = req.jar();
        let sap_cookie = req.cookie("SAP_SESSIONID_E4T_100", "4ZbrzpkPDvRXkX8oDdLIPBHk4za1ARHpolwCAAobqIU%3d");

        var url = 'https://Marketing01:Welcome1@gdm-maf.demo.hybris.com/sap/opu/odata/sap/API_MKT_CAMPAIGN_MESSAGE_SRV/Messages?$top=100';
        jar.setCookie(sap_cookie, url);

        var cookie = "sap-usercontext=sap-client=100;SAP_SESSIONID_E4T_100=fsi546XzDyZhlRB8asvif8zFvMu1BBHpougCAAobqIU%3d"
        var options = {
            headers: {
                "Content-Type": "applicati" +
                    "on/json",
                "Accept": "application/json",
                "x-csrf-token": "fetch",
                "Cookie":cookie
            },
            url: url,
            jar: jar
        };

        req(options,function (error,response,body) {
            console.log(response.headers["x-csrf-token"]);
            next();
        });

    }
};


module.exports = TestService;