var GatewaydProcess = require(__dirname+'/../lib/processes/gatewayd_process');

module.exports = function(gatewayd) {
  var listener = new gatewayd.ripple.Listener();

  listener.onPayment = function(payment) {
    gatewayd.logger.info('payment:notification:received', payment);
    if (payment && payment.destination_account === gatewayd.config.get('COLD_WALLET')) {
      var opts = {
        destination_tag : payment.destination_tag,
        transaction_state : payment.result,
        hash : payment.hash,
        source_account: payment.source_account,
        invoice_id: payment.invoice_id,
        memos: payment.memos
      };
      if (opts.destination_tag && (opts.transaction_state === 'tesSUCCESS')){
        if (payment.destination_balance_changes) {
          var destination_amount = payment.destination_balance_changes[0];
          if (destination_amount) {
            opts.destination_amount = destination_amount;
            opts.state = 'incoming';
            var source_amount = payment.source_balance_changes[0];
            if (source_amount) {
              opts.source_amount = source_amount;
              gatewayd.api.recordIncomingPayment(opts)
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

}

if (require.main === module) {
  var gatewaydProcess = new GatewaydProcess(module.exports);
  gatewaydProcess.start();
}

