const request = require("request");
let fbAdmin = require("firebase-admin");
let serviceAccount = require("../config/maf-push-service-firebase.json");
let mockFbMessage = require('../mock/sap-message-model');
let _ = require("lodash");


const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {document} = (new JSDOM(`...`)).window;


fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount),
    databaseURL: "https://maf-push-service.firebaseio.com"
});

const registration_ids = ["cuX2Bk1VriA:APA91bExT5giSmNogvTK8M0F05lgnKdww_zOUYzugia8mOhESlou2W2tM5vhQIi7ZVYJ8yGXWOWHaghjEZrQyiBCDJn2_fEq5uXCyw0Kl3vy8JcW9z-0xPE-ekiQzvoaVGrjVnXB9JWX",
    "fxMyRgCmM6o:APA91bGsFwzwO_p5Vc6ksAjjsF5g_bTHveYvPphruOZl-ewwVJG6LihmSPJTbusWYNSg91HJvsAVfiEedtYeYVKbuiKBPlSauvMs6gW6fjxnL0HBCj6o-VoFq_FjhTc-5BnCzdDtFP-w"];

let FireBaseService = {

    push: async (request, response, next) => {

        // console.log("Request Body: " + req.body);
        try {
            var body = "";
            await request.on('data', (chunk) => {
                body = chunk.toString();
            });
            console.log(body);

            let htmlElement = document.createElement("div");
            let tempSplitted = body.split("{\"notification\":{\"body\":");
            htmlElement.innerHTML = tempSplitted[1].split(",\"title\":")[0];

            let inputs = htmlElement.getElementsByTagName("input");

            let inputMap = [];

            let customDataBase64Encoded = "";

            console.log("inputs", inputs.length);

            for (let i = 0; i < inputs.length; i++) {

                if (inputs[i].title === "Emoji") {
                    inputMap.push({
                        key: inputs[i].outerHTML.slice(0, -1) + " />",
                        value: inputs[i].getAttribute("value")
                    })
                } else if (inputs[i].getAttribute("class") === "Push-Data") {
                    customDataBase64Encoded = inputs[i].title;
                    inputMap.push({
                        key: inputs[i].outerHTML.replace(/"/g, "\'").slice(0, -1) + " />",
                        value: " "
                    });
                    inputMap.push({
                        key: inputs[i].outerHTML.slice(0, -1) + " />",
                        value: " "
                    });
                } else if (inputs[i].getAttribute("class") === "In-App-Data") {
                    customDataBase64Encoded = inputs[i].title;
                    inputMap.push({
                        key: inputs[i].outerHTML.slice(0, -1) + " />",
                        value: " "
                    });
                    inputMap.push({
                        key: inputs[i].outerHTML.replace(/"/g, "\'").slice(0, -1) + " />",
                        value: " "
                    });

                }
            }

            for (let i = 0; i < inputMap.length; i++) {
                body = body.replace(inputMap[i].key, inputMap[i].value);
            }

            body = body.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t")
                .replace(/\f/g, "\\f");


            let jsonBodyObjectString = body.split("{\"notification\":{\"body\":\"");
            let tempBody = jsonBodyObjectString[1].split("\",\"title\":")[0];
            body = body.replace(tempBody, tempBody.replace(/"/, '\\"'));


            let notificationObject = JSON.parse(body);
            console.log("Notification Object", notificationObject);

            let base64Buffer = new Buffer.from(customDataBase64Encoded, "base64");

            let pushDataString = base64Buffer.toString();

            let pushDataJson = JSON.parse(pushDataString);

            console.log("pushData", pushDataJson);


            let notificationModel = {};
            notificationModel.payload = {};
            notificationModel.payload.notification = notificationObject.notification;

            notificationModel.payload.data = {
                origin: notificationObject.data.origin,
                trackingURL: notificationObject.data.trackingURL,
                type: pushDataJson.notificationType,
                title: pushDataJson.notificationTitle,
                heroUrl: pushDataJson.notificationHeroUrl,
                heroHeight: pushDataJson.notificationHeroHeight,
                heroWidth: pushDataJson.notificationHeroWidth,
                heroPosition: pushDataJson.notificationHeroPosition,
                backgroundUrl: pushDataJson.notificationBackgroundUrl,
                backgroundColor: pushDataJson.notificationBackgroundColor,
                language: pushDataJson.notificationLanguage,
                deeplink: pushDataJson.notificationDeeplink
            };

            if (pushDataJson.notificationActions.length > 0) {

                for (let i = 0; i < pushDataJson.notificationActions.length; i++) {

                    notificationModel.payload.data["action" + i.toString() + "_name"] = pushDataJson.notificationActions[i].name;
                    notificationModel.payload.data["action" + i.toString() + "_buttonText"] = pushDataJson.notificationActions[i].buttonText;
                    notificationModel.payload.data["action" + i.toString() + "_backgroundColor"] = pushDataJson.notificationActions[i].backgroundColor;
                    notificationModel.payload.data["action" + i.toString() + "_buttonAction"] = pushDataJson.notificationActions[i].buttonAction;
                    notificationModel.payload.data["action" + i.toString() + "_status"] = pushDataJson.notificationActions[i].status.toString();

                }

            }
            notificationModel.registration_ids = registration_ids;

            notificationModel.options = {
                content_available: true,
                priority: notificationObject.priority === 5 ? "normal" : "high"
            };

            fbAdmin.messaging().sendToDevice(notificationModel.registration_ids, notificationModel.payload, notificationModel.options)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                    next()
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                    next(error);
                });

            next();
        }
        catch
            (e) {

            next(e);
        }


    }
    ,


};

module.exports = FireBaseService;