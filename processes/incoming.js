var Promise = require('bluebird');
Error.stackTraceLimit = Infinity;

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

Promise.onPossiblyUnhandledRejection(function(err) {
  console.log('Caught exception: ' + err);
});

var gatewayd = require(__dirname+'/../');
var Listener = require(__dirname+'/../lib/ripple_listener.js');
var listener = new Listener();

listener.onPayment = function(payment) {
  gatewayd.logger.info('payment:notification:received', payment);
  if (payment && payment.destination_account === gatewayd.config.get('COLD_WALLET')) {
    var options = {
      destination_tag : payment.destination_tag,
      transaction_state : payment.result,
      hash : payment.hash,
      source_account: payment.source_account,
      invoice_id: payment.invoice_id,
      memos: payment.memos
    };
    if (options.transaction_state === 'tesSUCCESS'){
      if (payment.destination_balance_changes) {
        var destination_amount = payment.destination_balance_changes[0];
        var source_amount = payment.source_balance_changes[0];
        if (destination_amount && source_amount) {
          options.destination_amount = destination_amount;
          options.state = 'incoming';
          options.source_amount = source_amount;
          gatewayd.api.recordIncomingPayment(options)
            .then(function(rippleTransaction) {
              try {
                gatewayd.logger.info('payment:incoming:recorded', JSON.stringify(rippleTransaction));
              } catch (exception) {
                gatewayd.logger.error('payment:incoming:error', exception);
              }
            })
            .error(function(error) {
              gatewayd.logger.error('payment:incoming:error', error);
            });
        }
      }
    }
  }
};

gatewayd.api.getColdWallet(function(error, address) {
  if (error) {
    throw new Error(error);
  }
  if (!address) {
    throw new Error('Ripple COLD_WALLET not set');
  }
  if (address.getLastPaymentHash()) {
    const hash = address.getLastPaymentHash();
    listener.start(hash); 
    logger.info('Listening for incoming ripple payments from Ripple REST, starting at', hash);
  } else {
    logger.info('LAST_PAYMENT_HASH not set... gatewayd is now fetching it from Ripple.');
    address.fetchLastPaymentHash().then(function(hash) {
      address.setLastPaymentHash(hash).then(function() {
        listener.start(hash);
        logger.info('Listening for incoming ripple payments from Ripple REST, starting at', hash);
      });
    });
  }
});

