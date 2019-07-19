const amqp = require('amqplib/callback_api');


let Publisher = {
    publishMessage: async (message) => {
        return new Promise(async (resolve, reject) => {
            try {
                amqp.connect(process.env.RMQConnectionString, function (error0, connection) {
                    if (error0) {
                        reject(error0);
                    } else {
                        connection.createChannel(function (error1, channel) {
                            if (error1) {
                                reject(error1);
                            }

                            try {
                                let msg = message;

                                channel.assertQueue(process.env.QueueName, {
                                    durable: true
                                });
                                channel.sendToQueue(process.env.QueueName, Buffer.from(msg), {
                                    persistent: true
                                });

                                console.log(" [x] Sent %s" + msg);

                                setTimeout(function () {
                                    connection.close();
                                }, 1000);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }

                        });

                    }


                });
            } catch (e) {
                reject(e);
            }
        });
    }
};

module.exports = Publisher;