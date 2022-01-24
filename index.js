var queueName = 'message';

function bail(err) {
  console.error(err);
  process.exit(1);
}


function publisher(conn) {
  conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(queueName);
    ch.sendToQueue(queueName, Buffer.from('Hello world'));
  }
}

function consumer(conn) {
    var ok = conn.createChannel(on_open);
    function on_open(err, ch) {
      if (err != null) bail(err);
      ch.assertQueue(queueName);
      ch.consume(queueName, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString(), 'message');
          ch.ack(msg);
        }
      });
    }
}


require('amqplib/callback_api')
  .connect('amqp://localhost', function(err, conn) {
    if (err != null) bail(err);
    consumer(conn);
    publisher(conn);
  });