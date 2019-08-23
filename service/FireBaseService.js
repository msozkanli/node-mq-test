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

const registration_ids = [
    "fxMyRgCmM6o:APA91bGsFwzwO_p5Vc6ksAjjsF5g_bTHveYvPphruOZl-ewwVJG6LihmSPJTbusWYNSg91HJvsAVfiEedtYeYVKbuiKBPlSauvMs6gW6fjxnL0HBCj6o-VoFq_FjhTc-5BnCzdDtFP-w",
    "epFxEUYIwQo:APA91bHUt8wXFp336tIG9AvqMbV-41XVK8R2ZpmKtqUEtTeniEjM3PHEOanKJlZB_F6i_9xtcBi5y2OcpyPOz-UeOXkPnzyGqbRbPbA9NgDaOgDvnaDM26iMh8vQ-wad6xxYxaBCvIT3",
    "eUkAy13Q-7c:APA91bEBfyIjv10cHLw7ctNxKWcjr4YZPOrl4Gmihqm9ESGYQOK0FsHYGaA9uXVCYGJqTHrvkVf2YFb63xiPLn-maYOFm7hfjeZBPA1CZr78IiX5UgfW7QumrKX3x69vSGUrxulHXmQw",
    "eVfkWg81NOI:APA91bEx0oPp6mYSHjUuTTEGztfHR2kN7crXHwukeHgMRbgEv2YVzN9GBcAuGOzl2rFcbva5PwTbbp7VdVSg9BnZP8nPf-NuGR58IwIHpZVaWQd94NVApg7enRyvkZkQXi1y01acM_Ks"];

let FireBaseService = {

    push: async (request, response, next) => {

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
            notificationModel.payload.apns = {
                payload: {
                    aps: {
                        "sound": "default",
                        "badge": 1
                    }
                },
                fcm_options: {
                    image: pushDataJson.notificationHeroUrl
                }
            };

            notificationModel.payload.data = {
                origin: notificationObject.data.origin,
                trackingURL: notificationObject.data.trackingURL,
                type: pushDataJson.notificationType,
                title: pushDataJson.notificationTitle,
                // attachment: "https://media.licdn.com/dms/image/C4E03AQHDsRZOOnZtkQ/profile-displayphoto-shrink_800_800/0?e=1571875200&v=beta&t=3zwx0tSRBCKnhMIzJvS6tkxvGR-SB-ZMIQJnTyQ6Lac",
                // attachment: "https://media1.giphy.com/media/1wR5hlwYM1ch9RR53e/200.gif",
                // attachment: "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                // attachment: "https://www.fashiongonerogue.com/wp-content/uploads/2014/09/armani-fall-1996-ad-campaign01.jpg",
                attachment: pushDataJson.notificationHeroUrl,
                image: pushDataJson.notificationHeroUrl,
                action: "url",
                // media_type: "image",
                media_type: pushDataJson.notificationMediaType ? pushDataJson.notificationMediaType : "image",
                heroHeight: pushDataJson.notificationHeroHeight,
                heroWidth: pushDataJson.notificationHeroWidth,
                heroPosition: pushDataJson.notificationHeroPosition,
                backgroundUrl: pushDataJson.notificationBackgroundUrl,
                backgroundColor: pushDataJson.notificationBackgroundColor,
                language: pushDataJson.notificationLanguage,
                deeplink: pushDataJson.notificationDeeplink,
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
            notificationModel.token = registration_ids[0];
            notificationModel.options = {
                priority: notificationObject.priority === 5 ? "normal" : "high",
                mutableContent: true,
                contentAvailable: true
            };

            var sendDeviceObject = {
                // registration_ids: notificationObject.registration_ids.push(registration_ids),
                registration_ids: registration_ids,
                options: notificationModel.options,
                payload: {
                    notification: {
                        title: notificationModel.payload.notification.title,
                        body: notificationModel.payload.notification.body,
                        badge: "1",
                        click_action: notificationModel.payload.notification.click_action,
                        sound: pushDataJson.notificationSound ? pushDataJson.notificationSound : "standard",
                    },
                    data: notificationModel.payload.data
                }
            };

            console.log("Firebase Object= ", sendDeviceObject);
            fbAdmin.messaging().sendToDevice(sendDeviceObject.registration_ids, sendDeviceObject.payload, sendDeviceObject.options)
                .then(function (firebaseResponse) {
                    console.log("Successfully sent message:", firebaseResponse);
                    response.locals.data = firebaseResponse;
                    next();
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                    next(error);
                });

        }
        catch
            (e) {

            next(e);
        }

    },
    addToken: async (request, response, next) => {

        try {

            var body = "";
            await request.on('data', (chunk) => {
                body = chunk.toString();
            });
            console.log(body);

            let bodyJson = JSON.parse(body);
            registration_ids.push(bodyJson.registration_ids);
            next();
        } catch (e) {
            next(e);
        }

    }


};

module.exports = FireBaseService;