const amqp = require('amqplib/callback_api');
const _ = require("lodash");

const mqConsumer = require('../manager/mq/consumer');
const mqPublisher = require('../manager/mq/publisher');


let RMQService = {


    publish: async (req, res, next) => {

        let messageModel = _.pick(req.body, [
            "message"
        ]);
        try {
            await mqPublisher.publishMessage(messageModel.message);
            next();
        } catch (e) {
            next(e);
        }

    },
    startWorker: async () => {

        mqConsumer.startConsume();

    }


};


module.exports = RMQService;