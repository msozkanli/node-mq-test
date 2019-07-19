const amqp = require('amqplib/callback_api');


let Consumer = {

    startConsume: () => {
        amqp.connect(process.env.RMQConnectionString, function (error, connection) {
            connection.createChannel(function (error, channel) {

                channel.assertQueue(process.env.QueueName, {
                    durable: true
                });
                channel.prefetch(1);
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", process.env.QueueName);
                channel.consume(process.env.QueueName, function (msg) {
                    var secs = msg.content.toString().split('.').length - 1;

                    console.log(" [x] Received %s", msg.content.toString());
                    setTimeout(function () {
                        console.log(" [x] Done");
                        channel.ack(msg);
                    }, secs * 1000);
                }, {
                    noAck: false
                });
            });
        });
    }
};

module.exports = Consumer;